import { Round } from './round';

export interface Tourney {
    id?: number;
    tourneyName? : string;
    date? : string;
    time? : string;
    address? : string;
    tourneyTypes? : [string];
    tourneyType? : string;
    tour? : boolean;
    playoff? : boolean;
    elimination? : boolean;
    goldenGol?: boolean;
    pointsToWin? : number;
    pointsGoldenGoalWin? : number;
    pointsGoldenGoalLose? : number;
    rounds?: [ Round ];
    playoffs?: [ Round ];
}