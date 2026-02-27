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

export class Tourney {
    id: number = 0;
    
    tourneyName    : string = "";
    calendar       : string = "";
    roundTabName?   : string;
    playoffTabName? : string;
    playoutTabName? : string;
    eliminatoryTabName  : string = "";
    eliminatoryBTabName : string = "";
    chaosEnabled       : boolean = false;
    teamsChanged       : boolean = false;

    followerName?   : string;
    isDaily?        : string;
    datetime       : Date = new Date();

    wizardModeIndex            : number = 0;
    terminatedRounds           : string[] = [];
    terminatedPlayoffs         : string[] = [];

    selectedTeams4RoundCB?      : Combobox;
    selectedTeams4PlayoffsCB   : Combobox = new Combobox();
    selectedPlayoffsCB         : Combobox = new Combobox();
    selectedPlayoutsCB         : Combobox = new Combobox();
    selectedRoundsNumCB       : Combobox = new Combobox();

    address                     : string = "";
    clientVO                   : ClientVO  = new ClientVO();
    country                     : Country = new Country();

    isOnewayRound?              : string;
    isOnewayPlayoff?            : string;
    isOnewayPlayout?            : string;

    access?                     : string;
    discipline                  : Discipline = new Discipline();

    tourneyType?                : TourneyType;
    raceDuration?               : number;

    phases                      : PhaseType[] = [];
    playersPerTeam?             : number;

    eliminatoryMode?            : EliminatoryMode;
    selectedEliminatoryTeamsCB : Combobox = new Combobox();
    teamSortType?               : TeamSortType;

    teamsWeightEnabled?         : string;

    objectives                 : Final[] = [];
    teams                       : Team[] = [];

    resultTool?                 : EResultTool;

    roundVO                    : RoundVO = new RoundVO();
    playoffVO                  : PlayoffVO = new PlayoffVO();
    playoutVO                  : PlayoffVO = new PlayoffVO();

    isEliminatoryAutoGen       : string = "";
    eliminatoryLevels          : Array<EliminatoryLevel> = [];
    eliminatoryBLevels         : Array<EliminatoryLevel>  = [];

    defenderPlayers            : Player[] = [];
    offenderPlayers            : Player[] = [];
    jollyPlayers               : Player[] = [];
}
 