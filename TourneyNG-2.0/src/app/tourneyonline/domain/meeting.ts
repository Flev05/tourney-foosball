import { Country } from './country';
import { Match } from './match';
import { PlayoffRule } from './playoff-rule';
import { MeetingStatus, Direction } from './enumerations';

export class Meeting {
    id              : number | null = null;
    containerId     : number | null = null;
    isSkiping       : boolean = false;
    name            : string = "";
    direction       : Direction = Direction.OneWay
    datetime        : Date = new Date();
    address         : string = "";
    country         : Country = new Country();
    teamName1       : string | null = null;
    teamName2       : string | null = null;
    day             : number = 1;
    status          : MeetingStatus = MeetingStatus.ToPlay;
    points1         : number = 0;
    points2         : number = 0;
    matches1        : number = 0;
    matches2        : number = 0;
    vpoints1        : number = 0;
    vpoints2        : number = 0;
    matches         : Match[] = [];
    rule1           : PlayoffRule = new PlayoffRule();
    rule2           : PlayoffRule = new PlayoffRule();
    ruleName1       : string = "";
    ruleName2       : string = "";
    ruleName        : string = "";
}
