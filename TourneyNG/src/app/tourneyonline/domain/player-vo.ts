import { Country } from "./country";

export interface PlayerVO {
    id?         : number;
    playerName? : string;
    clientId?   : number;
    country?    : Country;
    json?       : string;
}

