import { Country } from './country';
import { Login } from './login';

export interface CommonUserVO extends Login
{
    firstname?      : string;
    lastname?       : string;

    address?        : string;
    email?          : string;
    phoneNumber?    : string;

    description?    : string;

    country?        : Country;
}
