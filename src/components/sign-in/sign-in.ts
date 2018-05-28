/** ANGULAR REQUIREMENTS */
import { Component,
         EventEmitter,
         Output }        from '@angular/core';

/** IONIC REQUIREMENTS */
import { Platform }      from 'ionic-angular';

/** APP IMPORTS */
import { LoggerService } from '../../services/logger.service';

/** ANIMATIONS IMPORT */
import { fade }          from '../../app/app.animations';


@Component({
  selector: 'sign-in',
  templateUrl: 'sign-in.html',
  animations: [ fade ]
})
export class SignInComponent {

  email: string = null;
  password: string = null;

  @Output() 
  authStatus: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(private platform: Platform,
              private logger: LoggerService) {
    console.log('Hello SignInComponent Component');
  }

  checkValidity(): boolean {
    if (this.email == null || this.password == null) return false;
    if (this.email === this.password) return false;
    else return true;
  }

  login() {
    if (this.checkValidity() === true) this.authStatus.emit([this.email, this.password]);
    else {
      this.logger.logError('invalid form');
      this.clearInput();
    }
  }

  clearInput() {
    this.email = '';
    this.password = '';
  }

  get isMd() {
    return this.platform.is('android');
  }

}
