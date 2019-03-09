import { Country } from "./country";
import { ClientVO } from "./client-vo";

export interface PlayerVO {
    id?         : number;
    playerName? : string;
    clientVO?   : ClientVO;
    country?    : Country;
    json?       : string;
}

