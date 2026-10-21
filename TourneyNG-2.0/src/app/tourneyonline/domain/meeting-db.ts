import { Country } from "./country";

export class MeetingDb
{
    id             : number | null = null;
    tourneyId      : number | null = null;
    roundId        : number | null = null;
    playoffId      : number | null = null;
    playoutId      : number | null = null;
    eliminatoryId  : number | null = null;
    eliminatoryBId : number | null = null;
    country?       : Country;
    json           : string = "";
}
