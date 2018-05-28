/****************ANGULAR REQUIREMENTS****************/
import { Injectable }             from '@angular/core';

/*****************ANGULARFIRE2 AUTH******************/
import { AngularFireAuth }        from 'angularfire2/auth';
import { Instagram }              from 'ng2-cordova-oauth/core';
import { OauthCordova }           from 'ng2-cordova-oauth/platform/cordova';

/************IONIC-ANGULAR REQUIREMENTS**************/
import { Platform }               from 'ionic-angular';

/********************APP IMPORTS*********************/
import { GOOGLE_PLUS_CONFIG,
         INSTAGRAM_CONFIG }       from '../app/app.configs';
import { User }                   from '../models/classes/user';
import { LoggerService }          from '../services/logger.service';
import { StorageService }         from './storage.service';
import { UserService }            from './user.service';

/*******************IONIC-NATIVE********************/
import { Facebook }               from '@ionic-native/facebook';
import { GooglePlus }             from '@ionic-native/google-plus';
import { TwitterConnect,
         TwitterConnectResponse } from '@ionic-native/twitter-connect'; 

/*****************3RD PART IMPORTS******************/
import { Observable }             from 'rxjs/Observable';
import firebase                   from 'firebase';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


@Injectable()
export class AuthService {

    currentUser$: Observable<firebase.User>;
    private oAuth: OauthCordova = new OauthCordova();
    private igProvider: Instagram = new Instagram(INSTAGRAM_CONFIG);

    constructor(private platform: Platform,
                private afAuth: AngularFireAuth,
                private logger: LoggerService,
                private storage: StorageService,
                private userService: UserService,
                private fb: Facebook,
                private gPlus: GooglePlus,
                private twitter: TwitterConnect
    ) {

        this.checkAuthState();
    }

    

  /**********************************************************************************/
 /***************************LOGIN/REGISTER METHODS*********************************/
/**********************************************************************************/
    async emailLogin(email: string, password: string): Promise<firebase.auth.UserCredential> {
        try { return (await this.afAuth.auth.signInWithEmailAndPassword(email, password)) }
        catch(e)  { console.log(e)}
    }

    async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
        try { return await this.afAuth.auth.createUserWithEmailAndPassword(email, password) }
        catch(e) { console.log(e) }
    }

    public signOut() {
        this.afAuth.auth.signOut();
        this.storage.clearStorage()
            .then(() => this.logger.logCompleted('See you later!'))
            .catch((error) => console.log(error.message));;
    }

    public async unlink(providerId: string) {
        try { await this.afAuth.auth.currentUser.unlink(providerId) }
        catch(e) { console.log(e) }
    }


  /**********************************************************************************/
 /********************************GOOGLE METHODS************************************/
/**********************************************************************************/
    async googleLogin(): Promise<firebase.auth.UserCredential> {
        if (this.platform.is('cordova')) {
            try {
                const gPlusUser = await this.gPlus.login(GOOGLE_PLUS_CONFIG);
                return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
                    firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken));
            }
            catch(e) { console.log(e) }
        }
        else {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                return await this.oAuthLogin(provider);
            }
            catch(e) { console.log(e) }
        }
    }

    /*async googleNativeLogin(): Promise<firebase.auth.UserCredential> {
        try {
            const gPlusUser = await this.gPlus.login(GOOGLE_PLUS_CONFIG);
            return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
                    firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken));
        }
        catch(e)  { console.log(e)}
    }

    async googleWebLogin(): Promise<firebase.auth.UserCredential> {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            return await this.oAuthLogin(provider);
        }
        catch(e) { console.log(e) }
    }*/

    /*async linkGoogleNative() {
        try {
            const gPlusUser = await this.gPlus.login(GOOGLE_PLUS_CONFIG);
            return await this.afAuth.auth.currentUser.linkWithCredential(
                firebase.auth.GoogleAuthProvider.credential(gPlusUser.token));
        }
        catch(e) { console.log(e) }
    }

    async linkGoogleWeb() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            return await this.oAuthLink(provider);
        }
        catch(e) { console.log(e) }
    }


  /********************************************************************************/
 /*****************************FACEBOOK METHODS***********************************/
