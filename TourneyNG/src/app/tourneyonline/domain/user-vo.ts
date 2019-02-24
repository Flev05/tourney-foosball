import { RoleVO } from './role-vo';
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
    roles?          : RoleVO[];
    clientIdList?   : number[];
}
