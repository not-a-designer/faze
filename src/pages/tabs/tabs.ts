/***************************ANGULAR REQUIREMENTS***************************/
import { Component,
         ViewChild }                   from '@angular/core';

/************************IONIC-ANGULAR REQUIREMENTS************************/
import { IonicPage, 
         ActionSheetController,
         AlertController,
         Content, 
         LoadingController,
         Modal,
         ModalController,
         NavController, 
         NavParams, 
         Platform,
         Slides,
         ViewController }              from 'ionic-angular';

/**************************IONIC-NATIVE IMPORTS***************************/
import { CameraPreview,
         CameraPreviewDimensions,
         CameraPreviewOptions, 
         CameraPreviewPictureOptions } from '@ionic-native/camera-preview';

import { Diagnostic }                  from '@ionic-native/diagnostic';

import { PhotoLibrary, LibraryItem }   from '@ionic-native/photo-library';

import { StatusBar }                   from '@ionic-native/status-bar';

/*******************************APP IMPORTS*******************************/
//MODELS
import { Profile }                     from '../../models/classes/profile';
import { User }                        from '../../models/classes/user';
//COMPONENTS
import { ProfilesListComponent }       from '../../components/profiles-list/profiles-list';
import { ProfileDetailsComponent }     from '../../components/profile-details/profile-details';
import { CameraPreviewComponent }      from '../../components/camera-preview/camera-preview';
import { TabsNavbarComponent }         from '../../components/tabs-navbar/tabs-navbar';
import { UserSettingsComponent }       from '../../components/user-settings/user-settings';
//SERVICES
import { AuthService }                 from '../../services/auth.service';
//import { ImageStorageService }         from '../../services/image-storage.service';
import { LoggerService }               from '../../services/logger.service';
import { ProfileService }              from '../../services/profile.service';
import { StorageService }              from '../../services/storage.service';
import { UserService }                 from '../../services/user.service';

/****************************ANIMATIONS IMPORT****************************/
import { fade, 
         fadeIn, 
         fadeOut, 
         slideFromLeft, 
         slideFromRight, 
         scale }                       from '../../app/app.animations';

/****************************3RD PARTY IMPORTS****************************/
import { Observable }                  from 'rxjs/Observable';
import 'rxjs/add/operator/take';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  animations: [
    fade,
    fadeIn,
    fadeOut,
    slideFromRight,
    slideFromLeft,
    scale
  ]
})
export class TabsPage {

  /**DECORATED PAGE VARIABLES**/

  //main slides reference
  @ViewChild('tabs')
  public tabs: Slides;

  //details slides reference
  @ViewChild('thumbSlide')
  thumbSlide: Slides;

  //ion-content reference
  @ViewChild(Content)
  content: Content;

  //navbar component reference
  @ViewChild(TabsNavbarComponent)
  tabsNavbarCmp: TabsNavbarComponent;

  //profileList component reference
  @ViewChild(ProfilesListComponent)
  profilesListCmp: ProfilesListComponent;

  //profileDetails component reference
  @ViewChild(ProfileDetailsComponent)
  profileDetailsCmp: ProfileDetailsComponent;

  //cameraPreview component reference
  @ViewChild(CameraPreviewComponent)
  camPrevCmp: CameraPreviewComponent;

  //userSettings component reference
  @ViewChild(UserSettingsComponent)
  userSettingsCmp: UserSettingsComponent;
  /******END DECORATED VARIABLES*******/


  /*************PAGE VARIABLES**************/

  //
  activeUser: User = null;
  userId: string = null;
  previewImage: string;
  previousImage: string;

  socialData: Array<{ icon: string, text: string, name: string }> = [
    {
      icon: 'logo-google',
      text: 'Google',
      name: 'google'
    }, {
      icon: 'logo-facebook',
      text: 'Facebook',
      name: 'facebook'
    }, {
      icon: 'logo-instagram',
      text: 'Instagram',
      name: 'instagram'
    }, {
      icon: 'logo-twitter',
      text: 'Twitter',
      name: 'twitter'
    }, {
      icon: 'mail',
      text: 'Email',
      name: 'email'
    }, {
      icon: 'phone',
      text: 'SMS',
      name: 'message'
    }
  ];

  /** selected image on profileslistcomponent */
  selectedId: string = null;
  selectedProfile: Profile = null;
  profiles$: Observable<Profile[]>;
  profiles: Profile[] = [];

  showProfileOptions: boolean = false;
  isSettingsVisible: boolean = true;
  isFlashAvailable: boolean = true;

