import { Country } from './country';

export class UserVO {
    id             : number = 0;
    username       : string = "";
    password       : string = "";
    firstname?     : string;
    lastname?      : string;
    address?       : string;
    email?         : string;
    phoneNumber?   : string;
    description?   : string;
    disabled?      : string;
    country?       : Country;
}
