import { ClientVO } from "./client-vo";
import { Country } from "./country";
import { MeetingDb } from "./meeting-db";

export class TourneyVO {
    id             : number = 0;    
    tourneyName    : string = "";
    clonedFromTourneyName    : string = "";
    calendar       : string = "";
    disciplineId   : number = 0;
    followerName   : string = "";
    clientVO       : ClientVO = new ClientVO();
    country        : Country = new Country();
    json           : string = "";
    mdbs           : MeetingDb[] = [];
}