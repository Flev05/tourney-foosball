import { Classification } from './classification';
import { Team } from './team';
import { RoundConfig } from './round-config';
import { Meeting } from './meeting';
import { RoundType } from './roundType';

export interface Round extends RoundConfig {
    id?: number;
    name?: string;
    type?: RoundType;

    teams?:  Team[];
    calendars?: Meeting[];
    classification?: Classification[];
}
