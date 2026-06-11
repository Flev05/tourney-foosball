import { Classification } from './classification';
import { Meeting } from './meeting';
import { RoundType, Direction, MeetingStatus } from './enumerations';

export class Round {
    id: number = 0;
    direction:  Direction = Direction.OneWay;
    name:       string = "";
    label:      string = "";
    type:       RoundType = RoundType.R;
    status:     MeetingStatus = MeetingStatus.ToPlay;
    pageSize:   number = 0;
    daysNo:     number = 0;
    onewayCurrentDay: number = 0;
    roundtripCurrentDay: number = 0;
    teamNames:              string[] = [];
    classificatedTeamNames: string[] = [];
    teamNo:            string = "";
    onewayMeetings:    Meeting[] = [];
    roundtripMeetings: Meeting[] = [];
    classification:    Classification[] = [];
}
