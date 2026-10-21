import { FromRound } from './from-round';

export class ObjectiveConfig   {
    id: number | null = null;
    fromRound:         FromRound = new FromRound();
    fromPlayoff:       FromRound = new FromRound();
    fromEliminatory:   FromRound = new FromRound();
}
