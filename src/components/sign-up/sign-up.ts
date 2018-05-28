/** ANGULAR REQUIREMENTS */
import { Component,
         EventEmitter,
         Output }        from '@angular/core';

/** IONIC REQUIREMENTS */
import { Platform }      from 'ionic-angular';

/** APP IMPORTS */
import { LoggerService } from '../../services/logger.service';

/** 3RD PARTY IMPORTS */
import moment            from 'moment';


@Component({
  selector: 'sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpComponent {

  @Output()
  authStatus: EventEmitter<string[]> = new EventEmitter<string[]>();

  email: string = null;
  password: string = null;
  confirm: string = null;
  birthdate: string = null;

  constructor(private platform: Platform,
              private logger: LoggerService) {
    console.log('Hello SignUpComponent Component');
  }

  checkValidity(): boolean {
    

    if (this.email == null || 
        this.password == null || 
        this.confirm == null ||
        this.birthdate == null) return false;
    if (this.email.length < 3) return false;
    if (this.password.length < 6) return false;
    else if (this.confirm !== this.password) return false;
    else return true;
  }

  async register() {
    if (this.checkValidity()) {
      const dob: string = moment(this.birthdate).format('YYYY-MM-DD')
      this.authStatus.emit([this.email, this.password, dob]);
    }
    else {
      this.logger.logError('invalid form');
      this.clearInput();
    }
  }

  clearInput() {
    this.email = '';
    this.password = '';
    this.confirm = '';
    this.birthdate = '';
  }

  get isMd() {
    return this.platform.is('android');
  }
}
