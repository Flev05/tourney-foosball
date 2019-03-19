import { Country } from "./country";

export interface MeetingDb
{
    id?             : number;
    tourneyId?      : number;
    roundId?        : number;
    playoffId?      : number;
    eliminatoryId?  : number;
    country?        : Country;
    json?           : string;
}
