import { Classification } from './classification';
import { Meeting } from './meeting';
import { RoundType, Direction } from './enumerations';

export interface Round {
    id: number;
    
    selectedTabIndex?: number;
    name: string;
    label?: string;
    type: RoundType;

    pageSize: number;
    daysNo: number;
    onewayCurrentDay: number;
    roundtripCurrentDay: number;

    direction: Direction;

    teamNames: string[];

    onewayMeetings?: Meeting[];
    roundtripMeetings?: Meeting[];

    classification?: Classification[];
}
