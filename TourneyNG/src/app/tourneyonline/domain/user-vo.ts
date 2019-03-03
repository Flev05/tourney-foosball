import { Country } from './country';

export interface UserVO
{
    id?             : number;

    username?       : string;
    password?       : string;
    firstname?      : string;
    lastname?       : string;

    address?        : string;
    email?          : string;
    phoneNumber?    : string;
    description?    : string;

    country?        : Country;
}
