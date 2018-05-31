import { Role } from './role';
import { Country } from './country';
import { Client } from './client';

export interface Userng
{
    id?              : number;
    firstname?       : string;
    lastname?       : string;
    username?       : string;
    password?       : string;

    address?        : string;
    email?          : string;
    phoneNumber?    : string;

    description?    : string;

    client?         : Client;
    country?        : Country;

    roles?          : [ Role ];
}