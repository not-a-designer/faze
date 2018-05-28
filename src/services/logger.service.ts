/*************ANGULAR REQUIREMENTS*************/
import { Injectable }      from '@angular/core';

/*************IONIC REQUIREMENTS**************/
import { AlertController,
         Platform,
         ToastController } from 'ionic-angular';


@Injectable()
export class LoggerService {

    constructor(private alertCtrl: AlertController,
                private platform: Platform,
                private toastCtrl: ToastController) {}

    public logError(msg: string) {
        console.log(`Err: ${msg}`);
        
        if (this.platform.is('cordova')) this.showToast(`ERR: ${msg}`);
        else this.showAlert('ERR', msg);
    }
    public logCompleted(msg: string) {
        console.log(`DONE: ${msg}`);

        if (this.platform.is('cordova')) this.showToast(`DONE: ${msg}`);
        else this.showAlert('DONE', msg);
    }

    private showToast(msg: string, pos?: string, dur?: number) {
        this.toastCtrl.create({
            message: msg,
            position: pos ? pos : 'middle',
            duration: dur ? dur : 3000
        }).present();
    }

    private showAlert(title: string, msg:string) {
        this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: ['OK']
        }).present();
    }
}