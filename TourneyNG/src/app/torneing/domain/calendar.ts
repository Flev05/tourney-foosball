import { Meeting } from './meeting';

export interface Calendar {
    id?: number;
    name? : string;
    date? : string;
    time? : string;
    meetings? : [ Meeting ];
}