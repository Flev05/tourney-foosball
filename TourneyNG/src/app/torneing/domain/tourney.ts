import { Calendar } from './calendar';

export interface Tourney {
    id?: number;
    name? : string;
    date? : string;
    time? : string;
    address? : string;
    calendars?: [ Calendar ]
}