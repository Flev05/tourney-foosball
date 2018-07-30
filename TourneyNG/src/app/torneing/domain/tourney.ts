import { Round } from './round';
import { Country } from './country';
import { Team } from './team';
import { Player } from './player';
import { TreeNode } from 'primeng/api';
import { Typology } from './typology';

export interface Tourney {
    id?: number;
    tourneyName? : string;
    date? : string;
    time? : string;
    address? : string;
    country? : Country;
    
    typology? : Typology;

    terminationType?: string;
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
}