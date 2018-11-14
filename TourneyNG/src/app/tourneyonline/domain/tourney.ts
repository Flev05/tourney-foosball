import { Round } from './round';
import { Playoff } from './playoff';

import { Country } from './country';
import { Team } from './team';
import { Player } from './player';

import { Discipline } from './discipline';

import { TourneyType, TeamSortType } from './enumerations';
import { Final } from './final';
import { PhaseType, EliminatoryMode } from './enumerations';
import { EliminatoryLevel } from './eliminatory-level';

export interface Tourney {
    id?: number;
    
    tourneyName? : string;
    isDaily?: boolean;
    datetime? : Date;

    address? : string;
    country? : Country;

    isOnewayRound?: boolean;
    isOnewayPlayoff?: boolean;

    access?: string;
    discipline? : Discipline;

    tourneyType?: TourneyType;
    raceDuration?: number;

    phases?: PhaseType[];

    matchWinnerScores?:  number;
    matchLoserScores?:   number;
    matchBalanceScores?: number;

    pointsNeededToWin? : number;
    pointsGoldenGoalTieBreakWin? : number;
    pointsGoldenGoalTieBreakDefeat? : number;

    maxMatchesPerMeeting?: number;
    isAllMatches?: boolean;
    playersPerTeam?: number;
    
    objectives?: Final[];
    rounds?: Round[];
    playoffs?: Playoff[];

    eliminatoryLevels?: Array<EliminatoryLevel>;
    teamSortType?: TeamSortType;

    eliminatoryMode?: EliminatoryMode;

    teams?: Team[];
    players?: Player[];
}