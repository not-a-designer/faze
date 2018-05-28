/***************************ANGULAR REQUIREMENTS***************************/
import { Component,
         ViewChild }                   from '@angular/core';

/************************IONIC-ANGULAR REQUIREMENTS************************/
import { IonicPage, 
         ActionSheetController,
         AlertController,
         Content, 
         FabContainer,
         LoadingController,
         Modal,
         ModalController,
         NavController, 
         NavParams, 
         Platform,
         Range,
         Slides,
         ViewController }              from 'ionic-angular';

/**************************IONIC-NATIVE IMPORTS***************************/
import { CameraPreview,
         CameraPreviewDimensions,
         CameraPreviewOptions,
         CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
import { Diagnostic }                  from '@ionic-native/diagnostic';
import { PhotoLibrary,
         LibraryItem }                 from '@ionic-native/photo-library';
import { StatusBar }                   from '@ionic-native/status-bar';

/*******************************APP IMPORTS*******************************/
//MODELS
import { Profile }                     from '../../models/classes/profile';
import { User }                        from '../../models/classes/user';
//COMPONENTS
import { ProfilesListComponent }       from '../../components/profiles-list/profiles-list';
import { ProfileDetailsComponent }     from '../../components/profile-details/profile-details';
import { TabsNavbarComponent }         from '../../components/tabs-navbar/tabs-navbar';
import { UserSettingsComponent }       from '../../components/user-settings/user-settings';
//SERVICES
import { AuthService }                 from '../../services/auth.service';
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

   /********DECORATED PAGE VARIABLES********/
  /**                                     */
  @ViewChild('tabs')
  public tabs: Slides;

  @ViewChild('thumbSlide')
  thumbSlide: Slides;

  @ViewChild(Content)
  content: Content;

  @ViewChild('opacityFab')
  opacityFab: FabContainer;

  @ViewChild(Range)
  opacityRange: Range;

  @ViewChild(HTMLImageElement)
  captureImage: HTMLImageElement;

  @ViewChild(TabsNavbarComponent)
  tabsNavbarCmp: TabsNavbarComponent;

  @ViewChild(ProfilesListComponent)
  profilesListCmp: ProfilesListComponent;

  @ViewChild(ProfileDetailsComponent)
  profileDetailsCmp: ProfileDetailsComponent;

  @ViewChild(UserSettingsComponent)
  userSettingsCmp: UserSettingsComponent;
   /**                                      */
  /*********END DECORATED VARIABLES**********/


   /*************PAGE VARIABLES**************/
  /**                                      */
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

  /** camera button toggle */
  isPicTaken: boolean = false;

  /** camera direction toggle */
  isFrontFacing: boolean = true;

  /** flas toggle */
  isFlashOn: boolean = false;

  /** previous image overlay opacity toggle */
  isOpacityOpen: boolean = false;

  /** previous image overlay opacity */
  opacity: number = 0;

  /** selected image on profileslistcomponent */
  selectedId: string = null;
  selectedProfile: Profile = null;
  profiles$: Observable<Profile[]>;
  profiles: Profile[] = [];

  showProfileOptions: boolean = false;
  isSettingsVisible: boolean = true;

  settingsModal: Modal;

   /**************CAMERA-PREVIEW VARIABLES**************/
  /**     camera-preview.takePicuture parameter       */
  previewPictureOptions: CameraPreviewPictureOptions = {
    width: window.screen.width,
    height: window.screen.width,
    quality: 85
  };

  /** camera-preview.startCamera height and width parameters */
  previewDimensions: CameraPreviewDimensions = {
    height: window.screen.height,
    width: window.screen.width
  };

  /** camera-preview.startCamera parameter */
  previewOptions: CameraPreviewOptions = {
    x: 0,
    y: 0,
    height: this.previewDimensions.height,
    width: this.previewDimensions.width,
    tapPhoto: false,
    toBack: true,
    previewDrag: false,
    camera: this.cameraPreview.CAMERA_DIRECTION.FRONT,
    alpha: 1
  };
 /**                                               */
/***************END PAGE VARIABLES*****************/ 

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController, 
              public navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private platform: Platform,
              private authService: AuthService,
              private logger: LoggerService,
              private profileService: ProfileService,
              private userService: UserService,
              private storage: StorageService,
              private cameraPreview: CameraPreview,
              private diagnostic: Diagnostic,
              private photoLibrary: PhotoLibrary,
              private statusBar: StatusBar) {

  }

  /** LIFECYCLE HOOK FUNCTIONS */
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
          this.tabsNavbarCmp.currentUser = this.activeUser;
          
        });
      }
      else {
        this.authService.user$.subscribe((user: User) => {
          if (user) {
            this.activeUser = user;
            this.tabsNavbarCmp.currentUser = this.activeUser;
            this.userId = user.uid;
            this.storage.saveToStorage('userId', this.userId);
          }
        });
      }           
    }
    catch(e) { this.logger.logError(`error loading user ${e.message}`) }
    
    if(this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.cameraPreview.onBackButton().then(() => this.slideToProfiles);
      });
    }

    this.tabs.centeredSlides = false;
    this.tabs.initialSlide = this.navParams.data.index ? this.navParams.data.index : 1; 

    this.checkPermissions();

    this.getFlashAvailable();
    this.tabsNavbarCmp.changeTitle('Profiles');
    this.profilesListCmp.uid = this.userId;
    this.profilesListCmp.loadProfiles();
    /*const loader = this.loadingCtrl.create({ content: 'Loading profiles...' });
    loader.onDidDismiss(() => this.profilesListCmp.isLoading = false);
    loader.present();
    
    setTimeout(() => {
      this.profilesListCmp.uid = this.userId;
      this.profilesListCmp.loadProfiles();
      console.log('from tabs, profiles');
      this.profilesListCmp.profiles.forEach(p => console.log(p.id));
      loader.dismiss();
    }, 750);*/
    
  }

  ionViewDidEnter() {
    this.resizeTabs();
    this.logNewTab();
    this.tabs.lockSwipes(true); 
    this.tabsNavbarCmp.activeTab = 1;
    this.profilesListCmp.uid = this.userId;
    
  }

   /*
    * PAGE FUNCTIONS * 
                     */

  /*
   * NAVIGATION METHODS *
                        */

  public getCurrentTab() {
    return this.tabs.getActiveIndex();
  }

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
    this.platform.ready()
      .then(() => this.statusBar.hide())
      .catch((error) => this.logger.logError(`hide statusbar error ${error.message}`));
    this.showCamera();
    this.unlockTabs();
    if (this.selectedProfile.images && this.selectedProfile.images.length > 2) {
      const len: number = this.selectedProfile.images.length - 1;
      this.previousImage = this.selectedProfile.images[len];
    }
    if (this.getCurrentTab() === 0) {
      this.tabs.slideTo(2, 0);
      this.resizeTabs();
    }//this.navCtrl.setRoot('TabsPage', { index: 2 });
    else {
      this.tabs.slideTo(2);
      this.resizeTabs();
    }
    this.tabsNavbarCmp.activeTab = 2;
    
    //setTimeout(() => this.content.resize(), 305);//resizeTabs();
  };

  public slideToDetails() {
    if (this.selectedId == null) return;
    else {
      this.profileDetailsCmp.loadProfile(this.selectedProfile);
      console.log('details profile', this.selectedProfile);
      this.unlockTabs();
      this.tabs.slideTo(0);
      this.hideCamera();
      this.tabsNavbarCmp.activeTab = 0;
    }
  }

  public slideToProfiles() {
    this.statusBar.show();
    this.profileService.updateProfile(this.profileDetailsCmp.profile);
    
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

  public handleNavbarActions(event) {
    if (event === 'new') this.showNewProfileAlert();
    if (event === 'share') this.showShareOptions();
    if (event === 'camera') this.slideToCamera();
    if (event === 'delete') this.deleteProfile(this.selectedProfile.id);
    if (event === 'details') this.slideToDetails();
    if (event === 'settings') this.showSettings();
    if (event === 'hide') this.dismissSettings();
    if (event === 'home' && this.getCurrentTab() !== 1) this.slideToProfiles();
    if (event === 'logout') this.logout();
  }

  public update(event) { 
    console.log(JSON.stringify(event));
    //this.userService.updatePersonalData(data.uid, data.personalData); 
  }

  public refreshProfiles(refresher) {
    console.log('begin refresher', refresher);
    setTimeout(() => {
      this.profilesListCmp.loadProfiles();
      console.log('refresh completed');
      refresher.complete();
    }, 1500);
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
    //console.log(this.activeUser);
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
  deleteProfile(event: string) {
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
  checkPermissions() {
    if (this.platform.is('cordova')) {
      this.checkCameraPermissions();
      this.checkPhotoLibraryPermissions();
    }
  }

  public async capturePreview() {
    this.isOpacityOpen = false;
    this.opacityFab.close();
    this.previewImage = '';

    const loader = this.loadingCtrl.create({ content: 'steady....' });
    loader.present();

    setTimeout(async () => {
      try {
        const result = await this.cameraPreview.takePicture(this.previewPictureOptions);
        const imageData = `data:image/jpeg;base64,${result}`;
        this.isPicTaken = true; 
        this.hideCamera();
        this.previewImage = imageData;
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
            this.previewImage = '';
            this.isPicTaken = false;
            this.showCamera();
          }
        }
      ]
    }).present();
    
  }
  public async savePreview(imgUrl: string, profileTitle: string) {
    try {
      const thumbnailData = {
        thumbnailWidth: 512,
        thumbnailHeight: 512,
        quality: .99,
        includeAlbumData: true
      };
      const savedPreview: LibraryItem = await this.photoLibrary.saveImage(imgUrl, profileTitle, thumbnailData);
      console.log(savedPreview);
    }
    catch(e) { this.logger.logError(`error saving to photo library ${e.message}`) }
  }

  async cameraBack() {
    try {
      await this.cameraPreview.onBackButton();
      this.slideToProfiles();
    }
    catch(e) { this.logger.logError(`back button error ${e}`) }
  }

  startCamera() { this.cameraPreview.startCamera(this.previewOptions); }

  hideCamera() { this.cameraPreview.hide(); }

  showCamera() { this.cameraPreview.show(); }

  public switchCamera() {
    this.cameraPreview.switchCamera();
    this.isFrontFacing = !this.isFrontFacing;
  }

  public toggleOpacity() {
    this.isOpacityOpen = !this.isOpacityOpen;
  }

  public toggleFlash() {
    let flashMode: string = (this.isFlashOn === true) ? 'off' : 'on';
    this.cameraPreview.setFlashMode(flashMode);
    this.isFlashOn = !this.isFlashOn;
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
      await this.platform.ready();
      const available = await this.diagnostic.isCameraAvailable();
      //if camera is present and authorized
      if (available) this.startCamera();
      else {
        //camera is either not present or authorized
        const present = await this.diagnostic.isCameraPresent()
        //camera is present
        if (present) {
          this.logger.logCompleted('Camera is present');
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
        else {
          this.logger.logError('no camera present on this device');
        }
      }
    }
    catch(e) { this.logger.logError(`diagnostics error ${e.message}`) }
  }
  private async checkPhotoLibraryPermissions() {
    try { 
      await this.platform.ready();
      await this.photoLibrary.requestAuthorization({ read: true, write: true });
    }
    catch(e) { this.logger.logError(`photolibrary authorization error ${e.message}`) }
  }

  async getFlashAvailable():Promise<boolean> {
    if (this.platform.is('cordova')) {
      try {
        const result: Array<any> = await this.cameraPreview.getSupportedFlashModes();
        return (result.length > 1);
      }
      catch(e) { return false }
    }
  }
}
