import { Round } from './round';
import { PlayoffRule } from './playoff-rule';

export class Playoff  {
    id: number;
    round: Round;
    playoffRules: PlayoffRule[];
    playoffName?: string;
    teamNames?: string;
}
