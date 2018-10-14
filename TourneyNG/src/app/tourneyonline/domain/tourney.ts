import { Round } from './round';
import { Playoff } from './playoff';
import { Eliminatory } from './eliminatory';

import { Country } from './country';
import { Team } from './team';
import { Player } from './player';

import { Discipline } from './discipline';

import { TourneyType } from './tourneyType';
import { Final } from './final';
import { PhaseType, EliminatoryMode } from './phase-type';

export interface Tourney {
    id?: number;
    
    tourneyName? : string;
    dateInMillis? : number;
    dateAsString? : string;
    timeAsString? : string;
    address? : string;
    country? : Country;
    
    isOnewayRound?: boolean;
    isOnewayPlayoff?: boolean;
    isOnewayEliminatory?: boolean;

    access?: string;
    discipline? : Discipline;

    tourneyType?: TourneyType;
    raceDuration?: number;

    phases?: PhaseType[];

    matchWinnerScores?: number;
    matchLoserScores?: number;
    matchBalanceScores?: number;

    pointsNeededToWin? : number;
    pointsGoldenGoalTieBreakWin? : number;
    pointsGoldenGoalTieBreakDefeat? : number;
    
    objectives?: Final[];
    rounds?: Round[];
    playoffs?: Playoff[];

    eliminatories?: Eliminatory[];
    eliminatoryMode?: EliminatoryMode;

    teams?: Team[];
    players?: Player[];
}