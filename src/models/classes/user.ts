export class User {

    public linkedAccounts: string[] = [];

    private _birthdate: string;
    private _displayName: string;
    private _firstName: string;
    private _gender: string;
    private _lastName: string;

    
    
    constructor(public email: string,
                public isAdmin: boolean,
                public uid: string,
               // public bday?: string,
                //public dn?: string,
                //public fName?: string,
               // public gend?: string,
               // public lName?: string
            ) {
        
        
    }

    set birthdate(birthdate: string) { this._birthdate = birthdate }
    get birthdate() { return this._birthdate }

    set displayName(name: string) { this._displayName = name }
    get displayName() { return this._displayName }

    set firstName(name: string) { this._firstName = name }
    get firstName() { return this._firstName }

    set gender(g: string) {this._gender = g }
    get gender() { return this._gender }

    set lastName(name: string) { this._lastName = name }
    get lastName() { return this._lastName }

    /*set linkedAccounts(providers: string[]) { this._linkedAccounts = providers }
    get linkedAccounts() { return this._linkedAccounts.slice() }*/

    addAccount(providerId: string) {
        let index = this.linkedAccounts.indexOf(providerId);
        if (index === -1) this.linkedAccounts.push(providerId);
        else console.log('duplicate provider');
    }

    removeAccount(providerId: string) {
        if (this.linkedAccounts.length > 1) {
            let index = this.linkedAccounts.indexOf(providerId);
            if (index > -1) this.linkedAccounts.splice(index, 1);
            else console.log('provider does not exist');
        }
        else console.log('must have at least 1 auth provider');
    }
}