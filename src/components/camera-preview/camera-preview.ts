import { Component,
         EventEmitter,
         Input,
         Output,
         ViewChild }                   from '@angular/core';

import { FabContainer,
         Platform,
         Range }                       from 'ionic-angular';

import { LoggerService }              from '../../services/logger.service';

import { fade, 
         fadeIn, 
         slideFromRight, 
         slideFromLeft }              from '../../app/app.animations';


@Component({
  selector: 'camera-preview',
  templateUrl: 'camera-preview.html',
  animations: [ fade, fadeIn, slideFromRight, slideFromLeft ]
})
export class CameraPreviewComponent {
 
  @ViewChild('opacityFab')
  opacityFab: FabContainer;

  @ViewChild(Range)
  opacityRange: Range;

  @ViewChild(HTMLImageElement)
  captureImage: HTMLImageElement;

  //emits:
  //capturePreview, savePreview, deletePreview, back, toggleDirection, toggleFlash
  @Output('action')
  action: EventEmitter<string> = new EventEmitter<string>();

  @Input('capture')
  capture: string;

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
  opacity: number = 0;

  
  screenWidth: string = this.platform.width().toString();
  previousImage = `http://via.placeholder.com/${this.screenWidth}`;
  //previousImage: string;

  

  constructor(private logger: LoggerService,
              public platform: Platform) {

    console.log('Hello CameraPreviewComponent Component');  
  }
  
  public capturePreview() { 
    this.isOpacityOpen = false;
    //this.isPicTaken = true;
    this.action.emit('capturePreview');
  }

  public deletePreview() {
    this.action.emit('deletePreview'); 
  }

  public savePreview() {
    this.action.emit('savePreview');
  }

  public goBack() { 
    this.action.emit('back');
  }

  public toggleOpacity() { this.isOpacityOpen = !this.isOpacityOpen }

  public toggleCamera() {
    this.action.emit('toggleDirection');
    this.isFrontFacing = !this.isFrontFacing;
  }

  public toggleFlash() {
    this.action.emit('toggleFlash');
    this.isFlashOn = !this.isFlashOn;
  }


}
