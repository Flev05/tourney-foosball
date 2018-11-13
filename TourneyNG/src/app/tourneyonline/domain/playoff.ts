import { Round } from './round';
import { PlayoffRule } from './playoff-rule';

export class Playoff  {
    id: number;
    round: Round;
    playoffConfigs: PlayoffRule[];
}
