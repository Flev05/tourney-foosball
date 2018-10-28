import { Classification } from './classification';
import { Team } from './team';
import { Meeting } from './meeting';
import { RoundType } from './enumerations';
import { Matrix } from './matrix';

export interface Round {
    id: number;
    name: string;
    type: RoundType;

    teams?:  Team[];

    meetings?: Meeting[];
    classification?: Classification[];
    matrix?: Matrix;
}
