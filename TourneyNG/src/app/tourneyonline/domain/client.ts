import { Country } from './country';

export interface Client
{
    id?             : number;
    businessName?   : string;
    address?        : string;
    phoneNumber?    : string;
    email?          : string;
    siteUrl?        : string;
    country?        : Country;
}