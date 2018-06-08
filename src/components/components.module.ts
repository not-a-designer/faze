/*****************ANGULAR REQUIREMENTS*****************/
import { NgModule,
         CUSTOM_ELEMENTS_SCHEMA }  from '@angular/core';
import { CommonModule }            from '@angular/common';

/**************IONIC-ANGULAR REQUIREMENTS**************/
import { IonicModule }             from 'ionic-angular';

/**********************APP IMPORTS*********************/
import { ProfilesListComponent }   from './profiles-list/profiles-list';
import { ProfileDetailsComponent } from './profile-details/profile-details';
import { TabsNavbarComponent }     from './tabs-navbar/tabs-navbar';
import { SignInComponent }         from './sign-in/sign-in';
import { SignUpComponent }         from './sign-up/sign-up';
import { UserSettingsComponent }   from './user-settings/user-settings';
import { CameraPreviewComponent } from './camera-preview/camera-preview'; 


@NgModule({
	declarations: [
		ProfilesListComponent,
	    ProfileDetailsComponent,
	    TabsNavbarComponent,
        SignInComponent,
		SignUpComponent,
		UserSettingsComponent,
        CameraPreviewComponent
	],

	imports: [
		CommonModule,
		IonicModule
	],

	exports: [
		CommonModule,
		ProfilesListComponent,
	    ProfileDetailsComponent,
		TabsNavbarComponent,
        SignInComponent,
		SignUpComponent,
		UserSettingsComponent,
        CameraPreviewComponent
	],

	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	
	//If project contains nested components, add here
	entryComponents: [ UserSettingsComponent, CameraPreviewComponent ]
})
export class ComponentsModule {}
