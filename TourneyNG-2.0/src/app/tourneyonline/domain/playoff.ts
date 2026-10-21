import { Round } from './round';
import { PlayoffRule } from './playoff-rule';

export class Playoff  {
    id: number = 0;
    round: Round = new Round();
    playoffRules: PlayoffRule[] = [];
    playoffName: string = "";
    teamNames: string = "";
    teamNo: string = "";
}
