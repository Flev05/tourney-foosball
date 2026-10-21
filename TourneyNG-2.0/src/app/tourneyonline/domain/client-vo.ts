import { Country } from './country';

export class ClientVO {
    id                     : number | null = null;
    businessName           : string = "";
    address                : string = "";
    phoneNumber            : string = "";
    email                  : string = "";
    siteUrl                : string = "";
    country?               : Country;
}