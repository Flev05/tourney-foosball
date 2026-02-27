import { FromRound } from './from-round';

export class PlayoffRule {
    id: number = 0;
    fromRound: FromRound = new FromRound();
    ruleName: string = "";
    isDummy: boolean = false;
}
