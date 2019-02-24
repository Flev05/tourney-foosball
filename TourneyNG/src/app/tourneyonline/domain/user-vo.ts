import { Role } from './role';
import { Login } from './login';
import { Country } from './country';

export interface UserVO extends Login
{
    firstname?      : string;
    lastname?       : string;

    address?        : string;
    email?          : string;
    phoneNumber?    : string;

    description?    : string;

    country?        : Country;
    roles?          : Role[];
}
