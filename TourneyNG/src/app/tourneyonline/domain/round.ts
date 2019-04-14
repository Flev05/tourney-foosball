import { Classification } from './classification';
import { Team } from './team';
import { Meeting } from './meeting';
import { RoundType, Direction } from './enumerations';
import { Matrix } from './matrix';

export interface Round {
    id: number;
    
    name: string;
    type: RoundType;

    direction?: Direction;
    teams?:  Team[];
    onewayMeetings?: Meeting[];
    roundtripMeetings?: Meeting[];

    classification?: Classification[];
    matrix?: Matrix;
}
