import { Direction } from './enumerations';

export class AbstractRoundVO {
    direction                      : Direction = Direction.OneWay;
    matchWinnerScores              : number=0;
    matchBalanceScores             : number=0;
    pointsNeededToWin              : number=0;
    pointsGoldenGoalTieBreakWin    : number=0;
    pointsGoldenGoalTieBreakDefeat : number=0;
    maxMatchesPerMeeting           : number = 0;
    isAllMatches                   : string="";
    allMatchesEnabled              : boolean=true;
    bestOfWinner                   : number=0;
}
