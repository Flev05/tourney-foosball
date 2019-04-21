import { Team } from './team';
import { Country } from './country';
import { Match } from './match';
import { PlayoffRule } from './playoff-rule';
import { MeetingStatus, Direction } from './enumerations';

export interface Meeting
{
    id?             : number;
    name?           : string;
    direction?      : Direction
    datetime?       : Date;
    dateAndTime?    : any;
    address?        : string;
    country?        : Country;
    team1?          : Team;
    team2?          : Team;
    day?            : number;
    status?         : MeetingStatus;
    points1?        : number;
    points2?        : number;
    matches?        : Match[];
    rule1?          : PlayoffRule;
    rule2?          : PlayoffRule;
    ruleName?       : string;
}
