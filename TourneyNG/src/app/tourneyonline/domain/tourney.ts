import { Round } from './round';
import { Playoff } from './playoff';
import { Eliminatory } from './eliminatory';

import { Country } from './country';
import { Team } from './team';
import { Player } from './player';

import { Discipline } from './discipline';

import { TourneyType } from './enumerations';
import { Final } from './final';
import { PhaseType, EliminatoryMode } from './enumerations';
import { EliminatoryLevel } from './eliminatory-level';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

export interface Tourney {
    id?: number;
    
    tourneyName? : string;
    dateInMillis? : number;
    dateAsString? : string;
    timeAsString? : string;
    address? : string;
    country? : Country;

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

    eliminatoryLevels?: Array<EliminatoryLevel>;

    eliminatoryMode?: EliminatoryMode;

    teams?: Team[];
    players?: Player[];
}