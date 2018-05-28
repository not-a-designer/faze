/********************ANGULAR REQUIREMENTS********************/
import { Component,
         ViewChild }      from '@angular/core';

/*****************IONIC-ANGULAR REQUIREMENTS*****************/
import { LoadingController,
         Nav, 
         Platform }       from 'ionic-angular';

/*************************APP IMPORTS************************/
import { LoggerService }  from '../services/logger.service';
import { StorageService } from '../services/storage.service';

/************************IONIC NATIVE************************/
import { CameraPreview }  from '@ionic-native/camera-preview';
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

  constructor(private platform: Platform,
              private loadingCtrl: LoadingController,
              private cameraPreview: CameraPreview,
              private headerColor: HeaderColor,
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              private logger: LoggerService,
              private storage: StorageService) {
    //this.initializeApp();
    this.initApp();
  }

  private async initApp() {
    try {
      await this.platform.ready();
      this.headerColor.tint('#0066ff');
      this.statusBar.backgroundColorByHexString('#0066ff');
      this.splashScreen.hide();
      //setTimeout(() => this.splashScreen.hide(), 500);

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
      //this.logger.logCompleted((id) ? `userId found, ${id}` : `no user found`);
      //this.rootPage = (id) ? 'TabsPage' : 'LoginPage';
      //setTimeout(() => this.showSplash = false, 500);
    }
    catch(e) { this.logger.logError(`InitAppError ${e.message}`) }
  }
}
