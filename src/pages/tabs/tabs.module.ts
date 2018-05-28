/*************ANGULAR REQUIREMENTS*************/
import { CUSTOM_ELEMENTS_SCHEMA,
         NgModule }         from '@angular/core';

/**********IONIC-ANGULAR REQUIREMENTS**********/
import { IonicPageModule }  from 'ionic-angular';

/*****************APP IMPORTS******************/
import { ComponentsModule } from '../../components/components.module';
import { TabsPage }         from './tabs';


@NgModule({
  declarations: [ TabsPage ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TabsPage)
  ],
  exports: [ TabsPage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TabsPageModule {}
