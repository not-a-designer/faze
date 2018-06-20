/** ANGULAR REQUIREMENTS */
import { Component,
         EventEmitter,
         Input,
         Output,
         ViewChild } from '@angular/core';

/** IONIC-ANGULAR REQUIREMENTS */
import { AlertController,
         Button,
         Platform }  from 'ionic-angular';

/** ANIMATIONS IMPORT */
import { fadeIn }    from '../../app/app.animations';

@Component({
  selector: 'tabs-navbar',
  templateUrl: 'tabs-navbar.html',
  animations: [ fadeIn ]
})
export class TabsNavbarComponent {

  /** DECORATED COMPONENT VARIABLES */
  //emits:
  //newProfile, camera, details, share, deleteProfile, home, showSettings, hideSettings, logout
  @Output('action')
  action: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('cameraButton')
  cameraButton: Button;

  @Input('activeTab')
  activeTab: number;
  //public currentUser: User;
  public profileOptions: boolean = false;
  
  public title: string = "Profiles";
  public shareEnabled: boolean = false;
  public settingsEnabled: boolean = true;

  constructor(private alertCtrl: AlertController,
              public platform: Platform) {
    console.log('Hello TabsNavbarComponent Component');
  }

  public newProfile() { this.action.emit('newProfile') }

  public camera() { this.action.emit('camera') }

  public details() { this.action.emit('details') }

  public share() { this.action.emit('share') }

  public delete() { this.action.emit('deleteProfile') }

  public home() { this.action.emit('home') }

  public settings() { 
    this.action.emit('showSettings');
    this.settingsEnabled = false;
  }

  public hide() { 
    this.action.emit('hideSettings');
    this.settingsEnabled = true;
  }

  public logout() { this.showLogoutAlert() }

  public changeTitle(newTitle: string) { this.title = newTitle }

  public toggleProfileOptions() { this.profileOptions = !this.profileOptions }

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
