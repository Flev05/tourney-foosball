import { Location } from './location';

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
    // locations?      : Location;
}