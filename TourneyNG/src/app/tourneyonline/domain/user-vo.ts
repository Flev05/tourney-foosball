import { Role } from './role';
import { Country } from './country';
import { Client } from './client';
import { Login } from './login';

export interface UserVO extends Login
{
    firstname?      : string;
    lastname?       : string;

    address?        : string;
    email?          : string;
    phoneNumber?    : string;

    description?    : string;

    country?        : Country;
    
    roles?          : [ Role ];
    clients?        : [Client];
}
