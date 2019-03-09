import { Country } from './country';
import { ClientVO } from './client-vo';

export interface Player
{
    id?             : number;
    clientVO?       : ClientVO;
    playerName?     : string;
    address?        : string;
    phoneNumber?    : string;
    email?          : string;
    country?        : Country;
}
