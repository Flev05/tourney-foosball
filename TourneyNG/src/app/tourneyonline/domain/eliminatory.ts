import { Round } from './round';
import { EliminatoryConfig } from './eliminatory-config';

export class Eliminatory  {
    id: number;

    enabled: boolean;

    round: Round;

    level: number;

    tc1: EliminatoryConfig;
    tc2: EliminatoryConfig;
}
