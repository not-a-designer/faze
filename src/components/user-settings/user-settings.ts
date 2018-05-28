/*******************ANGULAR REQUIREMENTS********************/
import { Component,
         ViewChild }   from '@angular/core';

/****************IONIC-ANGULAR REQUIREMENTS*****************/
import { //IonicPage,
         NavParams,
         Platform  }   from 'ionic-angular';

/************************APP IMPORTS************************/
import { UserService } from '../../services/user.service';
import { User }        from '../../models/classes/user';

/*******************3RD PARTY IMPORTS***********************/
import moment          from 'moment';


//@IonicPage()
@Component({
  selector: 'user-settings',
  templateUrl: 'user-settings.html',
})
export class UserSettingsComponent {

  @ViewChild(HTMLInputElement)
  emailInput: HTMLInputElement;

  @ViewChild(HTMLInputElement)
  firstNameInput: HTMLInputElement;

  @ViewChild(HTMLInputElement)
  lastNameInput: HTMLInputElement;

  @ViewChild(HTMLInputElement)
  displayNameInput: HTMLInputElement;

  @ViewChild(HTMLInputElement)
  dob: HTMLInputElement;

  public currentUser: User;

  googleConnected: boolean;
  facebookConnected: boolean;
  instagramConnected: boolean;
  twitterConnected: boolean;

  constructor(private navParams: NavParams,
              private platform: Platform,
              private userService: UserService) {
  }
  
  ionViewDidEnter() {
    this.currentUser = this.navParams.data.currentUser;
    console.log('currentUser')
    if (this.currentUser.linkedAccounts.length > 0) {
      for (let link of this.currentUser.linkedAccounts) {
        if (link === 'google.com') this.googleConnected = true;
        if (link === 'facebook.com') this.facebookConnected = true;
        if (link === 'twitter.com') this.twitterConnected = true;
      }
    }
    console.log('ionViewDidEnter SettingsPage');
    for (let key in this.currentUser) {
      console.log(`${key} -> ${this.currentUser[key]}`);
    }
    
  }
  ionViewDidLeave() { this.userService.updatedUser = this.currentUser }

  get isMd() { return this.platform.is('android') }

  get maxDate(): string { return moment().subtract(13, 'years').format() }
}
