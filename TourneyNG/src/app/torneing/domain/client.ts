import { Country } from './country';

export interface Client
{
    id?             : number;
    firstname?      : string;
    lastname?       : string;
    businessName?   : string;
    address?        : string;
    phoneNumber?    : string;
    email?          : string;
    siteUrl?        : string;
    country?        : Country;
}