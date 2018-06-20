/********************ANGULAR REQUIREMENTS********************/
import { Component,
         ViewChild }      from '@angular/core';

/*****************IONIC-ANGULAR REQUIREMENTS*****************/
import { AlertController,
         LoadingController,
         Nav,
         Platform }       from 'ionic-angular';

/*************************APP IMPORTS************************/
import { LoggerService }  from '../services/logger.service';
import { StorageService } from '../services/storage.service';

/************************IONIC NATIVE************************/
//import { BackgroundMode } from '@ionic-native/background-mode';
import { HeaderColor }    from '@ionic-native/header-color';
import { StatusBar }      from '@ionic-native/status-bar';
import { SplashScreen }   from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav)
  public nav: Nav;

  public rootPage: string = null;
  public showSplash: boolean = true;

  constructor(private alertCtrl: AlertController,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              //private backgroundMode: BackgroundMode,
              private headerColor: HeaderColor,
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              private logger: LoggerService,
              private storage: StorageService) {

    
    this.initApp();
  }

  private async initApp() {
    try {
      await this.platform.ready();

      if (this.isNative) this.headerColor.tint('#0066ff');
      //else this.logger.logError('headercolor plugin not available');

      if (this.isNative) this.statusBar.backgroundColorByHexString('#0066ff');
      //else this.logger.logError('statusbar not available');

      //if (this.isNative) this.splashScreen.hide();
      if (this.isNative) setTimeout(() => this.splashScreen.hide(), 500);
      //else this.logger.logError('splashscreen not available');

      //if (this.isNative) this.backgroundMode.enable();
      //else this.logger.logError('backgroundMode not available');

      const id: string = await this.storage.fetchFromStorage('userId');
      if (id) {
        const loader = this.loadingCtrl.create({ content: 'loading profiles...' });
        loader.present();
        setTimeout(() => {
          this.rootPage = 'TabsPage';
          loader.dismiss();
        }, 750);
      }
      else this.rootPage = 'LoginPage';

      setTimeout(() => this.showSplash = false, 500);

      //TODO -- SET BACK BUTTON ACTION
      //const activeNav = this.nav.getActive();
      
      /*this.platform.registerBackButtonAction(() => {
        //setTimeout(() => {
          if (this.rootPage === 'TabsPage') {
            if (activeNav.isOverlay) this.viewCtrl.dismiss();
            else return;
          }
          else this.exitAlert();
        //}, 1);
      });*/
    }
    catch(e) { this.logger.logError(`InitAppError ${e.message}`) }

    
  }

  ionViewDidLoad() {
    
  }

  exitAlert() {
    this.alertCtrl.create({
      title: 'Exit App',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('dont quit')
        }, {
          text: 'Quit',
          handler: () => this.platform.exitApp()
        }
      ]
    }).present();
  }

  get isNative(): boolean {
    return (this.platform.is('cordova') ||
            this.platform.is('android') ||
            this.platform.is('ios'));
  }
}
