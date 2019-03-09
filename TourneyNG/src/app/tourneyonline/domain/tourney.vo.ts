import { ClientVO } from "./client-vo";
import { Country } from "./country";

export interface TourneyVO {
    id?          : number;    
    tourneyName? : string;
    clientVO?    : ClientVO;
    country?     : Country;
    json?        : string;
}