import { Classification } from './classification';
import { Team } from './team';
import { Meeting } from './meeting';
import { RoundType } from './roundType';

export interface Round {
    id?: number;
    name?: string;
    type?: RoundType;

    teams?:  Team[];
    meetings?: Meeting[];
    classification?: Classification[];
}
