import { Country } from "./country";

export interface MeetingDb
{
    id?             : number;
    tourneyId?      : number;
    roundId?        : number;
    playoffId?      : number;
    playoutId?      : number;
    eliminatoryId?  : number;
    eliminatoryBId? : number;
    country?        : Country;
    json?           : string;
}
