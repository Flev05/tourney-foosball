import { Player } from './player';
import { MeetingStatus } from './enumerations';

export interface Match {
    id?       : number;
    players1? : Player[];
    players2? : Player[];
    score1?   : number;
    score2?   : number;
    status?   : MeetingStatus;
}
