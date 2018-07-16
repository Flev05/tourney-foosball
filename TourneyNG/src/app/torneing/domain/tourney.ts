import { Round } from './round';
import { Country } from './country';
import { Team } from './team';
import { Player } from './player';

export interface Tourney {
    id?: number;
    tourneyName? : string;
    date? : string;
    time? : string;
    address? : string;
    country? : Country;
    tourneyTypes? : [string];
    tourneyType? : string;
    round? : boolean;
    playoff? : boolean;
    elimination? : boolean;
    isScoreType? : boolean;
    goldenGol?: boolean;
    pointsToWin? : number;
    pointsGoldenGoalWin? : number;
    pointsGoldenGoalLose? : number;
    rounds?: [ Round ];
    playoffs?: [ Round ];
    teams?: [ Team ];
    players?: [ Player ];
}