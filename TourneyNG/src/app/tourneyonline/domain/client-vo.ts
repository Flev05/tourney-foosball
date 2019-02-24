import { Country } from './country';

export interface ClientVO
{
    id?                     : number;
    businessName?           : string;
    address?                : string;
    phoneNumber?            : string;
    email?                  : string;
    siteUrl?                : string;
    userAlreadyRegistered?  : boolean;
    country?                : Country;
}