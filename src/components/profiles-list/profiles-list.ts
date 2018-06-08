/*****************ANGULAR REQUIREMENTS*****************/
import { Component,
         EventEmitter,
         Output }         from '@angular/core';

import { Platform }       from 'ionic-angular';

/*********************APP IMPORTS**********************/
import { ADMOB_CONFIG }   from '../../app/app.configs';
import { ProfileService } from '../../services/profile.service';
import { LoggerService }  from '../../services/logger.service';
import { Profile }        from '../../models/classes/profile';

/*********************IONIC-NATIVE*********************/
//import { AdMobFree } from '@ionic-native/admob-free';

/*******************ANIMATIONS IMPORT******************/
import { fade }           from '../../app/app.animations';

/******************3RD PARTY IMPORTS*******************/
import { Observable }     from 'rxjs/Observable';


@Component({
  selector: 'profiles-list',
  templateUrl: 'profiles-list.html',
  animations: [ fade ]
})
export class ProfilesListComponent {

  @Output('action') 
  action: EventEmitter<string> = new EventEmitter<string>();

  //emits profile id string
  @Output() 
  selectProfile: EventEmitter<Profile> = new EventEmitter<Profile>();
  @Output() 
  deleteProfile: EventEmitter<string> = new EventEmitter<string>();

  profiles: Profile[] = [];
  profiles$: Observable<Profile[]>;
  selectedId: string = null;
  isLoading: boolean = true;
  uid: string;

  skeletons: Array<number> = new Array(4);

  constructor(private platform: Platform,
              private profileService: ProfileService,
              private logger: LoggerService
              //private storage: StorageService,
              //private adMob: AdMobFree
  ) {

    console.log('Hello ProfilesComponent Component'); 
    
    /*if (this.platform.is('cordova')) {
      this.adMob.banner.config(ADMOB_CONFIG);
      this.adMob.banner.prepare().then(() =>{
        console.log('ad banner ready');
      });
    }*/
  }

  //ngAfterViewInit() { this.profiles.forEach(p => console.log(`ProfileId: ${p.id}`)) }

  public async loadProfiles() {
    try {
      this.profiles$ = await this.profileService.fetchProfiles();
      this.profiles$.take(1)
        .map((prfLst: Profile[]) => {
          for (let p of prfLst) { 
            if (!p['images']) p['images'] = [];
          }
          return prfLst;
        });
      this.selectedId = null;
      this.profileService.setLocalNotifications();
    }
    catch(e) { this.logger.logError(`error loading profiles ${e.message}`) }
  }

  public isActive(id: string): boolean { return (this.selectedId === id) }

  public delete(id: string) { this.deleteProfile.emit(id) }

  public toggle(p: Profile) { 
    this.selectedId = this.isActive(p.id) ? null : p.id;
    console.log(`selectedId: ${this.selectedId}`);
    this.selectProfile.emit( (this.selectedId ? p : null) );
  }
  
  

  
}
