import { Calendar } from './calendar';
import { Classification } from './classification';
import { Team } from './team';
import { RoundConfig } from './round-config';

export interface Round extends RoundConfig {
    id?: number;
    roundName?: string;

    direction?: string;
    teams?: [ Team ];
    calendars?: [ Calendar ];
    classification?: [ Classification ];
}
