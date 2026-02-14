import { Classification } from './classification';
import { Meeting } from './meeting';
import { RoundType, Direction } from './enumerations';

export class Round {
    id: number;
    direction:  Direction;
    name:       string;
    label?:     string;
    type:       RoundType;
    pageSize:   number;
    daysNo:     number;
    onewayCurrentDay: number;
    roundtripCurrentDay: number;
    teamNames:              string[];
    classificatedTeamNames?: string[];
    teamNo?:            string;
    onewayMeetings?:    Meeting[];
    roundtripMeetings?: Meeting[];
    classification?:    Classification[];
}
