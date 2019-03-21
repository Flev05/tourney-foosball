import { ClientVO } from "./client-vo";
import { Country } from "./country";

export interface TeamVO {
    id?         : number;
    teamName?   : string;
    clientId?   : number;
    country?    : Country;
    json?       : string;
}
