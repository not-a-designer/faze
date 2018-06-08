/*************ANGULAR REQUIREMENTS*************/
import { Component }       from '@angular/core';

/**********IONIC-ANGULAR REQUIREMENTS**********/
import { IonicPage,
         AlertController,
         Loading,
         LoadingController,
         NavController, 
         NavParams,
         Platform }        from 'ionic-angular';

/*****************APP IMPORTS*****************/
import { AuthService }     from '../../services/auth.service';
import { LoggerService }   from '../../services/logger.service';
import { StorageService }  from '../../services/storage.service';
import { UserService }     from '../../services/user.service';

/*************ANIMATIONS IMPORT***************/
import { fadeIn, fadeOut } from '../../app/app.animations';

/*************3RD PARTY IMPORTS***************/
import { User }            from '../../models/classes/user';
import firebase            from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [ fadeIn, fadeOut ]
})
export class LoginPage {

  authMethod: string = 'login';
  activeUser: User;
  loading: Loading;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private platform: Platform,
              private authService: AuthService,
              private logger: LoggerService,
              private storage: StorageService,
              private userService: UserService) {

    this.authService.user$.subscribe((user: User) => this.activeUser = user);

    this.loading = this.loadingCtrl.create({
      content: 'loading profiles...'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  toggleAuthMethod() {
    this.authMethod = (this.authMethod === 'login') ? 'register' : 'login';
  }

  async fbLogin() {
    try {
      const userCredential: firebase.auth.UserCredential = await this.authService.fbLogin();
      
      if (userCredential.user) {
        const uid: string = userCredential.user.uid;
        await this.storage.saveToStorage('userId', uid);
        //this.storage.setStorage('userId', uid);
        this.userService.updateUser(userCredential.user);

        this.loading.present();
        setTimeout(() => {
          this.navCtrl.setRoot('TabsPage', { userId: uid });
          this.loading.dismiss();
        }, 1250);
        
      }
      else this.logger.logError('There was a problem logging in')
    }
    catch(e) { this.logger.logError(`facebook login error, ${e.message}`) }
  }

  async googleLogin() {
    try {
      const userCredential: firebase.auth.UserCredential = await this.authService.googleLogin();
      //userCredential = (this.platform.is('cordova')) ? (await this.authService.googleNativeLogin()) : (await this.authService.googleWebLogin());
      
      if (userCredential.user) {
        const uid: string = userCredential.user.uid;
        await this.storage.saveToStorage('userId', uid);
        //this.storage.setStorage('userId', uid);
        this.userService.updateUser(userCredential.user);
        
        this.loading.present();
        setTimeout(() => {
          this.navCtrl.setRoot('TabsPage', { userId: uid });
          this.loading.dismiss();
        }, 750);
      }
      else this.logger.logError('There was a problem logging in');
    }
    catch(e) { this.logger.logError(`google login error, ${e.message}`) }
  }

  async twitterLogin() {
    try {
      const userCredential: firebase.auth.UserCredential = await this.authService.twitterLogin();

      if (userCredential.user) {
        const uid: string = userCredential.user.uid;
        await this.storage.saveToStorage('userId', uid);
        //this.storage.setStorage('userId', uid);
        this.userService.updateUser(userCredential.user);
        
        this.loading.present();
        setTimeout(() => {
          this.navCtrl.setRoot('TabsPage', { userId: uid });
          this.loading.dismiss();
        }, 750);
      }
      else this.logger.logError('There was a problem logging in');
    }
    catch(e) { this.logger.logError(`twitter login error, ${e.message}`) }
    
  }

  async igLogin() {
    try {
      const result = await this.authService.instagramLogin();
      this.logger.logCompleted(`instagram login result: ${result}`);
      //const userCredential: firebase.auth.UserCredential = await this.authService.instagramLogin();
    }
    catch(e) { console.log(e) }
  }

  featureNotImplemented() {
    this.alertCtrl.create({
      subTitle: 'Sorry!',
      message: 'This feature is coming soon!',
      buttons: ['OK']
    }).present();
  }

  async login(event: string[]) {
    try { 
      let userCredential: firebase.auth.UserCredential;
      userCredential = await this.authService.emailLogin(event[0], event[1]);
      if (userCredential.user) {
        const uid: string = userCredential.user.uid;
        await this.storage.saveToStorage('userId', uid);
        //this.storage.setStorage('userId', uid);
        this.userService.updateUser(userCredential.user);

        this.loading.present();
        setTimeout(() => {
          this.navCtrl.setRoot('TabsPage', { userId: uid });
          this.loading.dismiss();
        }, 750);
      }
      else this.logger.logError('There was a problem logging in');
    }
    catch(e) { this.logger.logError(`email login error, ${e.message}`) }
  }

  async register(event) {
    try {
      let userCredential: firebase.auth.UserCredential;
      userCredential =  await this.authService.register(event[0], event[1]);
      if (userCredential.user) {
        const uid: string = userCredential.user.uid;
        await this.storage.saveToStorage('userId', uid);
        //this.storage.setStorage('userId', uid);
        this.userService.updateUser(userCredential.user);

        this.loading.present();
        setTimeout(() => {
          this.navCtrl.setRoot('TabsPage', { userId: uid });
          this.loading.dismiss();
        }, 750);
      }
      else this.logger.logError('There was a problem at registration');
    }
    catch(e) { this.logger.logError(`registration error, ${e.message}`) }
  }

  async ionViewCanLeave(): Promise<boolean> {
    try {
      console.log('checking for saved user...');
      const id = await this.storage.fetchFromStorage('userId');
      if (id) {
        console.log('user found, loading tabs page...');
        return true;
      }
        else return false;
    }
    catch(e) { console.log('not logged in') }
  }
}
