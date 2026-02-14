import { Direction } from './enumerations';

export interface AbstractRoundVO {
    direction                       : Direction;
    matchWinnerScores?              : number;
    matchBalanceScores?             : number;
    pointsNeededToWin?              : number;
    pointsGoldenGoalTieBreakWin?    : number;
    pointsGoldenGoalTieBreakDefeat? : number;
    maxMatchesPerMeeting?           : number;
    isAllMatches?                   : string;
    allMatchesEnabled?              : boolean;
    bestOfWinner?                   : number;
}
