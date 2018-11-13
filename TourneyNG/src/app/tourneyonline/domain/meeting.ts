import { Team } from './team';
import { Country } from './country';
import { Match } from './match';
import { PlayoffRule } from './playoff-rule';
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
    rule1?   : PlayoffRule;
    rule2?   : PlayoffRule;
    ruleName?: string;
}
