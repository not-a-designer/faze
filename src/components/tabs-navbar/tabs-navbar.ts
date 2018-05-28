/** ANGULAR REQUIREMENTS */
import { Component,
         EventEmitter,
         Output }          from '@angular/core';

/** IONIC-ANGULAR REQUIREMENTS */
import { AlertController } from 'ionic-angular';

/** APP IMPORTS */
import { User }            from '../../models/classes/user';

/** ANIMATIONS IMPORT */
import { fadeIn }          from '../../app/app.animations';

@Component({
  selector: 'tabs-navbar',
  templateUrl: 'tabs-navbar.html',
  animations: [ fadeIn ]
})
export class TabsNavbarComponent {

  /** DECORATED COMPONENT VARIABLES */
  @Output('action')
  action: EventEmitter<string> = new EventEmitter<string>();

  @Output('update')
  update: EventEmitter<User> = new EventEmitter<User>();

  public currentUser: User;
  public profileOptions: boolean = false;
  public activeTab: number;
  public title: string = "Profiles";
  public shareEnabled: boolean = false;
  public settingsEnabled: boolean = true;

  constructor(private alertCtrl: AlertController,) {
    console.log('Hello TabsNavbarComponent Component');
  }

  public newProfile() { this.action.emit('new') }

  public camera() { this.action.emit('camera') }

  public details() { this.action.emit('details') }

  public share() { this.action.emit('share') }

  public settings() { 
    this.action.emit('settings');
    this.settingsEnabled = false;
  }

  public hide() { 
    this.action.emit('hide');
    this.settingsEnabled = true;
  }

  public delete() { this.action.emit('delete') }

  public home() { this.action.emit('home') }

  public logout() { this.showLogoutAlert() }

  public changeTitle(newTitle: string) { this.title = newTitle }

  public toggleProfileOptions() { this.profileOptions = !this.profileOptions }

  public toggleSettingsEnabled() { this.settingsEnabled = !this.settingsEnabled }

  public enableShare() { this.shareEnabled = true }

  public disableShare() { this.shareEnabled = false }


  
  private showLogoutAlert() {
    this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('dont log out')
        }, {
          text: 'Logout',
          handler: () => this.action.emit('logout')
        }
      ]
    }).present();
  }
}
