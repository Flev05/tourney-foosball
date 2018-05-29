import { Role } from './role';
import { Location } from './location';
import { Client } from './client';

export interface Userng
{
    id?             : number;
    firstname?      : string;
    password?       : string;

    address?        : string;
    email?          : string;
    phoneNumber?    : string;

    lastname?       : string;
    username?       : string;

    description?    : string;

    client?         : Client;
    locations?      : Location;

    roles?          : [ Role ];
}