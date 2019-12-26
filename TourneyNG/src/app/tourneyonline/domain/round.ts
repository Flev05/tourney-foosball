import { Classification } from './classification';
import { Meeting } from './meeting';
import { RoundType, Direction } from './enumerations';
import { Matrix } from './matrix';

export interface Round {
    id: number;
    
    selectedTabIndex?: number;
    name: string;
    type: RoundType;

    pageSize: number;
    daysNo: number;
    direction: Direction;

    teamNames: string[];

    onewayMeetings?: Meeting[];
    roundtripMeetings?: Meeting[];

    classification?: Classification[];
}