/********************************************************************************/
    async fbLogin(): Promise<firebase.auth.UserCredential> {
        if (this.platform.is('cordova')) {
            try {
                const fbLoggedIn = await this.fb.getLoginStatus();
                if (fbLoggedIn.status !== 'connected') {
                    const response = await this.fb.login(['public_profile', 'email']);
                    if (response.status === 'connected') {
                        return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
                        firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken));
                    }
                }
            }
            catch(e) { console.log(e) }
        }
        else {
            try {
                const provider = new firebase.auth.FacebookAuthProvider();
                return await this.oAuthLogin(provider);
            }
            catch(e) { console.log(e) }
        }
    }
        /*try {
            const fbLoggedIn = await this.fb.getLoginStatus();
            if (fbLoggedIn.status !== 'connected') {
                const response = await this.fb.login(['public_profile', 'email']);
                if (response.status === 'connected') {
                    return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
                    firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken));
                }
            }
        }
        catch(e) { console.log(e) }
    }

    async fbWebLogin(): Promise<firebase.auth.UserCredential> {
        try {
            const provider = new firebase.auth.FacebookAuthProvider();
            return await this.oAuthLogin(provider);
        }
        catch(e) {console.log(e) }
    }*/

    async linkFacebookNative() {
        /*try {
            const response = await this.fb.getLoginStatus();
            if (response.status !== 'connected') {
                const resp = await this.fb.login(['public_profile', 'email']);
                if (resp.status === 'connected') {
                    return await this.afAuth.auth.currentUser.linkWithCredential(
                    firebase.auth.FacebookAuthProvider.credential(resp.authResponse.accessToken));
                }
            }
        }
        catch(fbNativeErr) { console.log(fbNativeErr) }*/
    }

    async linkFacebookWeb() {
        /*try {
            const provider = new firebase.auth.FacebookAuthProvider();
            return await this.oAuthLink(provider);
        }
        catch(e) {console.log(e) }*/
    }


  /*********************************************************************************/
 /******************************TWITTER METHODS************************************/
/*********************************************************************************/
    async twitterLogin() {
        if (this.platform.is('cordova')) {
            try {
                const twitterResponse: TwitterConnectResponse = await this.twitter.login();
                this.logger.logCompleted(`Twitter login ${twitterResponse.token}`);
                return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
                        firebase.auth.TwitterAuthProvider.credential(twitterResponse.token, twitterResponse.secret));
            }
            catch(e) { console.log(e) }
        }
        else {
            try {
                const provider = new firebase.auth.TwitterAuthProvider();
                return await this.oAuthLogin(provider);
            }
            catch(e) { console.log(e) }
        }
    }
       /* try {
            const twitterResponse: TwitterConnectResponse = await this.twitter.login();
            this.logger.logCompleted(`Twitter login ${twitterResponse.token}`);
            return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
                    firebase.auth.TwitterAuthProvider.credential(twitterResponse.token, twitterResponse.secret));
        }
        catch(e) { console.log(e) }
        //catch(e) { this.twitterWebLogin() }
    }

    async twitterWebLogin(): Promise<firebase.auth.UserCredential> {
        try {
            const provider = new firebase.auth.TwitterAuthProvider();
            return await this.oAuthLogin(provider);
        }
        catch(e) { console.log(e) }
    }*/

    async linkTwitterNative() {
        /*try {
            //const tResponse = await this.twConnect.login();
            return await this.afAuth.auth.currentUser.linkWithCredential(
                firebase.auth.TwitterAuthProvider.credential(
                    this.twitter.access_token, 
                    this.twitter.access_token_secret
                ));
        }
        catch(e) { console.log(e) }*/
    }

    async linkTwitterWeb() {
        /*try {
            const provider = new firebase.auth.TwitterAuthProvider();
            return await this.oAuthLink(provider);
        }
        catch(e) { console.log(e) }*/
    }


  /*********************************************************************************/
 /*****************************INSTAGRAM METHODS***********************************/
/*********************************************************************************/    

    async instagramLogin(): Promise<string> {
        const success = await this.oAuth.logInVia(this.igProvider);
        return JSON.stringify(success);
    }

    async verifyEmail() {
        try { return await this.afAuth.auth.currentUser.sendEmailVerification() }
        catch(e) { console.log(e) }
    }


   /****************************************************************************/
  /**********************USER OBJECT FROM AUTH USER****************************/
 /****************************************************************************/
    public get user$(): Observable<User> {
        return this.currentUser$.switchMap((user: firebase.User) => {
            if (user) {
                this.storage.setStorage('userId', user.uid);
                return this.userService.getUser(user.uid)
                    .valueChanges();
            }
            else return Observable.of(null);
        });
    }
    

/**                                                                              */
/*******************************PRIVATE METHODS***********************************/
/**                                                                              */
    private checkAuthState() { this.currentUser$ = this.afAuth.authState }

    private async oAuthLogin(provider: firebase.auth.AuthProvider): Promise<firebase.auth.UserCredential> {
        try { return await this.afAuth.auth.signInWithPopup(provider) }
        catch(e) { console.log(e) }
    }
    
    private async oAuthLink(provider: firebase.auth.AuthProvider): Promise<any> {
        try { return await this.afAuth.auth.currentUser.linkWithPopup(provider) }
        catch(e) { console.log(e) }
    }
}