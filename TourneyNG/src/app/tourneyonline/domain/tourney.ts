import { Round } from './round';
import { Country } from './country';
import { Team } from './team';
import { Player } from './player';
import { TreeNode } from 'primeng/api';
import { Discipline } from './discipline';
import { RoundConfig } from './round-config';
import { PlayoffConfig } from './playoff-config';
import { EliminationConfig } from './elimination-config';
import { TourneyType } from './tourneyType';
import { Final } from './final';

export interface Tourney {
    id?: number;
    tourneyName? : string;
    dateInMillis? : number;
    dateAsString? : string;
    timeAsString? : string;
    address? : string;
    country? : Country;
    
    discipline? : Discipline;

    tourneyType?: TourneyType;
    raceDuration?: number;

    phases?: [string];

    matchWinnerScores?: number;
    matchLoserScores?: number;
    matchBalanceScores?: number;

    pointsNeededToWin? : number;
    pointsGoldenGoalTieBreakWin? : number;
    pointsGoldenGoalTieBreakDefeat? : number;

    teamNo?: number;
    roundNo?: number;
    eliminationLevel?: number;

    finals?: [ Final ];
    rounds?: [ Round ];
    playoffs?: [ Round ];
    eliminations?: [ TreeNode ];
    teams?: [ Team ];
    players?: [ Player ];

    roundConfig?: RoundConfig;
    playoffConfig?: PlayoffConfig;
    eliminationConfig?: EliminationConfig;
}