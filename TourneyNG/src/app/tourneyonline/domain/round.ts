import { Classification } from './classification';
import { Team } from './team';
import { RoundConfig } from './round-config';
import { Meeting } from './meeting';

export interface Round extends RoundConfig {
    id?: number;
    name?: string;

    direction?: string;
    teams?: [ Team ];
    calendars?: [ Meeting ];
    classification?: [ Classification ];
}
