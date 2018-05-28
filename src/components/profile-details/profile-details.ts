/** ANGULAR REQUIREMENTS */
import { Component,
         EventEmitter,
         Output,
         ViewChild }      from '@angular/core';

/** IONIC-ANGULAR REQUIREMENTS */
import { AlertController,
         Platform,
         Slides }         from 'ionic-angular';

/** APP IMPORTS */
import { Profile }        from '../../models/classes/profile';


@Component({
  selector: 'profile-details',
  templateUrl: 'profile-details.html'
})
export class ProfileDetailsComponent {

  @ViewChild('thumbSlide')
  thumbSlide: Slides;

  @Output('profileRemoved')
  profileRemoved: EventEmitter<number> = new EventEmitter<number>();

  @Output('profileUpdated')
  profileUpdated: EventEmitter<any> = new EventEmitter<any>();

  profile: Profile;
  selectedId: number;
  currentSlide: number;
  alarmSet: boolean = false;

  constructor(private platform: Platform,
              private alertCtrl: AlertController,) {
    console.log('Hello ProfileDetailsComponent Component');
  }

  ionViewDidLoad() {
    this.thumbSlide.centeredSlides = false;
    this.thumbSlide.initialSlide = 0;
    this.getCurrentSlide();
    this.thumbSlide.lockSwipeToPrev(true);
  }

  loadProfile(p: Profile) {
    this.profile = p;
  }

  slideNext() {
    this.thumbSlide.lockSwipeToPrev(false);
    this.thumbSlide.slideNext();
    this.getCurrentSlide();
    if (this.thumbSlide.isEnd()) this.thumbSlide.lockSwipeToNext(true);
  }

  slidePrev() {
    this.thumbSlide.lockSwipeToNext(false);
    this.thumbSlide.slidePrev();
    this.thumbSlide.update();
    this.getCurrentSlide();
    if (this.thumbSlide.isBeginning()) this.thumbSlide.lockSwipeToPrev(true);
  }

  removeImage(index: number) {
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
            if (this.profile.images.length > 1) {
              this.thumbSlide.lockSwipes(true);
              this.thumbSlide.update();
            }
            else this.profileRemoved.emit(index);
          }
        }
      ]
    }).present();
  }

  showAlarmPicker() {
    this.alarmSet = true;
  }

  getCurrentSlide() {
    this.currentSlide = this.thumbSlide.getActiveIndex();
  }

  get isMd() {
    return this.platform.is('android');
  }
}