  settingsModal: Modal;
/***************END PAGE VARIABLES*****************/ 

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController, 
              public navParams: NavParams,
              public platform: Platform,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private authService: AuthService,
              private logger: LoggerService,
              private profileService: ProfileService,
              private userService: UserService,
              private storage: StorageService,
              private cameraPreview: CameraPreview,
              private diagnostic: Diagnostic,
              private photoLibrary: PhotoLibrary,
              private statusBar: StatusBar) {}

  /********LIFECYCLE HOOK FUNCTIONS********/
  async ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
    
    try {
      this.userId = (this.navParams.data.userId) ? 
        this.navParams.data.userId : 
        (await this.storage.fetchFromStorage('userId'));

      if (this.userId != null) {
        console.log('tabspage user id found in storage', this.userId);
        this.userService.getUser(this.userId)
        .valueChanges()
        .take(1)
        .subscribe((u: User) => {
          this.activeUser = u;
          //this.tabsNavbarCmp.currentUser = this.activeUser;
        });
      }
      else {
        this.authService.user$.subscribe((user: User) => {
          if (user) {
            this.activeUser = user;
            this.userId = user.uid;
            this.storage.saveToStorage('userId', this.userId);
          }
        });
      }  
      
      this.tabs.centeredSlides = false;
      this.tabs.initialSlide = this.navParams.data.index ? this.navParams.data.index : 1; 
      this.profilesListCmp.loadProfiles(); 
      this.checkCameraPermissions();
    }
    catch(e) { this.logger.logError(`error loading user ${e.message}`) }
  }

  async ionViewDidEnter() {
    this.resizeTabs();
    this.logNewTab();
    this.tabs.lockSwipes(true); 
    this.tabsNavbarCmp.activeTab = 1;
    this.profilesListCmp.uid = this.userId;
    this.tabsNavbarCmp.changeTitle('Profiles');
    this.profilesListCmp.uid = this.userId;
    this.hideCamera();
  }

  /*********************************************************************************/
 /*******************************PAGE FUNCTIONS************************************/
/*********************************************************************************/


  /***************************************************/
 /**************NAVIGATION METHODS*******************/
