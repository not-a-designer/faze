import { Injectable }         from '@angular/core';

import { LocalNotifications, 
         ILocalNotification } from '@ionic-native/local-notifications';

import { LoggerService }      from './logger.service';


/* ILOCALNOTIFICATION

    id: number;
    title: string;
    text: string | string[];
    badge: number;
    sound: string;
    data: any;
    priority: number;
    silent: boolean;
    launch: boolean;
    actions: string | ILocalNotificationAction[];
    trigger: ILocalNotificationTrigger;
    attachments: string[];
    progressBar: ILocalNotificationProgressBar | boolean;
    
    //ANDROID-ONLY
    icon: string;
    smallIcon: string;
    color: string;
    vibrate: string;
    led: {color: string, on: number, off: number} | any[] | boolean | string;
    wakeup: boolean;
    timeoutAfter: number;
    clock: boolean | string;
    group: string;
    groupSummary: boolean;
    summary: string;
    number: number;
    sticky: boolean;
    autoClear: boolean;
    lockscreen: boolean;
    defaults: number;
    channel: string;
    mediaSession: string;
}*/


@Injectable()
export class NotificationService {

    constructor(private notifications: LocalNotifications,
                private logger: LoggerService) {}

    public async getAlarms() { 
        const scheduled = await this.notifications.getAllScheduled();
        if (scheduled.length) {
            let scheduleList: Array<any> = [];
            scheduled.forEach(schedule => scheduleList.push(schedule.id));
            this.logger.logCompleted(`scheduled IDs: ${scheduleList}`)
        }
        else this.logger.logError('no scheduled alarms');
    }

    public async createAlarm(alarmData: ILocalNotification[]) {
        try {
            const permission: boolean = await this.notifications.hasPermission();

            if (permission) this.create(alarmData);
            else {
                const request: boolean = await this.notifications.requestPermission();
                if (request) this.create(alarmData);
                else this.logger.logError('Faze is not authorized to access local notifications');
            }
        }
        catch(e) { this.logger.logError(`create error ${e}`) }
        
    }

    private create(data: ILocalNotification[]) { this.notifications.schedule(data) }

    async updateTime(id: number, newTime: any) {
        try{ 
            const allScheduled = await this.notifications.getAllScheduled();
            for (let notification of allScheduled) {
                if (notification.id === id) {
                    notification.trigger.at = newTime;
                    this.logger.logCompleted(`{${notification.title} time updated`);
                    return;
                }
            }
        }
        catch(e) { this.logger.logError(`update time error ${e}`) }
    }


}