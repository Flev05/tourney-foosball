import { Country } from './country';

export interface Player
{
    id?             : number;
    clientId?       : number;
    playerName?     : string;
    code?           : string;
    address?        : string;
    phoneNumber?    : string;
    email?          : string;
    isNew?          : boolean;
    country?        : Country;
}
