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
import { LocalNotifications }          from '@ionic-native/local-notifications';
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
import { CameraPreviewComponent }      from '../../components/camera-preview/camera-preview';
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

  nextAlarmId: number;

  settingsModal: Modal;
  cameraBackground: string = `linear-gradient(to bottom, transparent, transparent ${this.platform.width()}px, #fff ${this.platform.width()}px, #fff)`;
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
              private notifications: LocalNotifications,
              private photoLibrary: PhotoLibrary,
              private statusBar: StatusBar) {}

  /********LIFECYCLE HOOK FUNCTIONS********/
  async ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');

    this.platform.registerBackButtonAction(() => {
      let activeNav = this.navCtrl.getActive();
      //if alert or modal or toast
      if (activeNav.isOverlay) activeNav.dismiss();
      else {
        //if main profiles page
        if (this.getCurrentTab() === 1) this.logout();

        else {
          if (this.camPrevCmp.isPicTaken) this.camPrevCmp.deletePreview();
          else this.slideToProfiles();
        }
      }
    });

    try {
      this.userId = (this.navParams.data.userId) ? 
        this.navParams.data.userId : 
        (await this.storage.fetchFromStorage('userId'));

      if (this.userId != null) {
        console.log('tabspage user id found in storage', this.userId);
        this.userService.getUser(this.userId)
        .valueChanges()
        .take(1)
        .subscribe((u: User) => this.activeUser = u);
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
      
      this.checkPermissions();
      const scheduled = await this.notifications.getAllScheduled();
      let totalAlarms: number = scheduled.length > 0 ? scheduled.length : 0;
      this.nextAlarmId = totalAlarms + 1;
      this.logger.logCompleted(`${totalAlarms} alarm(s) scheduled`);
      
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
    //profile list
    else if (event === 'toggle') this.toggleProfile()
    //dual purpose
    else if (event === 'deleteProfile') this.deleteProfile(this.selectedProfile.id);
    else if (event === 'back') this.slideToProfiles();
    else console.log('action error');
  }

  public getCurrentTab() { return this.tabs.getActiveIndex() }

  toggleProfile() {
    if (this.profilesListCmp.selectedId == null) {
      this.selectedId = null;
      this.selectedProfile = null;
      this.tabsNavbarCmp.changeTitle('Profiles');
      this.tabsNavbarCmp.profileOptions = false;
      this.tabsNavbarCmp.shareEnabled = false;
    }
    else {
      this.selectedId = this.profilesListCmp.selectedId;
      this.selectedProfile = this.profilesListCmp.selectedProfile;
      if (!this.selectedProfile['images']) this.selectedProfile.images = [];
      this.tabsNavbarCmp.changeTitle(this.selectedProfile.name);
      this.tabsNavbarCmp.profileOptions = true;
      this.tabsNavbarCmp.shareEnabled = (this.selectedProfile.images.length > 10);
    }
  }

  public slideToCamera() {
    this.showCamera();
    this.unlockTabs();
    this.camPrevCmp.isOpacityOpen = false;
    if (this.selectedProfile.images && this.selectedProfile.images.length > 1) {
      const len: number = this.selectedProfile.images.length - 1;
      this.previousImage = this.selectedProfile.images[len];
    }
    this.tabs.slideTo(2);
    this.resizeTabs();
    this.tabsNavbarCmp.activeTab = 2;
    this.statusBar.hide();
  }

  public slideToDetails() {
    this.statusBar.show();
    //if (this.getCurrentTab() === 0) this.profileService.updateProfile(this.profileDetailsCmp.profile);

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
      this.selectedProfile = null;
      this.selectedId = null;
      //this.toggleProfile();
    }, 750);
  }

  private async checkPermissions() {
    this.checkCameraPermissions();
    this.checkPhotoLibraryPermissions();
    this.checkNotificationPermissions();
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
      this.tabsNavbarCmp.changeTitle('Profiles');
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
              alarmAt: new Date(data.alarm), 
              alarmId: this.nextAlarmId,
              alarmText: `Time to snap a picture for your ${data.name} Faze lapse!`,
              name: data.name, 
              desc: data.desc
            });
            loader.dismiss();

          }
        }
      ]
    }).present();
  }

  /** CAMERA FUNCTIONS */
  

  /** CAPTURE CAMERA-PREVIEW IMAGE */
  //toggle opacity fab to hidden
  //clear preview image data
  //show loading spinner while image from camera preview is capture
  public async capturePreview() {

    const CAPTURE_OPTIONS: CameraPreviewPictureOptions = {
      width: this.platform.width(),
      height: this.platform.width(),
      quality: 85
    };

    const loader = this.loadingCtrl.create({ content: 'steady....' });
    loader.present();

    setTimeout(async () => {
      try {
        const result: string = await this.cameraPreview.takePicture(CAPTURE_OPTIONS);
        const imageData: string = `data:image/jpeg;base64,${result}`;
        this.cropPreview(imageData, (croppedImg: string) => {
          this.previewImage = croppedImg;
        });
        this.camPrevCmp.isPicTaken = true;
        this.hideCamera();
        loader.dismiss();
      }
      catch(e) { 
        this.logger.logError(`picture capture error ${e.message}`)
        loader.dismiss();
      }
    }, 750);
  }

  public deletePreview() {
    this.previewImage = null;
    this.camPrevCmp.isPicTaken = false;
    this.showCamera();
    this.statusBar.hide();
    
  }
  
  public async savePreview(imgUrl: string) {
    const loader = this.loadingCtrl.create({ content: 'saving...' });
    loader.onDidDismiss(() => {
      this.previewImage = null;
      this.camPrevCmp.isPicTaken = false;
      this.slideToDetails();
      this.tabsNavbarCmp.activeTab = 0;
    });
    loader.present();
    setTimeout(async () => {
      try {
        const savedPreview: LibraryItem = await this.photoLibrary.saveImage(imgUrl, this.selectedProfile.name);
        if (this.selectedProfile.images.length == 0) this.selectedProfile.images = [];
        this.selectedProfile.images.push(imgUrl);
        this.profileService.updateProfile(this.selectedProfile);
        loader.dismiss();
      }
      catch(e) { 
        this.logger.logError(`error saving to photo library ${e.message}`);
        loader.dismiss();
      }
    }, 750);
    
  }

  startCamera() { 

    const PREVIEW_DIMENSIONS: CameraPreviewDimensions = {
      height: this.platform.width(),
      width: this.platform.width()
    };

    const PREVIEW_OPTIONS: CameraPreviewOptions = {
      x: 0,
      y: 0,
      height: PREVIEW_DIMENSIONS.height,
      width: PREVIEW_DIMENSIONS.width,
      tapPhoto:false,
      tapToFocus: true,
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
      this.content.resize();
      this.tabs.resize();
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
      await this.getFlashAvailable();
    }
    catch(e) { this.logger.logError(`diagnostics error ${e}`) }
  }

  private async checkPhotoLibraryPermissions() {
    try { 
      await this.photoLibrary.requestAuthorization({ read: true, write: true });
      this.logger.logCompleted(`library access granted`);
      /*this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach((libraryItem) => {
            for (let prop in libraryItem) this.logger.logCompleted(`${prop}: ${libraryItem['prop']}`);
          });
        },
        error: err => { this.logger.logError('could not get photos') },
        complete: () => { this.logger.logCompleted('photo library done') }
      });*/
    }
    catch(e) { this.logger.logError(`photolibrary authorization error ${e.message}`) }
  }

  async checkNotificationPermissions() {
    try {
      const permission: boolean = await this.notifications.hasPermission();
      if (permission) {
        this.logger.logCompleted('Notification permission');
        const scheduledList = await this.notifications.getAllScheduled();
        scheduledList.forEach(notification => console.log(notification));
      }
      else {
        const request: boolean = await this.notifications.requestPermission();
        if (request) {
          this.logger.logCompleted('Notification permission');
          //const scheduledList = await this.notifications.getAllScheduled();
          //scheduledList.forEach(notification => console.log(notification));
        }
        else this.logger.logError('No notification permission');
      }
    }
    catch(e) { this.logger.logError(`notification permission error ${e}`) }
  }

  async getFlashAvailable() {
    try {
      const flashModes = await this.cameraPreview.getSupportedFlashModes();
      this.logger.logCompleted(`flash available: ${flashModes.length > 0}`);
      if (flashModes.length > 0) {
        let flashMode: string = this.camPrevCmp.isFlashOn ? 'on' : 'off';
        this.cameraPreview.setFlashMode(flashMode);
        this.isFlashAvailable = true;
      }
    }
    catch(e) { 
      this.logger.logError(`flash error ${e}`);
      this.isFlashAvailable = false;
    }
  }

  get isNative(): boolean { return (this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios')) }

  private cropPreview(imgPath: string, callback) {
    
    let canvas: HTMLCanvasElement = document.createElement('canvas');
    let image = new Image();
    
    image.onload = () => {
      const width: number = image.width;
      const height: number = image.height;
      canvas.width = width;
      canvas.height = width;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image,            //source img
                    0,                //source x coords
                    (height - width) / 2,       //source y coords
                    width,            //source width 
                    width,            //sourceHeight
                    0,                //cropped x coords
                    0,                //cropped y coords
                    width,            //cropped width 
                    width);           //cropped height
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      callback(dataUrl);
    }
    //this line will call the previous function
    image.src = imgPath;
  }
}
