/**********ANGULAR REQUIREMENTS**********/
import { CUSTOM_ELEMENTS_SCHEMA,
         NgModule }         from '@angular/core';

/*******IONIC-ANGULAR REQUIREMENTS*******/
import { IonicPageModule }  from 'ionic-angular';

/**************APP IMPORTS***************/
import { ComponentsModule } from '../../components/components.module';
import { LoginPage }        from './login';


@NgModule({
  declarations: [ LoginPage ],

  imports: [
    ComponentsModule,
    IonicPageModule.forChild(LoginPage),
  ],

  exports: [ LoginPage ],
  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LoginPageModule {}
