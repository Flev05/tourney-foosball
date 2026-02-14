import { Round } from './round';
import { EliminatoryRule } from './eliminatory-rule';

export class Eliminatory  {
    id: number;
    round: Round;
    isSkiping: boolean;
    rule1?: EliminatoryRule;
    rule2?: EliminatoryRule;
}
