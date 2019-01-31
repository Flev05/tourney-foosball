import { Classification } from './classification';
import { Team } from './team';
import { MeetingDb } from './meeting-db';
import { RoundType } from './enumerations';
import { Matrix } from './matrix';

export interface Round {
    id: number;
    name: string;
    type: RoundType;

    teams?:  Team[];

    meetings?: MeetingDb[];
    meetingGroup?: number[];

    classification?: Classification[];
    matrix?: Matrix;
}
