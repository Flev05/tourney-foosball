import { Round } from './round';

export interface Tourney {
    id?: number;
    tourneyName? : string;
    date? : string;
    time? : string;
    address? : string;
    rounds?: [ Round ];
}