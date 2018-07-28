import { Calendar } from './calendar';
import { Classification } from './classification';

export interface Round {
    id?: number;
    roundName? : string;
    direction?: string;
    calendars? : [ Calendar ];
    classification? : [ Classification ];
}