/***************************************************/
  public handleActions(event: string) {
    //navbar actions
    if (event === 'newProfile') this.showNewProfileAlert();
    else if (event === 'share') this.showShareOptions();
    else if (event === 'camera') this.slideToCamera();
    else if (event === 'deleteProfile') this.deleteProfile(this.selectedProfile.id);
    else if (event === 'details') this.slideToDetails();
    else if (event === 'showSettings') this.showSettings();
    else if (event === 'hideSettings') this.dismissSettings();
    else if (event === 'home' && this.getCurrentTab() !== 1) this.slideToProfiles();
    else if (event === 'logout') this.logout();
    //camera actions
    else if (event === 'deletePreview') this.deletePreview();
    else if (event === 'capturePreview') this.capturePreview();
    else if (event === 'savePreview') this.savePreview(this.previewImage);
    else if (event === 'toggleDirection') this.switchCamera();
    else if (event === 'toggleFlash') this.toggleFlash();
    //dual purpose
    else if (event === 'back') this.slideToProfiles();
    else console.log('action error');
  }

  public getCurrentTab() { return this.tabs.getActiveIndex() }

  toggleProfile(event) {
    if (event == null) {
      this.selectedId = null;
      this.selectedProfile = null;
      this.tabsNavbarCmp.changeTitle('Profiles');
      this.tabsNavbarCmp.profileOptions = false;
    }
    else {
      this.selectedId = event.id;
      this.selectedProfile = event;
      this.tabsNavbarCmp.changeTitle(event.name);
      this.tabsNavbarCmp.profileOptions = true;
    }
  }

  public slideToCamera() {
    this.showCamera();
    this.unlockTabs();
    if (this.selectedProfile.images && this.selectedProfile.images.length > 2) {
      const len: number = this.selectedProfile.images.length - 1;
      this.previousImage = this.selectedProfile.images[len];
    }
    this.tabs.slideTo(2);
    this.resizeTabs();
    this.tabsNavbarCmp.activeTab = 2;
    this.statusBar.hide();
  }

  public slideToDetails() {
    if (this.selectedId == null) return;
    else {
      this.profileDetailsCmp.loadProfile(this.selectedProfile);
      console.log('details profile', this.selectedProfile);
      this.unlockTabs();
      this.tabs.slideTo(0);
      this.tabsNavbarCmp.activeTab = 0;
    }
  }

  public slideToProfiles() {
    this.statusBar.show();
    this.profileService.updateProfile(this.profileDetailsCmp.profile);
    this.camPrevCmp.isOpacityOpen = false;
    this.camPrevCmp.isPicTaken = false;
    this.unlockTabs();
    this.tabs.slideTo(1);
    this.hideCamera();
    const loader = this.loadingCtrl.create({ content: 'Loading profiles...' });
    loader.onDidDismiss(() => this.profilesListCmp.isLoading = false);
    loader.present();
    setTimeout(() => {
      
      this.profilesListCmp.loadProfiles();
      console.log('from tabs, profiles');
      this.profilesListCmp.profiles.forEach(p => console.log(p.id));
      loader.dismiss();
      this.tabsNavbarCmp.activeTab = 1;
      this.toggleProfile(null);
    }, 750);
  }

  

  public refreshProfiles(refresher) {
    console.log('begin refresher', refresher);
    setTimeout(() => {
      this.profilesListCmp.loadProfiles();
      console.log('refresh completed');
      refresher.complete();
    }, 750);
  }
  
  public showShareOptions() {
    let shareActionSheet = this.actionSheetCtrl.create({
      title: 'Share'
    });

    const cancelButton = {
      text: 'Cancel',
      role: 'cancel',
      handler: () => console.log('cancel share')
    };

    for (let soc of this.socialData) {
      let button = {
        text: soc.text,
        handler: () => {
          //TODO
          //SHARE FEATURE
          console.log(soc.text + ' clicked');
        }
      }
      shareActionSheet.addButton(button);  
    }
    shareActionSheet.addButton(cancelButton);
    shareActionSheet.present();
  }

  showSettings() {
    this.tabsNavbarCmp.changeTitle('Settings');
    this.settingsModal = this.modalCtrl.create(UserSettingsComponent, { currentUser: this.activeUser }, { cssClass: 'settings-modal' });
    this.settingsModal.present();
  }

  dismissSettings() { 
    this.settingsModal.onDidDismiss(() => {
      this.userService.updatePersonalData(this.userService.updatedUser.uid, this.userService.updatedUser);
    });
    const loader = this.loadingCtrl.create({ content: 'update info...' });
    loader.present();

    
    setTimeout(() => {
      this.settingsModal.dismiss();
      loader.dismiss();
    }, 750);
   }
   
   public logout() {
     this.settingsModal.dismiss();
     this.authService.signOut();
     this.navCtrl.setRoot('LoginPage');
   }

  //event paramater should be profile id from template
  public deleteProfile(event: string) {
    this.alertCtrl.create({
      title: 'Delete Profile',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('dont delete profile')
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.profileService.deleteProfile(event);
            this.profilesListCmp.loadProfiles();
            if (this.getCurrentTab() === 0) this.slideToProfiles();
          }
        }
      ]
    }).present();
  }

  showNewProfileAlert() {
    this.alertCtrl.create({
      title: 'New Profile',
      message: 'Please add a title and alarm, decription optional',
      inputs: [
        {
          type: 'text',
          placeholder: 'Name',
          name: 'name',
        }, {
          type: 'datetime',
          placeholder: 'Alarm',
          name: 'alarm'
        }, {
          type: 'textarea',
          placeholder: 'Description',
          name: 'desc'
        } 
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Cancel new Profile')
        }, {
          text: 'Start',
          handler: (data) => {
            const loader = this.loadingCtrl.create({
              content: 'creating profile...'
            });
            loader.onDidDismiss(() => {
              this.profilesListCmp.loadProfiles();
            });
            loader.present();

            this.profileService.addProfile({
              alarm: data.alarm, 
              name: data.name, 
              desc: data.desc
            });
            loader.dismiss();

          }
        }
      ]
    }).present()
  }

  /** CAMERA FUNCTIONS */
  async checkPermissions() {
    this.checkCameraPermissions();
    this.checkPhotoLibraryPermissions();
  }

  /** CAPTURE CAMERA-PREVIEW IMAGE */
  //toggle opacity fab to hidden
  //clear preview image data
  //show loading spinner while image from camera preview is capture
  public async capturePreview() {

    const CAPTURE_OPTIONS: CameraPreviewPictureOptions = {
      width: this.platform.width(),
      height: this.platform.height() + 25,
      quality: 90
    };

    const loader = this.loadingCtrl.create({ content: 'steady....' });
    loader.present();

    setTimeout(async () => {
      try {
        const result = await this.cameraPreview.takePicture(CAPTURE_OPTIONS);
        const imageData = `data:image/jpeg;base64,${result}`;
        this.hideCamera();
        this.previewImage = imageData;
        this.camPrevCmp.isPicTaken = true;
        loader.dismiss();
      }
      catch(e) { 
        this.logger.logError(`picture capture error ${e.message}`)
        loader.dismiss();
      }
    }, 750);
  }

  public deletePreview() {
    this.alertCtrl.create({
      title: 'Delete Capture',
      message: 'Are you sure you want to delete the preview?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('dont delete')
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.previewImage = null;
            this.camPrevCmp.isPicTaken = false;
            this.showCamera();
          }
        }
      ]
    }).present();
    
  }
  public async savePreview(imgUrl: string) {
    try {
      const savedPreview: LibraryItem = await this.photoLibrary.saveImage(imgUrl, this.selectedProfile.name);
      this.previewImage = null;
      this.camPrevCmp.isPicTaken = false;
      this.slideToDetails();
    }
    catch(e) { this.logger.logError(`error saving to photo library ${e.message}`) }
  }

  async cameraBack() {
    /*try {
      await this.cameraPreview.onBackButton();
      this.slideToProfiles();
    }
    catch(e) { this.logger.logError(`back button error ${e}`) }*/
  }

  startCamera() { 
    const PREVIEW_DIMENSIONS: CameraPreviewDimensions = {
      height: this.platform.height() + 25,
      width: this.platform.width()
    };

    const PREVIEW_OPTIONS: CameraPreviewOptions = {
      x: 0,
      y: 0,
      height: PREVIEW_DIMENSIONS.height,
      width: PREVIEW_DIMENSIONS.width,
      tapPhoto: false,
      toBack: true,
      previewDrag: false,
      camera: this.cameraPreview.CAMERA_DIRECTION.FRONT,
      alpha: 1
    };
    this.cameraPreview.startCamera(PREVIEW_OPTIONS);
  }

  stopCamera() { this.cameraPreview.stopCamera() }

  hideCamera() { this.cameraPreview.hide() }

  showCamera() { this.cameraPreview.show() }

  public switchCamera() { this.cameraPreview.switchCamera() }

  public async toggleFlash() {
    try {
      const flashMode: string = await this.cameraPreview.getFlashMode();
      const newMode: string = flashMode === 'off' ? 'on' : 'off';
      this.cameraPreview.setFlashMode(newMode);
    }
    catch(e) { this.logger.logError(`flash error ${e}`) }
  }

  logNewTab() {
    this.resizeTabs();
    console.log('current tab, ', this.getCurrentTab());
  }

  resizeTabs() {
    //setTimeout(() => {
      this.content.resize();
      this.tabs.resize();
   // }, 310);
      this.lockTabs();
  }

  public lockTabs() { this.tabs.lockSwipes(true) }
  private unlockTabs() { this.tabs.lockSwipes(false) }

  private async checkCameraPermissions() {
    try {
      const available = await this.diagnostic.isCameraAvailable();
      //if camera is present and authorized
      if (available) this.startCamera();
      else {
        //camera is either not present or authorized
        const present = await this.diagnostic.isCameraPresent();
        //camera is present
        if (present) {
          //check authorization status
          const status = await this.diagnostic.isCameraAuthorized();
          //if camera is authorized
          if (status === this.diagnostic.permissionStatus.GRANTED) this.startCamera();
          else {
            //camera is not authorized, request permissions
            const authorized = await this.diagnostic.requestCameraAuthorization();
            if (authorized) this.startCamera();
            else this.logger.logError('The camera is not authorized');
          }
        }
        else { this.logger.logError('no camera present on this device') }
      }
      this.isFlashAvailable = await this.getFlashAvailable();
    }
    catch(e) { this.logger.logError(`diagnostics error ${e}`) }
  }

  private async checkPhotoLibraryPermissions() {
    try { 
      await this.photoLibrary.requestAuthorization({ read: true, write: true });
      this.logger.logCompleted(`library access granted`);
    }
    catch(e) { this.logger.logError(`photolibrary authorization error ${e.message}`) }
  }

  async getFlashAvailable(): Promise<boolean> {
    try {
      const flashModes = await this.cameraPreview.getSupportedFlashModes();
      let flashList: string  = '';
      if (flashModes.length) {
        flashModes.forEach(flash => {
          flashList += `${flash}, `;
        });
        this.logger.logCompleted(`flash avalaible: ${flashList}`);
      }
      else this.logger.logError('no flash available');
      return flashModes.length > 1;
    }
    catch(e) { this.logger.logError(`flash error ${e}`) }
  }

  get isNative(): boolean {
    return (this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios'));
  }
}
