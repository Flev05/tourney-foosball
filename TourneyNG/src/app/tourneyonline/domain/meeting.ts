import { Team } from './team';
import { Country } from './country';
import { Match } from './match';
import { PlayoffConfig } from './playoff-config';

export interface Meeting
{
    id       : number;
    name     : string;
    datetime : Date;
    address  : string;
    country  : Country;
    team1    : Team;
    team2    : Team;
    score1?  : number;
    score2?  : number;
    matches? : Match[];
    playoffConfigs?: PlayoffConfig[];
}
