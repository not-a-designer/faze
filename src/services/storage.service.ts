/**********ANGULAR REQUIREMENTS**********/
import { Injectable }   from '@angular/core';

/***********IONIC LOCAL STORAGE**********/
import { Storage }      from '@ionic/storage';

/************LOGGER SERVICE**************/
import { LoggerService } from '../services/logger.service';


@Injectable()
export class StorageService {

    constructor(private logger: LoggerService,
                private storage: Storage) {
        this.storage.ready()
            .then(() => console.log('storage ready'))
            .catch((error) => this.logger.logError(error.message));;
    }

    public async saveToStorage(key: string, value: string): Promise<any> {
        try {
            await this.storage.ready();
            return await this.storage.set(key, value);
        }
        catch(e) { this.logger.logError(`Storage service set error ${e.message}`) }
    }

    public setStorage(key: string, value: any): Promise<any> {            
        return this.storage.ready()
            .then(() => {;
                return this.storage.set(key, value);
            })
            .catch((error) => this.logger.logError(error.message));
    }

    public async fetchFromStorage(key: string): Promise<any> {
        try {
            await this.storage.ready();
            return await this.storage.get(key);
        }
        catch(e) { this.logger.logError(`Storage service get error ${e.message}`) }
    }

    public getStorage(key: string): Promise<any> {
        return this.storage.ready()
            .then(() => {
                return this.storage.get(key);
            })
            .catch((error) => this.logger.logError(error.message));
    }

    public async deleteFromStorage(key: string): Promise<any> {
        try {
            await this.storage.ready();
            return await this.storage.remove(key);
        }
        catch(e) { this.logger.logError(`Storage service delete error ${e.message}`) }
    }

    public deleteStorage(key: string): Promise<any> {
        return this.storage.ready()
            .then(() => {
                return this.storage.remove(key);
            })
            .catch((error) => this.logger.logError(error.message));
    }

    public async clearAll() {
        try {
            await this.storage.ready();
            return await this.storage.clear();
        }
        catch(e) { this.logger.logError(`Storage service clear error ${e.message}`) }
    }

    public clearStorage(): Promise<void> {
        return this.storage.ready()
            .then(() => {
                return this.storage.clear();
            })
            .catch((error) => this.logger.logError(error.message));
    }

    public async getUserId(): Promise<string> {
        try { return await this.getStorage('userId') }
        catch(idErr) { console.log(idErr) }
    }

    public async saveProvider(p: string) {
        try {
            const list: string[] = await this.getStorage('providers');
            if (!list) await this.setStorage('providers', [p]);
            else {
                list.push(p);
                await this.setStorage('providers', list);
            }
        }
        catch(AddPErr) { console.log(AddPErr) }
    }
}