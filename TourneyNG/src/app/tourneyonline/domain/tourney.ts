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

export interface Tourney {
    id?: number;
    tourneyName? : string;
    date? : string;
    time? : string;
    address? : string;
    country? : Country;
    
    discipline? : Discipline;

    tourneyType?: TourneyType;
    raceDuration?: number;

    gender?: string;
    phases?: [string];

    teamPointsForWin?: number;
    teamPointsForDefeat?: number;
    teamPointsForPartity?: number;

    teamNo?: number;
    roundNo?: number;
    eliminationLevel?: number;

    pointsForWin? : number;
    pointsForDefeat? : number;
    pointsForParity? : number;
    
    goldenGoal?: boolean;
    pointsGoldenGoalWin? : number;
    pointsGoldenGoalDefeat? : number;

    rounds?: [ Round ];
    playoffs?: [ Round ];
    eliminations?: [ TreeNode ];
    teams?: [ Team ];
    players?: [ Player ];

    roundConfig?: RoundConfig;
    playoffConfig?: PlayoffConfig;
    eliminationConfig?: EliminationConfig;
}