import { FromRound } from './from-round';

export interface ObjectiveConfig   {
    id: number;
    fromRound?:         FromRound;
    fromPlayoff?:       FromRound;
    fromEliminatory?:   FromRound;
}
