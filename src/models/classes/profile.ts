import { AlarmData } from '../interfaces/alarm-data.interface';


export class Profile {

    alarmAt: Date;
    alarmId: number
    alarmText: string
    dateCreated: string;
    name: string;
    id: string;
    desc?: string;
    images?: string[];

    constructor(init?: Partial<Profile>) {
        Object.assign(this, init);
        if (!this.images) this.images = [];
    }
}