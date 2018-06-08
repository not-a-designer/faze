/********************ANGULAR REQUIREMENTS********************/
import { Component,
         ViewChild }      from '@angular/core';

/*****************IONIC-ANGULAR REQUIREMENTS*****************/
import { LoadingController,
         Nav, 
         Platform }              from 'ionic-angular';

/*************************APP IMPORTS************************/
import { LoggerService }         from '../services/logger.service';
import { StorageService }        from '../services/storage.service';

/************************IONIC NATIVE************************/
/*import { CameraPreview,
         CameraPreviewDimensions,
         CameraPreviewOptions }  from '@ionic-native/camera-preview';
import { Diagnostic }            from '@ionic-native/diagnostic';*/
import { HeaderColor }           from '@ionic-native/header-color';
import { StatusBar }             from '@ionic-native/status-bar';
import { SplashScreen }          from '@ionic-native/splash-screen';
import { ProfilesListComponent } from '../components/profiles-list/profiles-list';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav)
  public nav: Nav;

  public rootPage: string = null;
  public showSplash: boolean = true;

  constructor(private platform: Platform,
              private loadingCtrl: LoadingController,
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
      if (this.platform.is('cordova')) this.headerColor.tint('#0066ff');
      else this.logger.logError('headercolor plugin not available');

      if (this.platform.is('cordova')) this.statusBar.backgroundColorByHexString('#0066ff');
      else this.logger.logError('statusbar not available');

      //if (this.platform.is('cordova')) this.splashScreen.hide();
      if (this.platform.is('cordova')) setTimeout(() => this.splashScreen.hide(), 500);
      else this.logger.logError('splashscreen not available');

      const id: string = await this.storage.fetchFromStorage('userId');
      if (id) {
        const loader = this.loadingCtrl.create({
          content: 'loading profiles...'
        });
        loader.present();

        setTimeout(() => {
          this.rootPage = 'TabsPage';
          loader.dismiss();
        }, 1250);
      }
      else this.rootPage = 'LoginPage';

      setTimeout(() => this.showSplash = false, 500);
    }
    catch(e) { this.logger.logError(`InitAppError ${e.message}`) }
  }
}
