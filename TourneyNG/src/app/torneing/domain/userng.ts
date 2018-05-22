import { Roles } from './roles';

export interface Userng
{
    id?             : number;
    firstname?      : string;
    lastname?       : string;
    username?       : string;
    password?       : string;
    address?        : string;
    email?          : string;
    phoneNumber?    : string;
    roles?          : [ Roles ];
}