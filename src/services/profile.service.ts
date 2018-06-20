/**************ANGULAR REQUIREMENTS**************/
import { Injectable }          from '@angular/core';

/*******************APP IMPORTS******************/
import { StorageService }      from '../services/storage.service';
import { Profile }             from '../models/classes/profile';
 
/**************ANGULARFIRE2 IMPORTS**************/
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable }          from 'rxjs/Observable';
import moment                  from 'moment';


@Injectable()
export class ProfileService {

    profiles: Profile[] = [];
    //userId
    selectedId: string;

    constructor(private db: AngularFireDatabase, 
                private storage: StorageService) {
        this.fetchProfiles();
    }
    //firebase methods
    async fetchProfiles(): Promise<Observable<Profile[]>>  { 
        try {
            const id: string = await this.storage.getUserId();
            this.selectedId = id;
            return this.db.list<Profile>(`profiles/${id}`).valueChanges();
        }
        catch(fetchErr) { console.log(fetchErr) }
    }

    async updateProfile(p: Partial<Profile>) {
        try { 
            //const uid: string = await this.storage.getUserId();
            const pRef = this.db.object<Profile>(`profiles/${this.selectedId}/${p.id}`);
            pRef.update(p);
        }
        catch(updateErr) { console.log(updateErr) }
    }

    async addProfile(p: Partial<Profile>) {
        try {
            //const uid: string = await this.storage.getUserId();
            const key = await this.getNewProfileId();
            console.log('newEntry id', key);
            let pRef = this.db.object<Profile>(`profiles/${this.selectedId}/${key}`);
            const newProfile = {
                alarmAt: p.alarmAt,
                alarmId: p.alarmId,
                alarmText: p.alarmText,
                desc: p.desc ? p.desc : 'sample',
                id: key,
                name: p.name,
                images: []
            };
            pRef.update(newProfile);
        }
        catch (addErr) { console.log(addErr) }
    }

    async deleteProfile(id: string) {
        try {
            //const uid: string = await this.storage.getUserId();
            let pRef = this.db.object<Profile>(`profiles/${this.selectedId}/${id}`);
            pRef.remove();
        }
        catch(deleteErr) { console.log(deleteErr) }
    }

    async deleteImage(id: string, index: number) {
        try {
            //const uid: string = await this.storage.getUserId();
            let iRef = this.db.object<Profile>(`profiles/${this.selectedId}/${id}/images/${index}`);
            iRef.remove();
        }
        catch(e) { console.log(e) }
    }


/**                                                                    */
/********************NEW PROFILE PRIVATE METHODS************************/
/**                                                                    */
    private async getNewProfileId(): Promise<string> {
        try {
            const result = await this.createNewProfile();
            return result.key;
        }
        catch(newIdErr) { console.log(newIdErr) }

    }

    private async createNewProfile() {
        try {
            const uid: string = await this.storage.getUserId();
            return this.db.list(`profiles/${uid}`).push({
                dateCreated: moment().format('MM-DD-YYYY|h:mmA')
            });
        }
        catch(createErr) { console.log(createErr) }        
    }
}