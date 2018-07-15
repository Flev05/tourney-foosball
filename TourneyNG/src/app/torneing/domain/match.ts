import { Player } from './player';

export interface Match {
    id?       : number;
    players1? : [Player];
    players2? : [Player];
    score1?   : string;
    score2?   : string;
}