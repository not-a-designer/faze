/*****************ANGULAR REQUIREMENTS*****************/
import { Component,
         EventEmitter,
         Output }              from '@angular/core';

/*********************APP IMPORTS**********************/
//import { ADMOB_CONFIG }        from '../../app/app.configs';
import { ProfileService }      from '../../services/profile.service';
import { LoggerService }       from '../../services/logger.service';
import { Profile }             from '../../models/classes/profile';

/*********************IONIC-NATIVE*********************/
//import { AdMobFree }         from '@ionic-native/admob-free';
//import { PhotoLibrary }      from '@ionic-native/photo-library';
// /import { LocalNotifications } from '@ionic-native/local-notifications';

/*******************ANIMATIONS IMPORT******************/
import { fade }                from '../../app/app.animations';

/******************3RD PARTY IMPORTS*******************/
import { Observable }          from 'rxjs/Observable';


@Component({
  selector: 'profiles-list',
  templateUrl: 'profiles-list.html',
  animations: [ fade ]
})
export class ProfilesListComponent {

  @Output('action') 
  action: EventEmitter<string> = new EventEmitter<string>();

  profiles: Profile[] = [];
  profiles$: Observable<Profile[]>;
  selectedId: string = null;
  selectedProfile: Profile;
  isLoading: boolean = true;
  uid: string;

  skeletons: Array<number> = new Array(4);

  thumbnailArray: string[] = [];

  constructor(private profileService: ProfileService,
              private logger: LoggerService
              //private library: PhotoLibrary
              //private adMob: AdMobFree
  ) {
    console.log('Hello ProfilesComponent Component');     
  }

  public async loadProfiles() {
    try {
      this.profiles$ = await this.profileService.fetchProfiles();
      this.profiles$.take(1)
        .map(async (prfLst: Profile[]) => {
          for (let p of prfLst) { 
            if (!p['images']) p['images'] = [];
          }
          return prfLst;
        });
      this.selectedId = null;
    }
    catch(e) { this.logger.logError(`error loading profiles ${e.message}`) }
  }

  public isActive(id: string): boolean { return (this.selectedId === id) }

  public delete(id: string) { this.action.emit('deleteProfile') }

  public toggle(p: Profile) { 
    this.selectedId = this.isActive(p.id) ? null : p.id;
    this.selectedProfile = this.isActive(p.id) ? p : null;
    console.log(`selectedId: ${this.selectedId}`);
    this.action.emit('toggle');
    //this.selectProfile.emit( (this.selectedId ? p : null) );
  }
  
  

  
}
