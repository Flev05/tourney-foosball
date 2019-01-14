import { Role } from './role';
import { Country } from './country';
import { Client } from './client';
import { Login } from './login';

export interface Userng extends Login
{
    firstname?      : string;
    lastname?       : string;

    address?        : string;
    email?          : string;
    phoneNumber?    : string;

    description?    : string;

    client?         : Client;
    country?        : Country;

    roles?          : [ Role ];
}
