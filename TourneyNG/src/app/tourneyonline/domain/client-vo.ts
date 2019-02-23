import { Country } from './country';
import { CommonUserVO } from './common-user-vo';

export interface ClientVO
{
    id?                 : number;
    businessName?       : string;
    address?            : string;
    phoneNumber?        : string;
    email?              : string;
    siteUrl?            : string;
    country?            : Country;
    userAlreadyRegistered?   : boolean;
    cuvo?               : CommonUserVO;
}