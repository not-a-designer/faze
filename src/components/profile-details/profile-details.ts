/** ANGULAR REQUIREMENTS */
import { Component,
         EventEmitter,
         Output,
         ViewChild }      from '@angular/core';



/** IONIC-ANGULAR REQUIREMENTS */
import { AlertController,
         LoadingController,
         Platform,
         Slides }         from 'ionic-angular';

/** APP IMPORTS */
import { ProfileService } from '../../services/profile.service';
import { Profile }        from '../../models/classes/profile';

import { slideFromRight } from '../../app/app.animations';


@Component({
  selector: 'profile-details',
  templateUrl: 'profile-details.html',
  animations: [ slideFromRight ]
})
export class ProfileDetailsComponent {

  @ViewChild('thumbSlide')
  thumbSlide: Slides;

  @Output('action')
  action: EventEmitter<string> = new EventEmitter<string>();

  profile: Profile;
  //profile.id: number;
  currentThumbnail: number;
  alarmSet: boolean = false;

  constructor(public platform: Platform,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private profileService: ProfileService) {
    console.log('Hello ProfileDetailsComponent Component');
    
  }

  ionViewDidLoad() {
    this.thumbSlide.centeredSlides = false;
    this.getCurrentThumbnail();
    
  }

  loadProfile(p: Profile) { this.profile = p }

  remove(index: number) {
    if (this.profile.images.length > 1) {
      this.alertCtrl.create({
        title: 'Delete thumbnail',
        message: 'are you sure you want to delete this image?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => console.log('cancel image delete')
          }, {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.profile.images.splice(index, 1);
              this.profileService.updateProfile(this.profile);
              //this.action.emit('deleteThumbnail');
              if (index === 0)this.thumbSlide.slideNext();
              else this.thumbSlide.slidePrev();
              this.thumbSlide.update();
            }
          }
        ]
      }).present();
    }
    else this.action.emit('deleteProfile');
  }

  updateAlarm(event) {
    const loader = this.loadingCtrl.create({ content: 'updating...' });
    loader.present();
    
    setTimeout(() => {
      this.profileService.updateProfile(this.profile);
      loader.dismiss();
    }, 750);
  }

  back() { 
    this.action.emit('back') }

  showAlarmPicker() { this.alarmSet = true }

  toggleSlideLock() {
    this.getCurrentThumbnail();
    this.thumbSlide.lockSwipes(false);
    if (this.thumbSlide.isBeginning()) this.thumbSlide.lockSwipeToPrev(true);
    else if (this.thumbSlide.isEnd()) this.thumbSlide.lockSwipeToNext(true);
    else if (this.profile.images.length === 1) this.thumbSlide.lockSwipes(true);
    else return;
  }

  getCurrentThumbnail() { this.currentThumbnail = this.thumbSlide.getActiveIndex() + 1 }

  get isMd() { return this.platform.is('android') }
}
