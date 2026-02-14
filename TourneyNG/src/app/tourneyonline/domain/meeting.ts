import { Country } from './country';
import { Match } from './match';
import { PlayoffRule } from './playoff-rule';
import { MeetingStatus, Direction } from './enumerations';

export class Meeting {
    id              : number = 0;
    containerId     : number = 0;
    isDummy         : boolean = false;
    isSkiping       : boolean = false;
    name            : string = "";
    direction       : Direction = Direction.OneWay
    datetime?       : Date = new Date();
    address         : string = "";
    country?        : Country;
    teamName1       : string = "";
    teamName2       : string = "";
    day             : number = 1;
    status          : MeetingStatus;
    points1         : number = 0;
    points2         : number = 0;
    vpoints1        : number = 0;
    vpoints2        : number = 0;
    matches         : Match[] = [];
    rule1?          : PlayoffRule;
    rule2?          : PlayoffRule;
    ruleName1       : string = "";
    ruleName2       : string = "";
    ruleName        : string = "";
}
