/**********************ANGULAR REQUIREMENTS**********************/
import { BrowserModule }             from '@angular/platform-browser';
import { BrowserAnimationsModule }   from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA,
         ErrorHandler, 
         NgModule }                  from '@angular/core';
import { HttpModule }                from '@angular/http';

/*******************IONIC-ANGULAR REQUIREMENTS*******************/
import { IonicApp, 
         IonicErrorHandler, 
         IonicModule }               from 'ionic-angular';
import { IonicStorageModule }        from '@ionic/storage';

/****************ANGULARFIRE2 AUTH + DATABASE*******************/
import { AngularFireModule }         from 'angularfire2';
import { AngularFireAuthModule }     from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

/*************************APP IMPORTS**************************/  
import { MyApp }                     from './app.component'; 
import { FIREBASE_CONFIG }           from './app.configs'; 
import { ComponentsModule }          from '../components/components.module';
import { DirectiveModule }           from '../directives/directives.module';
import { PipesModule }               from '../pipes/pipes.module';
import { LoggerService }             from '../services/logger.service';
import { AuthService }               from '../services/auth.service';
import { StorageService }            from '../services/storage.service';
import { UserService }               from '../services/user.service';
import { ProfileService }            from '../services/profile.service';

/***********NATIVE PLUGINS, 3RD PARTY PACKAGE IMPORTS*********/
//import { AdMobFree }                 from '@ionic-native/admob-free';
import { CameraPreview }             from '@ionic-native/camera-preview'; 
import { Diagnostic }                from '@ionic-native/diagnostic';
import { Facebook }                  from '@ionic-native/facebook';
import { GooglePlus }                from '@ionic-native/google-plus';
import { HeaderColor }               from '@ionic-native/header-color';
import { InAppBrowser }              from '@ionic-native/in-app-browser';
import { PhotoLibrary }              from '@ionic-native/photo-library';
import { StatusBar }                 from '@ionic-native/status-bar';
import { SplashScreen }              from '@ionic-native/splash-screen';
import { TwitterConnect }            from '@ionic-native/twitter-connect';


@NgModule({
  /** DECLARES ALL NON LAZY-LOADED APP COMPONENTS, DIRECTIVES, PIPES */
  /** DECLARATIONS */
  declarations: [ MyApp ],

  /** IMPORTS EXTERNAL MODULES */
  /** IMPORTS */
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    ComponentsModule,
    HttpModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    PipesModule,
    IonicStorageModule.forRoot()
  ],

  /** BOOTSTRAPS THE ROOT 'IONIC-APP' COMPONENT */
  /** BOOTSTRAP */
  bootstrap: [ IonicApp ],

  /** DECLARES COMPONENTS NEEDED AT APP INIT */
  /** ENTRYCOMPONENTS */
  entryComponents: [ MyApp ],

  /** DECLARES APP SERVICES */
  /** PROVIDERS */
  providers: [
    //AdMobFree,
    AuthService,
    CameraPreview,
    Diagnostic,
    Facebook,
    GooglePlus,
    HeaderColor,
    InAppBrowser,
    LoggerService,
    PhotoLibrary,
    ProfileService,
    StatusBar,
    SplashScreen,
    StorageService,
    TwitterConnect,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],

  /** NEEDED FOR CUSTOM COMPONENTS */
  /** SCHEMAS */
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}