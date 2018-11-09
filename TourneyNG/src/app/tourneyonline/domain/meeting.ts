import { Team } from './team';
import { Country } from './country';
import { Match } from './match';
import { PlayoffConfig } from './playoff-config';
import { Direction } from './enumerations';

export interface Meeting
{
    id       : number;
    name     : string;
    datetime : Date;
    address  : string;
    country  : Country;
    team1    : Team;
    team2    : Team;
    direction: Direction;
    score1?  : number;
    score2?  : number;
    matches? : Match[];
    playoffConfig1?: PlayoffConfig;
    playoffConfig2?: PlayoffConfig;
}
