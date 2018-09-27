import { Round } from './round';
import { PlayoffConfig } from './playoff-config';

export class Playoff  {
    id: number;
    round: Round;
    playoffConfigs: PlayoffConfig[];
}
