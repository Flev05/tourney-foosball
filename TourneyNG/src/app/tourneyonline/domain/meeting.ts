import { Team } from './team';
import { Country } from './country';
import { Match } from './match';
import { PlayoffRule } from './playoff-rule';
import { MeetingStatus, Direction } from './enumerations';

export interface Meeting
{
    id?             : number;
    isDummy?        : boolean;
    name?           : string;
    direction?      : Direction
    datetime?       : Date;
    dateAndTime?    : string;
    address?        : string;
    country?        : Country;
    team1?          : Team;
    teamName1?      : string;
    team2?          : Team;
    teamName2?      : string;
    day?            : number;
    status?         : MeetingStatus;
    points1?        : number;
    points2?        : number;
    matches?        : Match[];
    rule1?          : PlayoffRule;
    ruleName1?      : string;
    rule2?          : PlayoffRule;
    ruleName2?      : string;
    ruleName?       : string;
}
