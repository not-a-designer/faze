import { Component,
         EventEmitter,
         Input,
         Output }        from '@angular/core';

import { AlertController,
         Platform }      from 'ionic-angular';

import { fade, 
         fadeIn, 
         slideFromRight, 
         slideFromLeft } from '../../app/app.animations';


@Component({
  selector: 'camera-preview',
  templateUrl: 'camera-preview.html',
  animations: [ fade, fadeIn, slideFromRight, slideFromLeft ]
})
export class CameraPreviewComponent {

  //emits:
  //capturePreview, savePreview, deletePreview, back, toggleDirection, toggleFlash
  @Output('action')
  action: EventEmitter<string> = new EventEmitter<string>();

  @Input('capture')
  capture: string;

  @Input('previous')
  prev: string;

  @Input('flashStatus')
  flashStatus: boolean;

  isPicTaken: boolean = false;

  /** camera direction toggle */
  isFrontFacing: boolean = true;

  /** flash toggle */
  isFlashOn: boolean = false;
  //isFlashAvailable: boolean = true;

  /** previous image overlay opacity toggle */
  isOpacityOpen: boolean = false;

  /** previous image overlay opacity */
  opacity: number = 1;

  //screenWidth: string = this.platform.width().toString();
  //previousImage = `http://via.placeholder.com/${this.screenWidth}`;
  //previousImage: string;

  

  constructor(private alertCtrl: AlertController,
              public platform: Platform) {

    console.log('Hello CameraPreviewComponent Component');  
  }
  
  public capturePreview() { 
    this.isOpacityOpen = false;
    this.action.emit('capturePreview');
  }

  public deletePreview() { 
    this.alertCtrl.create({
      title: 'Delete Capture',
      message: 'Are you sure you want to delete the preview?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('dont delete')
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.action.emit('deletePreview')
        }
      ]
    }).present();
  }

  public savePreview() { this.action.emit('savePreview') }

  public goBack() { this.action.emit('back')}

  public toggleOpacity() { 
    this.isOpacityOpen = !this.isOpacityOpen;
    this.flashStatus = !this.flashStatus;
  }

  public toggleCamera() {
    this.action.emit('toggleDirection');
    this.isFrontFacing = !this.isFrontFacing;
  }

  public toggleFlash() {
    this.action.emit('toggleFlash');
    this.isFlashOn = !this.isFlashOn;
  }

  get isNative() { 
    return (this.platform.is('cordova') || 
            this.platform.is('android') || 
            this.platform.is('ios')) 
  }
}
