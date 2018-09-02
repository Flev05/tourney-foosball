import { Team } from './team';
import { Country } from './country';
import { Match } from './match';

export interface Meeting
{
    id?      : number;
    name?    : string;
    date?    : string;
    time?    : string;
    address? : string;
    country? : Country;
    team1?   : Team;
    team2?   : Team;
    score1?  : string;
    score2?  : string;
    matches? : [ Match ];
}
