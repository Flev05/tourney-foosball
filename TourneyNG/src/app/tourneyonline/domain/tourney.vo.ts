import { ClientVO } from "./client-vo";
import { Country } from "./country";
import { MeetingDb } from "./meeting-db";

export interface TourneyVO {
    id?             : number;    
    tourneyName?    : string;
    disciplineId?   : number;
    followerName?   : string;
    clientVO?       : ClientVO;
    country?        : Country;
    json?           : string;
    mdbs?           : MeetingDb[];
}