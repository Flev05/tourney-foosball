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
import { ClientVO } from './client-vo';
import { NumberValueAccessor } from '@angular/forms/src/directives';

export interface Tourney {
    id?: number;
    
    tourneyName? : string;
    isDaily?: string;
    datetime? : Date;

    wizardModeIndex?: number;
    selectedTabIndex?: number;
    selectedResultTabIndex?: number;

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

    eliminatoryMode?: EliminatoryMode;
    selectedEliminatoryTeamsCB?: Combobox;
    teamSortType?: TeamSortType;

    teamsWeightEnabled?: string;

    objectives?: Final[];
    teams?: Team[];
    rounds?: Round[];
    playoffs?: Playoff[];
    isPlayoffAutoGen?: string;
    eliminatoryLevels?: Array<EliminatoryLevel>;
}
 