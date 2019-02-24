import { Country } from './country';
import { UserVO } from './user-vo';

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
    userVo?                 : UserVO[];
}