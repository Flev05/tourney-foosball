import { Player } from './player';
import { MeetingStatus } from './enumerations';

export class Match {
    id       : number = 0; 
    players1 : Player[] = [];
    players2 : Player[] = [];
    score1   : number = 0;
    score2   : number = 0;
    status   : MeetingStatus = MeetingStatus.ToPlay;
}
