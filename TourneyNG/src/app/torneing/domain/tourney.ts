import { Round } from './round';
import { Country } from './country';
import { Team } from './team';
import { Player } from './player';
import {TreeNode} from 'primeng/api';
import { Typology } from './typology';

export interface Tourney {
    id?: number;
    tourneyName? : string;
    date? : string;
    time? : string;
    address? : string;
    country? : Country;
    
    typology? : Typology;

    criteria?: string;
    gender?: string;
    phases?: [string];

    teamNo?: number;
    maxTeamNo?: number;
    roundNo?: number;

    pointsForWin? : number;
    pointsForLose? : number;
    pointsForParity? : number;
    goldenGol?: boolean;
    pointsGoldenGoalWin? : number;
    pointsGoldenGoalLose? : number;
    rounds?: [ Round ];
    playoffs?: [ Round ];
    eliminations?: [ TreeNode ];
    teams?: [ Team ];
    players?: [ Player ];
}