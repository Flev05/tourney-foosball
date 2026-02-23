import { RoundVO } from './round-vo';
import { PlayoffVO } from './playoff-vo';

import { Country } from './country';
import { Team } from './team';

import { Discipline } from './discipline';

import { TourneyType, TeamSortType, EResultTool } from './enumerations';
import { Final } from './final';
import { PhaseType, EliminatoryMode } from './enumerations';
import { EliminatoryLevel } from './eliminatory-level';
import { Combobox } from './tourney-combobox';
import { ClientVO } from './client-vo';
import { Player } from './player';

export interface Tourney {
    id?: number;
    
    tourneyName?    : string;
    calendar?       : string;
    roundTabName?   : string;
    playoffTabName? : string;
    playoutTabName? : string;
    eliminatoryTabName?  : string;
    eliminatoryBTabName? : string;
    chaosEnabled?       : boolean;
    teamsChanged?       : boolean;

    followerName?   : string;
    isDaily?        : string;
    datetime?       : Date;

    wizardModeIndex?            : number;
    terminatedRounds?           : string[];
    terminatedPlayoffs?         : string[];

    selectedTeams4RoundCB?      : Combobox;
    selectedTeams4PlayoffsCB?   : Combobox;
    selectedPlayoffsCB?         : Combobox;
    selectedPlayoutsCB?         : Combobox;
    selectedRoundsNumCB?        : Combobox;

    address?                    : string;
    clientVO?                   : ClientVO;
    country?                    : Country;

    isOnewayRound?              : string;
    isOnewayPlayoff?            : string;
    isOnewayPlayout?            : string;

    access?                     : string;
    discipline?                 : Discipline;

    tourneyType?                : TourneyType;
    raceDuration?               : number;

    phases?                     : PhaseType[];
    playersPerTeam?             : number;

    eliminatoryMode?            : EliminatoryMode;
    selectedEliminatoryTeamsCB? : Combobox;
    teamSortType?               : TeamSortType;

    teamsWeightEnabled?         : string;

    objectives?                 : Final[];
    teams?                      : Team[];

    resultTool?                 : EResultTool;

    roundVO?                    : RoundVO;
    playoffVO?                  : PlayoffVO;
    playoutVO?                  : PlayoffVO;

    isEliminatoryAutoGen?       : string;
    eliminatoryLevels?          : Array<EliminatoryLevel>;
    eliminatoryBLevels?         : Array<EliminatoryLevel>;

    defenderPlayers?            : Player[];
    offenderPlayers?            : Player[];
    jollyPlayers?               : Player[];
}
 