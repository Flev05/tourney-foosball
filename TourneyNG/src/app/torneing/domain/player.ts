import { Country } from './country';

export interface Player
{
    id?             : number;
    firstname?      : string;
    lastname?       : string;
    address?        : string;
    phoneNumber?    : string;
    email?          : string;
    country?        : Country;
}
