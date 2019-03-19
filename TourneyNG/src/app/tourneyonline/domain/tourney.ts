import { Round } from './round';
import { Playoff } from './playoff';

import { Country } from './country';
import { Team } from './team';

import { Discipline } from './discipline';

import { TourneyType, TeamSortType } from './enumerations';
import { Final } from './final';
import { PhaseType, EliminatoryMode } from './enumerations';
import { EliminatoryLevel } from './eliminatory-level';
import { Combobox } from './tourney-combobox';
import { Meeting } from './meeting';
import { ClientVO } from './client-vo';

export interface Tourney {
    id?: number;
    
    tourneyName? : string;
    isDaily?: string;
    datetime? : Date;

    selectedTabIndex?: number;
    selectedTeams4PlayoffsCB?: Combobox;
    selectedPlayoffsCB?: Combobox;
    selectedRoundsNumCB?: Combobox;

    address? : string;
    clientVO? : ClientVO;
    country? : Country;

    isOnewayRound?: string;
    isOnewayPlayoff?: string;

    access?: string;
    discipline? : Discipline;

    tourneyType?: TourneyType;
    raceDuration?: number;

    phases?: PhaseType[];

    matchWinnerScores?:  number;
    matchBalanceScores?: number;

    pointsNeededToWin? : number;
    pointsGoldenGoalTieBreakWin? : number;
    pointsGoldenGoalTieBreakDefeat? : number;

    maxMatchesPerMeeting?: number;
    isAllMatches?: string;
    playersPerTeam?: number;
    
    objectives?: Final[];
    rounds?: Round[];
    playoffs?: Playoff[];

    eliminatoryLevels?: Array<EliminatoryLevel>;
    teamSortType?: TeamSortType;

    eliminatoryMode?: EliminatoryMode;
    selectedTeamsNumCombobox?: Combobox;

    teams?: Team[];
    // meetingsForDelete?: Meeting[];
}