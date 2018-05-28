/**************ANGULAR REQUIREMENTS*************/
import { Injectable }        from '@angular/core';

/*****************APP IMPORTS*******************/
import { LoggerService }     from '../services/logger.service';
import { User }              from '../models/classes/user';

/*****************ANGULARFIRE2******************/
import { AngularFireDatabase, 
         AngularFireObject } from 'angularfire2/database';

/*******************3RD PARTY*******************/
import   firebase            from 'firebase';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {

    private _updatedUser: User;

    constructor(private logger: LoggerService, private db: AngularFireDatabase) {}

    public updateUser(user: firebase.User) {
        const savedUser = new User(user.email, false, user.uid);
        savedUser.addAccount(user.providerData[0].providerId);

        console.log('savedUser', savedUser);
        this.db.object<User>(`users/${user.uid}`).update(savedUser);
    }

    public getUser(uid: string): AngularFireObject<User> { return this.db.object<User>(`users/${uid}`) }

    public updatePersonalData(uid: string, data: Partial<User>) { this.db.object<User>(`users/${uid}`).update(data) }

    public async userExists(uid: string): Promise<boolean> {
        try {
            return await this.db.database.ref(`users/${uid}`).ref.transaction(currentVal => {
                console.log('exists:', (currentVal !== null));
                return (currentVal !== null);
            });
        }
        catch(e) { this.logger.logError(`Error, user exists, ${e.message}`) }
    }

    get updatedUser(): User { return this._updatedUser }
    set updatedUser(user: User) { this._updatedUser = user }
}