import { Meeting } from './meeting';

export interface Calendar {
    id?: number;
    meetingName? : string;
    meetings? : [ Meeting ];
}