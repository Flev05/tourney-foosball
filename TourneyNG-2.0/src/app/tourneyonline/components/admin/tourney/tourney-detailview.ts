import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { PhaseType, EliminatoryMode, AccessMode, TourneyType, TeamSortType, RoundType, Direction, EResultTool, ETeamOperation } from 'app/tourneyonline/domain/enumerations';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { FromRound } from 'app/tourneyonline/domain/from-round';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { MeetingPlayoffService } from 'app/tourneyonline/components/admin/playoff/meeting-playoff-service';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { UserService } from 'app/tourneyonline/service/user-service';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { OperatorsVO } from 'app/tourneyonline/domain/operators-vo';
import { environment } from 'environments/environment';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { OperatorDetailView } from '../operator/operator-detailview';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { PlayoffVO } from 'app/tourneyonline/domain/playoff-vo';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { RoundVO } from 'app/tourneyonline/domain/round-vo';
import { AbstractRoundVO } from 'app/tourneyonline/domain/abstract-round-vo';

const REDIRECT_ADMIN_TOURNEY   = 'admintourney';

const REDIRECT_TEAM_DV      = REDIRECT_ADMIN_TOURNEY + '/dv/team';
const REDIRECT_ADD_TEAM_DV  = REDIRECT_ADMIN_TOURNEY + '/dv/addteam';

const REDIRECT_ROUND_DV     = REDIRECT_ADMIN_TOURNEY + '/dv/round';
const REDIRECT_PLAYOFF_DV   = REDIRECT_ADMIN_TOURNEY + '/dv/playoff';

const REDIRECT_OPERATORS_PL = 'adminoperator/pl';

const ROUND_CHANGE_GEN_MODE_POPUP = 'ATTENZIONE! Se si cambia il metodo di generazione dei gironi, si perdono tutte le impostazioni preesistenti. Confermi?';
const ROUND_CHANGE_TEAMS_POPUP = 'ATTENZIONE! Se si cambia il numero complessivo di squadre del torneo, si perdono tutte le impostazioni preesistenti. Confermi?';
const MAX_TEAM_NUM = 50;

const PLAYOFF_NUM_CHANGE_POPUP = 'ATTENZIONE! Se si cambia il numero di Playoff, si perdono tutte le impostazioni preesistenti. Confermi?';
const PLYOFF_CHANGE_TEAMS_NUM_POPUP = 'ATTENZIONE! Se si cambia il numero di squadre per girone di Play Off, si perdono tutte le impostazioni preesistenti. Confermi?';
const PLYOFF_CHANGE_GEN_MODE_POPUP = 'ATTENZIONE! Se si cambia il metodo di generazione dei Play Off, si perdono tutte le impostazioni preesistenti. Confermi?';
const PLYOUT_CHANGE_GEN_MODE_POPUP = 'ATTENZIONE! Se si cambia il metodo di generazione dei Play Out, si perdono tutte le impostazioni preesistenti. Confermi?';
const ELIM_DIR_CHANGE_TOP_LEVEL_MODE_POPUP = 'ATTENZIONE! Se si cambia il numero di squadre di partenza delle eliminazioni dirette, si perdono tutte le impostazioni preesistenti. Confermi?';

const MIN_ELIMINATORY_TAB_INDEX: number = 2;

@Component({
    templateUrl: './tourney-detailview.html',
    standalone: false
})
export class TourneyDetailView extends AbstractDetailView {
    static redirect = 'admintourney/dv';

    disciplineOptions : Combobox[] = [];
    selectedDiscipline: Combobox = new Combobox();

    gender: string = "tourney";

    selectedTeam: Team = new Team();

    teamCols: TableCols[] = [];

    roundCols: TableCols[] = TourneyService.roundCols;
    roundRows: Round[] = [];
    selectedRound: Round = new Round();

    playoffCols: TableCols[] = TourneyService.playoffCols;
    playoffRows: Playoff[] = [];
    selectedPlayoff: Playoff = new Playoff();
    playoutRows: Playoff[] = [];
    selectedPlayout: Playoff = new Playoff();
    
    eliminatoryTeamsCombobox: Combobox[] = [];
    eliminatoryMode: EliminatoryMode = EliminatoryMode.A;
    eliminatoryLevelCols: TableCols[] = [];
    eliminatoryLevelRows: EliminatoryLevelVO[] = [];
    eliminatoryBLevelRows: EliminatoryLevelVO[] = [];

    atLeastTwoTeams: boolean = true;
    team4roundsCombobox: Combobox[] = [];
    roundsCombobox: Combobox[] = [];

    atLeastOneRound: boolean = true;
    playoffsCombobox: Combobox[] = [];
    playoutsCombobox: Combobox[] = [];
    teams4PlayoffsCombobox: Combobox[] = [];
    teams4PlayoutsCombobox: Combobox[] = [];
    teams4RoundCombobox: Combobox[] = [];

    meetingDaysMap: Map<number, Meeting[]> = new Map<number, Meeting[]> ();
    teamLabel: string = "";

    roundTabEnabled: boolean = false;
    playoffTabEnabled: boolean = false;
    playoutTabEnabled: boolean = false;
    eliminatoryTabEnabled: boolean = false;
    eliminatoryBTabEnabled: boolean = false;
    modeTabEnabled: boolean = false;
    teamTabEnabled: boolean = false;

    nextButtonLabel: string = "Avanti";
    nextButtonIcon: string = "pi pi-arrow-right";
    maxBoundaryTabIndex: number = 0;
    // rewind: boolean;
    isPlayoffNumChanged: boolean = false;

    isRoundAutoGen: string = "true";
    isPlayoffAutoGen: string = "false";
    isEliminatoryAutoGen: string = "true";

    followerUrl : string = environment.followerUrl;

    selectedOperator: UserVO = new UserVO();
    operators: UserVO[]  = [];
    operatorCols: TableCols[] = this.tourneyService.operatorCols;
    operatorVo: OperatorsVO = new OperatorsVO();
    resultTool : EResultTool = EResultTool.C;

    chaosEnabled: boolean = false;
    isTeamsOrderedGroupname : boolean = false;
    
    private tabChangedIndex : number = 0;

    constructor(
        protected override location: Location,
        public override tourneyService: TourneyService,
        protected countryService: CountryService,
        private userService: UserService,
        protected clientService: ClientService,
        protected playerService: PlayerService,
        protected teamService: TeamService,
        protected meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected levelService: LevelService,
        private disciplineService: DisciplineService,
        private router: Router,
        public urcService: UrcService 
    ) { 
        super(tourneyService, location);

        // this.teamService.team$.subscribe(data => {
        //     console.log("ETeamOperation=" + data) ;
        //     if( data == null ) {
        //         return;
        //     }
            
            // let cb: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
            // this.doOnRoundNumChange(cb);
            // this.resetComboBoxes();
            // if( data == ETeamOperation.INSERT ) {
            //     this.teamsChanged = true;
            // }
            // if( data == ETeamOperation.UPDATE ) {
            //     this.teamsChanged = true;
            // }
            // if( data == ETeamOperation.DELETE ) {
            //     this.teamsChanged = true;
            // }
            // this.ngOnInit();
        // });
    }

    override ngOnInit() {
        console.log("TourneyDetailView.ngOnInit()");
        this.blockDocument();

        super.ngOnInit();
        this.teamService.tourneyTeams = true;
        this.countries = this.countryService.countries;
        this.meetingRoundService.selectedTourney = this.selectedTourney;

        if (this.tourneyService.newTourney) {
            this.initNewTourney();
        } else {
            this.loadOperators();
        }
        this.chaosEnabled = this.selectedTourney.chaosEnabled;

        this.maxBoundaryTabIndex = this.getLastTabIndex();

        this.initiDisciplineCombobox();

        this.initUndefined();

        this.selectedTourney.datetime = new Date(this.selectedTourney.datetime);
        this.atLeastTwoTeams = this.selectedTourney.teams.length >= 2 ? true : false;
        this.teamCols = TeamService.cols;
        
        if (this.selectedTourney.roundVO.maxMatchesPerMeeting <= 2) {
            this.selectedTourney.roundVO.allMatchesEnabled = false;
        }
        let spin = this.selectedTourney.roundVO.maxMatchesPerMeeting;
        this.selectedTourney.roundVO.bestOfWinner = spin;

        this.teamLabel = this.selectedTourney.teams.length == 0 ? "Aggiungi squadre" : "Gestisci Squadre (" +this.selectedTourney.teams.length + ")";
        console.log(this.teamLabel);

        this.followerUrl += this.selectedTourney.followerName;
        this.checkTeamsChanged();

        this.prepareTabsGui();
    }

    private initNewTourney() {
        this.selectedTourney = new Tourney();

        this.selectedTourney.wizardModeIndex = -1;
        this.selectedTourney.datetime = new Date();
        this.selectedTourney.tourneyName = "";
        this.selectedTourney.isDaily = "true";
        this.selectedTourney.address = "";
        this.selectedTourney.tourneyType = TourneyType.Score;
        this.selectedTourney.access = AccessMode.PU;
        this.selectedTourney.objectives = [];
        this.selectedTourney.resultTool = EResultTool.C
        this.selectedTourney.chaosEnabled = false;

        this.initDefaultRoundVO();
        this.initDefaultPlayoffVO();
        this.initDefaultPlayoutVO();
        this.selectedTourney.eliminatoryLevels = [];
        this.selectedTourney.eliminatoryBLevels = [];
        this.selectedTourney.teams = [];

        this.selectedTourney.playersPerTeam = 1;
        this.selectedTourney.phases = [PhaseType.R, PhaseType.E];
        this.selectedTourney.eliminatoryMode = EliminatoryMode.A;
        this.selectedTourney.teamSortType = TeamSortType.O;
        this.selectedTourney.isOnewayRound = "true";
        this.selectedTourney.isOnewayPlayoff = "true";
        this.selectedTourney.isOnewayPlayout = "true";
        this.selectedTourney.teamsWeightEnabled = "random";
                
        this.selectedTourney.discipline = {id:0, name: "", description: ""};

        this.tourneyService.selectedTabIndex = 0;
        this.tourneyService.selectedResultTabIndex = 0;
        this.roundTabEnabled = false;
        this.playoffTabEnabled = false;
        this.playoutTabEnabled = false;
        this.teamTabEnabled = false;
        this.eliminatoryTabEnabled = false;
        this.eliminatoryBTabEnabled = false;

        this.eliminatoryLevelRows = [];
        this.eliminatoryBLevelRows = [];

        this.tourneyService.selectedTourney = this.selectedTourney;    
        // this.teamService.isTeamsChanged = false;
        this.selectedTourney.wizardModeIndex = 0;
        this.selectedTourney.isEliminatoryAutoGen = "true";
        this.selectedTourney.followerName = "";
        this.resetComboBoxes();
    }

    private initDefaultRoundVO() {
        this.selectedTourney.roundVO = new RoundVO();
        this.selectedTourney.roundVO.direction = Direction.OneWay;
        this.selectedTourney.roundVO.matchBalanceScores = 1;
        this.selectedTourney.roundVO.matchWinnerScores = 3;
        this.selectedTourney.roundVO.pointsNeededToWin = 9;
        this.selectedTourney.roundVO.pointsGoldenGoalTieBreakWin = 2;
        this.selectedTourney.roundVO.pointsGoldenGoalTieBreakDefeat = 1;
        this.selectedTourney.roundVO.maxMatchesPerMeeting = 1;
        this.selectedTourney.roundVO.isAllMatches = "true";
        this.selectedTourney.roundVO.isRoundAutoGen = "true";
        this.selectedTourney.roundVO.allMatchesEnabled = true;
        this.selectedTourney.roundVO.rounds = [];
    }

    private initDefaultPlayoffVO() {
        this.selectedTourney.playoffVO = new PlayoffVO();
        this.selectedTourney.playoffVO.direction = Direction.OneWay;
        this.selectedTourney.playoffVO.matchBalanceScores = 1;
        this.selectedTourney.playoffVO.matchWinnerScores = 3;
        this.selectedTourney.playoffVO.pointsNeededToWin = 9;
        this.selectedTourney.playoffVO.pointsGoldenGoalTieBreakWin = 2;
        this.selectedTourney.playoffVO.pointsGoldenGoalTieBreakDefeat = 1;
        this.selectedTourney.playoffVO.maxMatchesPerMeeting = 1;
        this.selectedTourney.playoffVO.isAllMatches = "true";
        this.selectedTourney.playoffVO.isPlayoffAutoGen = "true";
        this.selectedTourney.playoffVO.allMatchesEnabled = true;
        this.selectedTourney.playoffVO.playoffs = [];
        this.selectedTourney.isOnewayPlayoff = "true";
    }

    private initDefaultPlayoutVO() {
        this.selectedTourney.playoutVO = new PlayoffVO;
        this.selectedTourney.playoutVO.direction = Direction.OneWay;
        this.selectedTourney.playoutVO.matchBalanceScores = 1;
        this.selectedTourney.playoutVO.matchWinnerScores = 3;
        this.selectedTourney.playoutVO. pointsNeededToWin = 9;
        this.selectedTourney.playoutVO.pointsGoldenGoalTieBreakWin = 2;
        this.selectedTourney.playoutVO.pointsGoldenGoalTieBreakDefeat = 1;
        this.selectedTourney.playoutVO.maxMatchesPerMeeting = 1;
        this.selectedTourney.playoutVO.isAllMatches = "true";
        this.selectedTourney.playoutVO.isPlayoffAutoGen = "true";
        this.selectedTourney.playoutVO.allMatchesEnabled = true;
        this.selectedTourney.playoutVO.playoffs = [];
        this.selectedTourney.isOnewayPlayout = "true";
    }

    private loadOperators() {
        let selectedClientId = this.clientService.selectedClient.id;
        let op = new OperatorsVO();
        op.clientId = selectedClientId;
        op.tourneyId = this.selectedTourney.id;
        const subscriber = this.userService.loadOperatorsBy(op, this.loadUsersErrorHandler('loadAllOperators()'));
        subscriber.subscribe(cs => this.onLoadNext(cs), e => this.onError(e) );
    }

    private onLoadNext(op: OperatorsVO): void {
        this.operatorVo = op;
        this.operators = op.selectedOperators;
        this.tourneyService.operatorVo = this.operatorVo;
    }
    
    private loadUsersErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {      
            console.log(`${operation} failed`);
            console.error(error);     
            return of(result as T);
        };
    }

    private blockDocument() {
        this.blockedDocument = false;
    }

    private checkTeamsChanged() {
        if( this.tourneyService.selectedTourney.teamsChanged ) {
            let cb: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
            this.doOnRoundNumChange(cb);
            this.tourneyService.selectedTourney.teamsChanged = false;
            this.turnOnWizardMode(2)
        }        
        // if (this.teamService.isTeamsChanged) {
        //     this.teamService.isTeamsChanged = false;
        //     this.turnOnWizardMode(2);
        //     this.resetComboBoxes();
        //     this.makeButtonLabel();
        // }
    }

    private turnOnWizardMode(tabIndex : number) {
        this.selectedTourney.wizardModeIndex = tabIndex;
        this.makeButtonLabel();
    }

    public isInWizardMode() {
        return this.selectedTourney.wizardModeIndex >= 0;
    }

    /**
     * Workaround to inizialize the new attributes, during the development phase, for already existing tourney
     */
    private initUndefined() {
        if (this.selectedTourney.wizardModeIndex == undefined) {
            if (this.tourneyService.selectedTabIndex <= this.maxBoundaryTabIndex) {
                this.selectedTourney.wizardModeIndex = -1;
            } else {
                this.selectedTourney.wizardModeIndex = 0;
            }
        }
    }

    private initiDisciplineCombobox() {
        this.selectedDiscipline = { label: this.selectedTourney.discipline.name, value: this.selectedTourney.discipline.id };
        this.disciplineOptions = this.disciplineService.disciplineOptions;
    }

    private resetNoRoundComboBoxes() {
        let cb: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
        this.selectedTourney.selectedTeams4RoundCB = cb;
        this.selectedTourney.selectedTeams4PlayoffsCB = cb;
        this.selectedTourney.selectedPlayoffsCB = cb;
        this.selectedTourney.selectedEliminatoryTeamsCB = cb;
    }
    private resetComboBoxes() {
        this.resetNoRoundComboBoxes() ;
        let cb: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
        this.selectedTourney.selectedRoundsNumCB = cb;
    }

    private prepareTabsGui( ): void {
        console.log("Entering prepareTabsGui()");
        this.tabChangedIndex = 0;
        this.enableTabsFlags();

        if( this.isRoundTabEnabled() ) {
            this.prepareRoundsCombobox();
        }

        if( this.isPlayoffTabEnabled() ) {
            this.preparePlayoffsCombobox();
            if( this.isPlayoutTabEnabled() ) {
                this.preparePlayoutRows();
            }
        }
  
        if( this.isEliminatoryTabEnabled() ) {
            this.levelService.selectedTourney = this.selectedTourney;
            this.isEliminatoryAutoGen  = this.selectedTourney.isEliminatoryAutoGen == undefined ? "true" : "" + this.selectedTourney.isEliminatoryAutoGen;
            this.levelService.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
            const tNo = this.selectedTourney.eliminatoryLevels.length == 0 ? 2 : this.selectedTourney.eliminatoryLevels[0].topLevelTeamNo;
            this.levelService.eliminatoryLevelRows = this.levelService.prepareEliminatoryLevelsGui(this.selectedTourney.eliminatoryLevels, tNo);
            this.prepareEliminatoryCombobox();
            this.eliminatoryLevelRows = this.levelService.eliminatoryLevelRows;

            if( this.isEliminatoryBTabEnabled() ) {
                this.levelService.eliminatoryBLevels = this.selectedTourney.eliminatoryBLevels;
                const tNo = this.selectedTourney.eliminatoryBLevels.length == 0 ? 2 : this.selectedTourney.eliminatoryBLevels[0].topLevelTeamNo;
                this.eliminatoryBLevelRows = this.levelService.prepareEliminatoryLevelsGui(this.selectedTourney.eliminatoryBLevels, tNo);
                this.levelService.eliminatoryBLevelRows = this.eliminatoryBLevelRows;
            }
            if(this.selectedTourney.eliminatoryTabName=="" || this.selectedTourney.eliminatoryTabName==null) {
                this.selectedTourney.eliminatoryTabName="Eliminazioni Dirette";                
            }
            if(this.selectedTourney.eliminatoryBTabName=="" || this.selectedTourney.eliminatoryBTabName==null) {
                this.selectedTourney.eliminatoryBTabName="Eliminazioni Dirette B";
            }
        }
    }

    private enableTabsFlags() {
        this.modeTabEnabled = this.isModalityTabEnabled();
        this.teamTabEnabled = this.isTeamTabEnabled();
        this.roundTabEnabled = this.isRoundTabEnabled();
        this.playoffTabEnabled = this.isPlayoffTabEnabled();
        this.playoutTabEnabled = this.isPlayoutTabEnabled();
        this.eliminatoryTabEnabled = this.isEliminatoryTabEnabled();
        this.eliminatoryBTabEnabled = this.isEliminatoryBTabEnabled();
        this.makeButtonLabel();
    }

    private isModalityTabEnabled(): boolean {
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.tourneyService.selectedTabIndex <= this.selectedTourney.wizardModeIndex ? true : false;
    }

    private isTeamTabEnabled(): boolean {
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.tourneyService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isRoundTabEnabled(): boolean {
        if( !this.containsRound() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.tourneyService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isPlayoffTabEnabled(): boolean {
        if( !this.containsPlayoff() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.tourneyService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isPlayoutTabEnabled(): boolean {
        if( !this.containsPlayout() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.tourneyService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isEliminatoryTabEnabled(): boolean {
        if( !this.containsEliminatory() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.tourneyService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }
    
    private isEliminatoryBTabEnabled(): boolean {
        if( !this.containsEliminatoryB() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.tourneyService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private makeButtonLabel(): void {

        if( !this.isInWizardMode()  ) {
            this.nextButtonLabel = "Salva";
            this.nextButtonIcon = "pi pi-save";
            return;
        }

        if (this.tourneyService.selectedTabIndex >= this.maxBoundaryTabIndex) {
            this.nextButtonLabel = "Fine";
            this.nextButtonIcon = "pi pi-save";
        }
        else {
            this.nextButtonLabel = "Avanti";
            this.nextButtonIcon = "pi pi-arrow-right";
        }
    }

    private getLastTabIndex() {
        let lastTabIndex = 3;
        if (this.containsRound()) {
            if (this.containsPlayoff()) {
                lastTabIndex += 1;
                if (this.containsPlayout()) {
                    lastTabIndex += 1;
                }
                if (this.containsEliminatory()) {
                    lastTabIndex += 1;
                }
                if (this.containsEliminatory()) {
                    lastTabIndex += 1;
                }
            } else if (this.containsEliminatory()) {
                lastTabIndex += 1;
                if (this.containsEliminatory()) {
                    lastTabIndex += 1;
                }
            }
        }

        return lastTabIndex + 1;
    }

    private prepareRoundsCombobox(): void {
        console.log("Entering prepareRoundsCombobox()");

        this.team4roundsCombobox = [];
        this.isRoundAutoGen  = this.selectedTourney.roundVO.isRoundAutoGen;

        let N = this.selectedTourney.teams.length;
        for (let t=2; t<=N; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.team4roundsCombobox.push(cb);
        } 
        
        this.roundsCombobox = [];
        let cb: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
        this.roundsCombobox.push(cb);

        let R: number = Math.floor(this.selectedTourney.teams.length/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.roundsCombobox.push(cb);
        } 

        this.teams4RoundCombobox = [];
        this.teams4RoundCombobox.push(cb);
        for (let t=1; t<=N; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.teams4RoundCombobox.push(cb);
        } 

        this.teams4RoundCombobox = [];
        this.teams4RoundCombobox.push(cb);
        for (let t=2; t<=MAX_TEAM_NUM; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.teams4RoundCombobox.push(cb);
        } 

        this.roundRows = this.selectedTourney.roundVO.rounds;
        this.atLeastOneRound = this.selectedTourney.roundVO.rounds.length >= 1 ? true : false;
    }

    private preparePlayoffsCombobox(): void {
        console.log("Entering preparePlayoffsCombobox()");

        this.isPlayoffAutoGen  = this.selectedTourney.playoffVO.isPlayoffAutoGen;

        let N = this.selectedTourney.teams.length;
        for(let r of this.selectedTourney.roundVO.rounds) {
            if( r.teamNames.length < N ) {
                N = r.teamNames.length;
            }
        }

        let maxTeamsPerPlayoff = this.getMaxTeamsPerPlayoff();
        this.teams4PlayoffsCombobox = [];
        for (let t=2; t<=maxTeamsPerPlayoff; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.teams4PlayoffsCombobox.push(cb);
        } 

        this.playoffsCombobox = [];
        let cb: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
        this.playoffsCombobox.push(cb);

        let R: number = Math.floor(N * this.selectedTourney.roundVO.rounds.length / 2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.playoffsCombobox.push(cb);
        } 

        this.playoffRows = this.selectedTourney.playoffVO.playoffs;
        for(let p of this.playoffRows) {
            p.playoffName = p.round.name;
        }
    }

    private preparePlayoutRows(): void {
        console.log("Entering preparePlayoutRows()");
        this.playoutRows = this.selectedTourney.playoutVO.playoffs;
        for(let p of this.playoutRows) {
            p.playoffName = p.round.name;
        }
    }

    private prepareEliminatoryCombobox() {
        console.log("Entering prepareEliminatoryCombobox()");

        let teamNo = this.selectedTourney.teams.length;
        this.eliminatoryTeamsCombobox = this.tourneyService.prepareEliminatoriesComboBoxes(teamNo);
        
        this.eliminatoryLevelCols = this.levelService.eliminatoryLevelCols;
        if(this.selectedTourney.selectedEliminatoryTeamsCB.value == null ) {
            this.selectedTourney.selectedEliminatoryTeamsCB.value = 0;
        }
        if(this.selectedTourney.selectedEliminatoryTeamsCB.value >= 0 ) {
            this.eliminatoryLevelRows = this.levelService.eliminatoryLevelRows;
        }
    }

    private prepareEliminatoryB() {
        console.log("Entering prepareEliminatoryB()");
        this.levelService.eliminatoryBLevels = [];
        this.eliminatoryBLevelRows = this.levelService.eliminatoryBLevelRows;
        if(this.selectedTourney.eliminatoryBLevels==undefined) {
            this.selectedTourney.eliminatoryBLevels = [];
        }
    }
    
    updateOperator(uvo: UserVO) {
        console.log("Entering updateOperator(" + uvo.username + ")");
        let dvo  = this.operators.find( t => t.id == uvo.id );
        if( dvo ){
            let index: number = this.operators.indexOf(dvo);
            if(index == -1) {
                return;
            }
            this.selectedOperator = dvo;
            this.userService.selectedUser = this.selectedOperator;
            this.router.navigate([OperatorDetailView.redirect]);
        }    
    }

    deleteTeam(team: Team) {
        console.log("deleteTeam(): " + team.teamName);
        let popup = 'Sicuro di voler rimuovere il TEAM: ' + team.teamName + " a livello di torneo?";
        if(confirm(popup)) {
            this.removeTeamFromTourney(team);
            let tvo: TourneyVO = this.prepareTourneyVO();
            const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
             if( !this.onSaveTourneyError ) {
                subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => {});
            } 
        }
    }

    private removeTeamFromTourney(team : Team): any {
        let index = this.selectedTourney.teams.findIndex( t => t.teamName === team.teamName );
        if( index !== -1 ) {
            this.selectedTourney.teams.splice(index, 1); // Remove the element at index from the teams
        }
    }

    deleteOperator(uvo: UserVO) {
        console.log("Entering deleteOperator( " + uvo.username + "):");
        let popup = "Sicuro di voler rimuovere l'operatore: " + uvo.username + "?";
        if(confirm(popup)) {
            let dvo = this.operators.find( t => t.id == uvo.id );
            if( dvo ){
                let index: number = this.operators.indexOf(dvo);
                if(index > -1) {
                    this.operators.splice(index, 1);
                }
                this.selectedOperator = dvo;
                this.userService.selectedUser = this.selectedOperator;
                let op : OperatorsVO = this.operatorVo;
                op.selectedOperators = [...this.operators];
                const subscriber = this.urcService.mergeOperators(op, this.loadUsersErrorHandler('mergeOperators()'));
                subscriber.subscribe(cs => this.next(cs), e => this.onError(e) );
            }
        }
    }
 
    onDeleteNext(cs: UserVO): void {
        this.loadOperators();
    }

    onChangeTab(e : any) {
        let index=e.index;
        this.tourneyService.selectedTabIndex = index; 
        this.enableTabsFlags();
        if( this.tourneyService.selectedTourney.teamsChanged ) {
            let cb: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
            this.doOnRoundNumChange(cb);
            this.tourneyService.selectedTourney.teamsChanged = false;
        }
    }

    addTeams() {
        this.router.navigate([REDIRECT_ADD_TEAM_DV]);
    }
 
    manageOperator() {
        this.userService.newUser = false;
        this.tourneyService.operatorVo = this.operatorVo;
        this.router.navigate([REDIRECT_OPERATORS_PL]);
    }

    onTeamRowSelect(event : any ) {
        console.log(event.data);
        this.teamService.selectedTeam = {...this.selectedTeam};
        this.playerService.readOnly = false;
        this.router.navigate([REDIRECT_TEAM_DV]);
    }
     
    onRoundRowSelect(event : any) {
        console.log(event.data);
        this.tourneyService.selectedRound = this.selectedRound;
        this.meetingRoundService.selectedRound = this.selectedRound;
        this.meetingRoundService.isRoundAutoGen = this.isRoundAutoGen;
        this.teamService.isRoundAutoGen = this.isRoundAutoGen;
        this.router.navigate([REDIRECT_ROUND_DV]);
    }

    doRoundDelete(round: Round) {
        this.tourneyService.doRoundDelete(round, this.saveTourneyErrorHandler('Delete Round operation'));
    }
 
    doPlayoffDelete(playoff: Playoff) {
        this.tourneyService.doPlayoffDelete(playoff, this.saveTourneyErrorHandler('Delete Playoff operation'));
    }
    
    public onEliminatoryTeamNumChange(event : any) {
        console.log(event);
        if(!confirm(ELIM_DIR_CHANGE_TOP_LEVEL_MODE_POPUP)) {
            return;
        }
        this.blockDocument();
        const teamsNo = this.selectedTourney.selectedEliminatoryTeamsCB.value;
        if( teamsNo ) { 
            this.doEliminatoryTeamNumChange(teamsNo);
            if( this.containsEliminatoryB() ) {
                this.doEliminatoryBTeamNumChange(teamsNo);
            }
        }
    }

    private doEliminatoryTeamNumChange(teamsNo: number) {
        this.isEliminatoryAutoGen  = this.selectedTourney.isEliminatoryAutoGen == undefined ? "true" : "" + this.selectedTourney.isEliminatoryAutoGen;
        this.levelService.isAutomatic = this.isEliminatoryAutoGen == "true" ? true : false;

        this.meetingService.selectedTourney = this.selectedTourney;
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;

        this.eliminatoryLevelRows = this.levelService.onEliminatoryTeamNumChange(teamsNo);
        let mdbs: MeetingDb[] = [];
        for (let el of this.levelService.eliminatoryLevels) {
            /* we have already created it in the levelService.prepareEliminationTree() method
            el.abstractRoundVO = {
                direction:Direction.OneWay
                ,matchBalanceScores:1
                ,matchWinnerScores:3
                ,pointsNeededToWin:9
                ,pointsGoldenGoalTieBreakWin:2
                ,pointsGoldenGoalTieBreakDefeat:1
                ,maxMatchesPerMeeting : 1
                ,isAllMatches : "true"
                ,allMatchesEnabled: true 
            }; */

            for (let e of el.eliminatories) {
                for (let m of e.round.onewayMeetings) {
                    let mdb = this.meetingService.prepareEliminatoryMeetingDb(m, this.selectedTourney.id, e.id);
                    mdbs.push(mdb);
                }
                for (let m of e.round.roundtripMeetings) {
                    let mdb = this.meetingService.prepareEliminatoryMeetingDb(m, this.selectedTourney.id, e.id);
                    mdbs.push(mdb);
                }
            }
        }
        let tvo: TourneyVO = this.prepareTourneyVOForEliminatory(false);
        tvo.mdbs = mdbs;
        const subscriber = this.tourneyService.updateTourneyAndEliminatories(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.unBlockDocument());
        this.turnOnWizardMode(this.maxBoundaryTabIndex+1);
    }

    private doEliminatoryBTeamNumChange(teamsNo: number) {
        this.eliminatoryBLevelRows = this.levelService.onEliminatoryBTeamNumChange(teamsNo);
        let mdbs: MeetingDb[] = [];
        for (let el of this.levelService.eliminatoryBLevels) {
            el.abstractRoundVO = new AbstractRoundVO();
            el.abstractRoundVO.direction = Direction.OneWay;
            el.abstractRoundVO.matchBalanceScores = 1;
            el.abstractRoundVO.matchWinnerScores = 3;
            el.abstractRoundVO.pointsNeededToWin = 9;
            el.abstractRoundVO.pointsGoldenGoalTieBreakWin = 2;
            el.abstractRoundVO.pointsGoldenGoalTieBreakDefeat = 1;
            el.abstractRoundVO.maxMatchesPerMeeting = 1;
            el.abstractRoundVO.isAllMatches = "true";
            el.abstractRoundVO.allMatchesEnabled = true;
            for (let e of el.eliminatories) {
                for (let m of e.round.onewayMeetings) {
                    let mdb = this.meetingService.prepareEliminatoryBMeetingDb(m, this.selectedTourney.id, e.id);
                    mdbs.push(mdb);
                }
                for (let m of e.round.roundtripMeetings) {
                    let mdb = this.meetingService.prepareEliminatoryBMeetingDb(m, this.selectedTourney.id, e.id);
                    mdbs.push(mdb);
                }
            }
        }
        let tvo: TourneyVO = this.prepareTourneyVOForEliminatoryB(false);
        tvo.mdbs = mdbs;
        const subscriber = this.tourneyService.updateTourneyAndEliminatoriesB(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.unBlockDocument());
        this.turnOnWizardMode(this.maxBoundaryTabIndex+1);
    }
    
    onEliminatoryAutoGenClick() {
        console.log("Entering onEliminatoryAutoGenClick()");
        this.selectedTourney.isEliminatoryAutoGen = this.isEliminatoryAutoGen;
    }

    onEliminatoryManualGenClick() {
        console.log("Entering onEliminatoryManualGenClick()");
        this.selectedTourney.isEliminatoryAutoGen = this.isEliminatoryAutoGen;
    }

    onDisciplineChange(cb: Combobox) {
        console.log(cb);
        this.selectedTourney.discipline.name = cb.label;
        this.selectedTourney.discipline.id = cb.value;
    }

    /**
     * Processes the change on the number of rounds for the Rounding phase
     * @param cb the selected item in the combo box
     */
    onRoundNumChange(cb: Combobox) {
        console.log("Entering onRoundNumChange(" + cb + ")");
        if(!confirm(ROUND_CHANGE_GEN_MODE_POPUP)) {
            return;
        } 

        this.blockDocument();

        this.doOnRoundNumChange(cb);
    }

    private doOnRoundNumChange(cb: Combobox) {
        this.selectedTourney.selectedRoundsNumCB = cb;
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

        this.tabChangedIndex = 3;
        if (this.containsPlayoff()) {
            this.tabChangedIndex = 4;
            this.playoffsCombobox = [];
            let firstRow: Combobox = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
            this.playoffsCombobox.push(firstRow);

            let P = Math.floor(this.selectedTourney.teams.length / 2);
            for (let r = 1; r <= P; r++) {
                let cb: Combobox = { label: "" + r, value: r };
                this.playoffsCombobox.push(cb);
            }
        }

        this.meetingRoundService.cleanRoundMeetings(true);
        this.roundRows = [];
        // this.meetingRoundService.cleanPlayoffMeetings(true);
        this.playoffRows = [];
        // this.meetingRoundService.cleanEliminatoryMeetings(true);
        this.eliminatoryLevelRows = [];
        this.eliminatoryBLevelRows = [];
        let tvo: TourneyVO = this.meetingRoundService.prepareTourneyVOForRound(true);
        this.tourneyService.updateTourneyDeleteAllMeetings(tvo);

        this.resetNoRoundComboBoxes();

        if (this.isRoundAutoGen == 'true') {
            this.onRoundTeamsChangeNoConfirm(cb);
        }
    }

    onRoundTeamsChangeNoConfirm(cb: Combobox) {
        let R: number = this.selectedTourney.selectedRoundsNumCB.value == null ? 0 : this.selectedTourney.selectedRoundsNumCB.value;
        let T: number = this.selectedTourney.teams.length;
        
        let randomTeams = this.prepareTourneyTeams(T, R);

        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

        this.prepareTourneyRounds(R, randomTeams);

        for( let r of this.selectedTourney.roundVO.rounds ) {
            this.meetingRoundService.createRoundMeeting(this.selectedTourney, r);
            r.teamNo = "" + r.teamNames.length;
        }

        this.roundRows = this.selectedTourney.roundVO.rounds;

        cb = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
        this.selectedTourney.selectedPlayoffsCB       = cb;
        
        this.selectedTourney.selectedTeams4PlayoffsCB = cb;

        let eliminatoryTeamNo: number = this.selectedTourney.teams.length;
        this.eliminatoryTeamsCombobox = this.tourneyService.prepareEliminatoriesComboBoxes(eliminatoryTeamNo);

        this.selectedTourney.selectedEliminatoryTeamsCB = cb;
        
        let tvo = this.prepareTourneyVO();
        this.meetingRoundService.saveRoundMeetings(tvo
            ,(m,t) => this.saveTourneyErrorHandler(m,t)
            ,(m,t) => this.subscribeErrorHandler(m,t)
            ,() => this.unBlockDocument()
        );
        this.turnOnWizardMode(3);
        this.tabChangedIndex = 3;
    }

    /**
     * Processes the change on the number of teams for each round
     * @param cb the selected item in the combo box
     */
     onRoundTeamsChange(cb: Combobox) {
        console.log('Entering onRoundTeamsChange(' + cb +")");
        if(!confirm(ROUND_CHANGE_TEAMS_POPUP)) {
            return;
        } 
        this.onRoundTeamsChangeNoConfirm(cb);
    }

    onRoundAutoGenClick( ) {
        console.log("Entering onRoundAutoGenClick()");
        let autoGen = this.selectedTourney.roundVO.isRoundAutoGen;
        if(!confirm(ROUND_CHANGE_GEN_MODE_POPUP)) {
            this.isRoundAutoGen = autoGen;
            return;
        }     
        this.selectedTourney.roundVO.isRoundAutoGen = this.isRoundAutoGen;
        this.resetComboBoxes();
    }
    onRoundManualGenClick( ) {
        console.log("Entering onRoundManualGenClick()");
        let autoGen = this.selectedTourney.roundVO.isRoundAutoGen;
        if(!confirm(ROUND_CHANGE_GEN_MODE_POPUP)) {
            this.isRoundAutoGen = autoGen;
            return;
        } 
        this.selectedTourney.roundVO.isRoundAutoGen = this.isRoundAutoGen;
    }

    /**
     * Prepares the rounds of the selected tourney in function of the received parameters.
     * 
     * The received team list is spawn on the number of received rounds so each round contains
     * at most the same number of teams.
     */
    private prepareTourneyRounds(roundCount: number, randomTeams: string[]) {
        if( roundCount <= 0)  {
            return;
        }
        this.selectedTourney.roundVO.rounds = [];
        for (let i = 0; i < roundCount; i++) {
            let r: Round = this.prepareEmptyRound(i);
            this.selectedTourney.roundVO.rounds.push(r);
        }
                
        if( this.selectedTourney.teamsWeightEnabled == "group" && roundCount > 0 ) {
            let teams: Team[] = this.selectedTourney.teams;
            const matrix : Team[][] = this.distributeTeams(teams, roundCount);
            for( let r=0; r<matrix.length; r++ ) {
                let row: Team[] = matrix[r];
                for( let c=0; c<row.length; c++ ) {
                    const t : Team = matrix[r][c];
                    let round = this.selectedTourney.roundVO.rounds[r];
                    round.teamNames.push(t.teamName);
                }
            }
        } else {
            for( let i=0; i<randomTeams.length; i++ ) {            
                let rt = randomTeams[i];
                let rno = i % roundCount;
                let round = this.selectedTourney.roundVO.rounds[rno];
                round.teamNames.push(rt);
            }
        }

        for (let r of this.selectedTourney.roundVO.rounds) {
            this.initClassification(r);
        }
    }

    /**
     * Prepares the list of tourney teams in function of team weight check box.
     * If enabled, the list order is rilevant and the first team is the stronger while
     * the last is the weaker.
     * If not enabled, all the teams have the same weight and the method will compute 
     * a new random list of the original list of teams.
     * 
     * @param T the number of teams to prepare
     * @param R the number of rounds to prepare
     * @returns the list of team list
     */
    private prepareTourneyTeams(T : number, R : number) : string[]  {
        let randomTeams: string[] = [];
        if( this.selectedTourney.teamsWeightEnabled == "topseed" ) {
            return this.selectedTourney.teams.map(x=>x.teamName);         
        } 
        if( this.selectedTourney.teamsWeightEnabled == "random" ) {
            for(let t=0; t<T; t++) {
                let team: Team = this.selectedTourney.teams[t];
                randomTeams.push(team.teamName);
            }
            randomTeams.sort((t1, t2) =>{
                let rand = Math.random();
                if(rand < 0.5) {
                    return 1;
                }
                return -1;
            });
            return randomTeams;
        } 

        return this.selectedTourney.teams.map(x=>x.teamName);         
    }
 
    private distributeTeams(teams: Team[], n: number): Team[][] {
        // 1. Initialize N empty groups
        const groups: Team[][] = Array.from({ length: n }, () => []);

        // 2. Group teams by the 'asd' property
        const groupedByAsd: Record<string, Team[]> = {};
        teams.forEach(team => {
            const key = team.asd || 'undefined';
            if (!groupedByAsd[key]) {
                groupedByAsd[key] = [];
            } 
            groupedByAsd[key].push(team);
        });

        // 3. Shuffle each 'asd' group and flatten into a "dealt" list
        // This ensures that same 'asd' values are spread out
        let roundRobinIndex = 0;        
        for (const key in groupedByAsd) {
            const currentAsdGroup = groupedByAsd[key];           
            // Randomize the order within this specific ASD category
            const shuffled = currentAsdGroup.sort(() => Math.random() - 0.5);
            // 4. Distribute into buckets round-robin
            shuffled.forEach(team => {
                groups[roundRobinIndex].push(team);
                roundRobinIndex = (roundRobinIndex + 1) % n;
            });
        }
        return groups;
    }
    
    private prepareEmptyRound(i: number): Round {
        let r: Round = new Round();
        r.id =  this.tourneyService.getSequenceNumber();
        r.onewayCurrentDay =  1;
        r.roundtripCurrentDay =  1;
        r.name =  "Girone." + String.fromCharCode(65 + i);
        r.type =  RoundType.R;
        r.direction =  Direction.OneWay;
        r.pageSize =  1;
        r.daysNo =  1;
        r.teamNames =  [];
        r.onewayMeetings =  [];
        r.roundtripMeetings =  [];
        r.classification =  [];
        return r;
    }

    private getMaxTeamsPerPlayoff(): number {
        if( this.selectedTourney.selectedPlayoffsCB.value == 0 || this.selectedTourney.selectedPlayoffsCB.value == null ) {
            return 0;
        }
        let allRoundTeams = 0;
        for (let r of this.selectedTourney.roundVO.rounds) {
            allRoundTeams += r.teamNames.length;
        }
        let maxTeamsPerPlayoff = allRoundTeams / this.selectedTourney.selectedPlayoffsCB.value;
        return Math.floor(maxTeamsPerPlayoff);
    }
 
    onPlayoffNumChange(cb : any) {
        console.log("Entering onPlayoffNumChange()");
        console.log(cb);
        if(!confirm(PLAYOFF_NUM_CHANGE_POPUP)) {
            return;
        } 
        this.tabChangedIndex = 4;
        this.preparePlayoffsCombobox();
        this.selectedTourney.selectedTeams4PlayoffsCB = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
        this.playoffRows = [];
        this.playoutRows = [];
    }
    
    /**
     * Processes the change on the number of teams for each playoff round
     * @param cb the selected item in the combo box
     */
    onPlayoffTeamsChange(cb: Combobox) {
        console.log(cb);
        if(!this.isPlayoffNumChanged && this.selectedTourney.selectedTeams4PlayoffsCB != this.tourneyService.FIRST_COMBO_ITEM) {
            if(!confirm(PLYOFF_CHANGE_TEAMS_NUM_POPUP)) {
                return;
            } 
        }
        this.tabChangedIndex = 4;
        this.isPlayoffNumChanged = false;
        this.selectedTourney.selectedTeams4PlayoffsCB = cb;
        this.eliminatoryLevelRows = [];
        this.eliminatoryBLevelRows = [];

        this.cleanPlayoffMeetings(true );
        this.meetingRoundService.cleanPlayoffMeetings(true);

        let automatic: boolean = this.selectedTourney.playoffVO.isPlayoffAutoGen == "true" ? true : false;
        if(this.selectedTourney.selectedPlayoffsCB.value && this.selectedTourney.selectedTeams4PlayoffsCB.value) {
            let selectedTeams = this.selectedTourney.selectedPlayoffsCB.value * this.selectedTourney.selectedTeams4PlayoffsCB.value;
            if(automatic) {
                this.prepareAutomaticPlayoffRules(selectedTeams);
            } else {
                this.prepareManualPlayoffRules(selectedTeams);
            }
            if( this.containsPlayout() ) {
                this.cleanPlayoutMeetings(true );
                this.preparePlayoutRules(selectedTeams);
            }
    
            this.savePlayoffGeneratedMeetings();
    
            this.eliminatoryTeamsCombobox = this.tourneyService.prepareEliminatoriesComboBoxes(selectedTeams);
            this.selectedTourney.selectedEliminatoryTeamsCB = { label: "" + this.tourneyService.FIRST_COMBO_ITEM.label, value: this.tourneyService.FIRST_COMBO_ITEM.value };
            this.updateTourney();
        }
    }

    private savePlayoffGeneratedMeetings() {
        this.meetingService.abstractRoundVO = this.selectedTourney.playoffVO;
        this.meetingPlayoffService.abstractRoundVO = this.selectedTourney.playoffVO;
        for (let p of this.selectedTourney.playoffVO.playoffs) {
            this.meetingPlayoffService.createPlayoffMeeting(this.selectedTourney, p);
        }
        this.updatePlayoffMeetings( () => this.savePlayoutGeneratedMeetings() );
        this.turnOnWizardMode(4);
    }

    private savePlayoutGeneratedMeetings() {
        if( !this.containsPlayout() ) {
            return;
        }

        this.meetingService.abstractRoundVO = this.selectedTourney.playoutVO;
        this.meetingPlayoffService.abstractRoundVO = this.selectedTourney.playoutVO;
        for (let p of this.selectedTourney.playoutVO.playoffs) {
            this.meetingPlayoffService.createPlayoffMeeting(this.selectedTourney, p);
        }
        this.updatePlayoutMeetings();
        this.turnOnWizardMode(5);
    }

    private updateTourney(): void {
        console.log("Entering updateTourney()");

        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => {});
    }
    
    /**
     * Organizes the playoffs in the automatic mode to create the rules to pass from the rounds towards the playoffs, 
     * sorting the final position of the rounds by bands: 
     * the first better positions, the second better positions, and so on. 
     * 
     * So we have, for each playoff, a list of playoff rules with two indexes:
     * - the position of the band and
     * - the relative position inside the band.
     */
    public prepareAutomaticPlayoffRules( selectedTeams: number) : number {
        console.log("Entering prepareAutomaticPlayoffRules()");
        if( ! this.selectedTourney.selectedPlayoffsCB.value ) {
            return 0;
        }
        let po = this.selectedTourney.playoffVO;
        po.playoffs = [];
        for(let i=0; i<this.selectedTourney.selectedPlayoffsCB.value; i++)  {
            let p: Playoff = this.createPlayoff(i);
            po.playoffs.push(p);    
        }
        
        let sortedTeamList: Array<PlayoffRule> = new Array<PlayoffRule>();
        let teamCounter: number = 0;
        let maxTeamsPerPlayoff = this.getMaxTeamsPerPlayoff();
        let bandPos = 0;
        for( let bp=0; bp<maxTeamsPerPlayoff; bp++ ) {
            bandPos = bp+1;
            for(let r=0; r<this.selectedTourney.roundVO.rounds.length; r++ ) {
                let pos = r+1;
                let posCB:    Combobox = { label: "" + pos + "° delle ", value: pos };
                let relPosCB: Combobox = { label: "" + bandPos + "°", value: bandPos };

                let fromRound: FromRound = { id: this.tourneyService.getSequenceNumber()
                    , position: posCB
                    , round: relPosCB
                    , bandPosition: relPosCB.value == null ? 0 : relPosCB.value
                    , isDummy: false
                };
                
                let prefix = this.selectedTourney.roundVO.rounds.length == 1 ? "" : fromRound.position.value + "° Delle Migliori ";
                const ruleName = prefix + fromRound.bandPosition + "°";
                let pr: PlayoffRule = { id: this.tourneyService.getSequenceNumber(), fromRound: fromRound, ruleName: ruleName, isDummy: false};

                sortedTeamList.push(pr);
                teamCounter++;
                if( teamCounter >= selectedTeams ) {
                    break;
                }
            }
            if( teamCounter >= selectedTeams ) {
                break;
            }
        }

        let up = 0;
        let down = sortedTeamList.length-1;
        for( let p=0; p<sortedTeamList.length; p++ ) {
            let mod = p % po.playoffs.length;
            let po1 = po.playoffs[mod];

            const div = p / po.playoffs.length;
            let toggle = Math.floor(div) % 2;
            if(toggle == 0) {
                let pr: PlayoffRule = sortedTeamList[up++];
                po1.playoffRules.push(pr);
            } else {
                let pr: PlayoffRule = sortedTeamList[down--];
                po1.playoffRules.push(pr);
            }
        }

        this.playoffRows = po.playoffs;
        for (let p of this.playoffRows) {
            let r: Round = p.round;
            p.playoffName = r.name;
        }
        return bandPos;
    }

    public preparePlayoutRules( selectedTeams: number ) {
        console.log("Entering preparePlayoutRules()");

        let roundsNo : number = this.selectedTourney.roundVO.rounds.length;
        this.selectedTourney.playoutVO.playoffs = [];

        let p: Playoff = this.createPlayoff(0);
        this.selectedTourney.playoutVO.playoffs.push(p);
            
        let sortedTeamList: Array<PlayoffRule> = new Array<PlayoffRule>();

        let allRoundTeams = 0;
        for (let r of this.selectedTourney.roundVO.rounds) {
            allRoundTeams += r.teamNames.length;
        }
        
        for( let bp=selectedTeams; bp<allRoundTeams; bp++ ) {
            let bandPos: number = Math.floor(bp / roundsNo) + 1;

            let r = bp % roundsNo; 
            let pos = r+1;
            let posCB:    Combobox = { label: "" + pos + "° delle ", value: pos };
            let relPosCB: Combobox = { label: "" + bandPos + "°", value: bandPos };

            let fromRound: FromRound = { id: this.tourneyService.getSequenceNumber()
                , position: posCB
                , round: relPosCB
                , bandPosition: relPosCB.value == null ? 0 : relPosCB.value
                , isDummy: false
            };
            
            let prefix = roundsNo == 1 ? "" : fromRound.position.value + "° Delle Migliori ";
            const ruleName = prefix + fromRound.bandPosition + "°";
            let pr: PlayoffRule = { id: this.tourneyService.getSequenceNumber(), fromRound: fromRound, ruleName: ruleName, isDummy: false};

            sortedTeamList.push(pr);
        }

        let up = 0;
        let down = sortedTeamList.length-1;
        for( let p=0; p<sortedTeamList.length; p++ ) {
            let mod = p % this.selectedTourney.playoutVO.playoffs.length;
            let po = this.selectedTourney.playoutVO.playoffs[mod];

            const div = p / this.selectedTourney.playoutVO.playoffs.length;
            let toggle = Math.floor(div) % 2;
            if(toggle == 0) {
                let pr: PlayoffRule = sortedTeamList[up++];
                po.playoffRules.push(pr);
            } else {
                let pr: PlayoffRule = sortedTeamList[down--];
                po.playoffRules.push(pr);
            }
        }

        this.playoutRows = this.selectedTourney.playoutVO.playoffs;
        for (let p of this.playoutRows) {
            let r: Round = p.round;
            p.playoffName = r.name;
        }
    }

    onPlayoffAutoGenClick() {
        console.log("Entering onPlayoffAutoGenClick()");
        if(!confirm(PLYOFF_CHANGE_GEN_MODE_POPUP)) {
            return;
        } 
        if(this.selectedTourney.selectedPlayoffsCB.value && this.selectedTourney.selectedTeams4PlayoffsCB.value) {
            this.selectedTourney.playoffVO.isPlayoffAutoGen = this.isPlayoffAutoGen;
            let selectedTeams = this.selectedTourney.selectedPlayoffsCB.value * this.selectedTourney.selectedTeams4PlayoffsCB.value;
            this.prepareAutomaticPlayoffRules(selectedTeams);
            this.savePlayoffGeneratedMeetings();
        }
    } 

    onPlayoffManualGenClick() {
        console.log("Entering onPlayoffManualGenClick()");
        if(!confirm(PLYOFF_CHANGE_GEN_MODE_POPUP)) {
            return;
        } 
        if(this.selectedTourney.selectedPlayoffsCB.value && this.selectedTourney.selectedTeams4PlayoffsCB.value) {
            this.selectedTourney.playoffVO.isPlayoffAutoGen = this.isPlayoffAutoGen;
            let selectedTeams = this.selectedTourney.selectedPlayoffsCB.value * this.selectedTourney.selectedTeams4PlayoffsCB.value;
            this.prepareManualPlayoffRules(selectedTeams );
            this.savePlayoffGeneratedMeetings();
        }
    }

    /**
     * Prepares the rules as if it was for only one playoff round, so copies the rules
     * in the final playoffs. A rule is a couple of team selected in this way.
     * For example, if you have 4 rounds and you selected 4 teams per round to pass from the rounds to the playoffs,
     * you have 16 teams to pass to the playoffs by applying the following rules:
     * [1° Round.1, 4° Round.4]
     * [1° Round.2, 4° Round.3]
     * [1° Round.3, 4° Round.2]
     * [1° Round.4, 4° Round.1]
     * [2° Round.1, 3° Round.4]
     * [2° Round.2, 3° Round.3]
     * [2° Round.3, 3° Round.2]
     * [2° Round.4, 3° Round.1]
     * 
     * After that the user can modify, from the GUI, these positions and the incoming rounds
     * 
     * @param selectedTeams the number of selected teams to pass from round(s) to Play Off(s)
     */
    private prepareManualPlayoffRules( selectedTeams: number ) {
        let playoffRules: PlayoffRule[] = [];

        let po = this.selectedTourney.playoffVO;
        let roundsNo = this.selectedTourney.roundVO.rounds.length;
        let firstPosition: number = 1;
        let lastPosition: number = Math.floor(selectedTeams / roundsNo);
        
        while (firstPosition < lastPosition) {
            for (let r = 0; r < roundsNo; r++) {
                let currentRound = this.selectedTourney.roundVO.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, currentRound);
                playoffRules.push(pr1);
                let nr = (r + 1) % roundsNo;
                let nextRound = this.selectedTourney.roundVO.rounds[nr];
                let pr2: PlayoffRule = this.prepareFromRound(lastPosition, nextRound);
                playoffRules.push(pr2);
            }
            firstPosition++;
            lastPosition--;
        }
        if (firstPosition == lastPosition) {
            for (let r = 0; r < roundsNo; r++) {
                let round = this.selectedTourney.roundVO.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, round);
                playoffRules.push(pr1);
            }
        }
        let teamsModPlayoff: number = selectedTeams % roundsNo;
        lastPosition = Math.ceil(selectedTeams / roundsNo);
        for (let r = 0; r < teamsModPlayoff; r++) {
            let round = this.selectedTourney.roundVO.rounds[r];
            let pr: PlayoffRule = this.prepareFromRound(lastPosition, round);
            playoffRules.push(pr);
        }

        this.spawnGeneratedRules(selectedTeams, playoffRules, po);
    }
    
    /**
     * Prepares the rules as if it was for only one Play Out round, so copies the rules
     * in the final play outs. A rule is a couple of team selected in this way.
     * For example, if you have 4 rounds and you selected 4 teams per round to pass from the rounds to the playouts,
     * you have 16 teams to pass to the playouts by applying the following rules:
     * [1° Round.1, 4° Round.4]
     * [1° Round.2, 4° Round.3]
     * [1° Round.3, 4° Round.2]
     * [1° Round.4, 4° Round.1]
     * [2° Round.1, 3° Round.4]
     * [2° Round.2, 3° Round.3]
     * [2° Round.3, 3° Round.2]
     * [2° Round.4, 3° Round.1]
     * 
     * @param N the selected combo box
     */
    private prepareManualPlayoutRules( N: number ) {
        let playoutRules: PlayoffRule[] = [];

        let roundsNo = this.selectedTourney.roundVO.rounds.length;
        let firstPosition: number = 1;
        let lastPosition: number = Math.floor(N / roundsNo);
        
        while (firstPosition < lastPosition) {
            for (let r = 0; r < roundsNo; r++) {
                let currentRound = this.selectedTourney.roundVO.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, currentRound);
                playoutRules.push(pr1);
                let nr = (r + 1) % roundsNo;
                let nextRound = this.selectedTourney.roundVO.rounds[nr];
                let pr2: PlayoffRule = this.prepareFromRound(lastPosition, nextRound);
                playoutRules.push(pr2);
            }
            firstPosition++;
            lastPosition--;
        }
        if (firstPosition == lastPosition) {
            for (let r = 0; r < roundsNo; r++) {
                let round = this.selectedTourney.roundVO.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, round);
                playoutRules.push(pr1);
            }
        }
        let teamsModPlayoff: number = N % roundsNo;
        lastPosition = Math.ceil(N / roundsNo);
        for (let r = 0; r < teamsModPlayoff; r++) {
            let round = this.selectedTourney.roundVO.rounds[r];
            let pr: PlayoffRule = this.prepareFromRound(lastPosition, round);
            playoutRules.push(pr);
        }

        this.spawnGeneratedRules(N, playoutRules, this.selectedTourney.playoutVO);
    }

    /**
     * Copies the generated rules from the received rule list to the set of 
     * requested playoffs
     * 
     * @param N number of teams to pass the phase
     * @param playoffRules the list of rules
     */
    private spawnGeneratedRules(N: number, playoffRules: PlayoffRule[], po : PlayoffVO ) : void {
        this.resetPlayoffMeetings();

        let playoffNo: number = this.selectedTourney.selectedPlayoffsCB.value == null ? 0 : this.selectedTourney.selectedPlayoffsCB.value;
        let coupleNo = 2 * playoffNo;
        let chunksInteger = Math.floor(N / coupleNo);
        let chunksNo = Math.floor(chunksInteger * coupleNo);
        
        let r = 0;

        let poCounter = 0;
        for (r = 0; r < chunksNo; r += 2) {
            let rule = playoffRules[r];

            if(po.playoffs.length <= poCounter) {
                let p: Playoff = this.createPlayoff(r/2);
                po.playoffs.push(p);    
            }
            po.playoffs[poCounter].playoffRules.push(rule);

            rule = playoffRules[r + 1];
            po.playoffs[poCounter].playoffRules.push(rule);

            poCounter = (poCounter + 1) % playoffNo;
        }
        for (; r < N; r++) {
            let rule = playoffRules[r];
            if(po.playoffs.length <= poCounter) {
                let p: Playoff = this.createPlayoff(r);
                po.playoffs.push(p);    
            }
            po.playoffs[poCounter].playoffRules.push(rule);
            poCounter = (poCounter + 1) % playoffNo;
        }

        this.playoffRows = po.playoffs;
        for (let p of this.playoffRows) {
            let r: Round = p.round;
            p.playoffName = r.name;
        }
    }

    private resetPlayoffMeetings() {
        this.meetingPlayoffService.deletePlayoffMeetingsByTourneyId(this.selectedTourney.id);
        this.meetingPlayoffService.deletePlayoutMeetingsByTourneyId(this.selectedTourney.id);

        this.cleanPlayoffMeetings(true);
        this.cleanPlayoutMeetings(true);
    }
 
    private cleanPlayoffMeetings(cleanPlayoffs: boolean ) {
        for (let p of this.selectedTourney.playoffVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        if (cleanPlayoffs) {
            this.selectedTourney.playoffVO.playoffs = [];
            this.playoffRows = [];
        }
    }
  
    private cleanPlayoutMeetings(cleanPlayoffs: boolean ) {
        for (let p of this.selectedTourney.playoutVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        if (cleanPlayoffs) {
            this.selectedTourney.playoutVO.playoffs = [];
            this.playoutRows = [];
        }
    }
 
    private prepareTourneyVOForEliminatory(cleanEliminatory : boolean ): TourneyVO {
        this.meetingRoundService.cleanEliminatoryMeetings(cleanEliminatory);
        let tvo = new TourneyVO();
        tvo.id = this.selectedTourney.id;
        tvo.tourneyName = this.selectedTourney.tourneyName == null ? "" : this.selectedTourney.tourneyName;
        tvo.country = this.selectedTourney.country;
        tvo.clientVO = this.clientService.selectedClient;
        tvo.json = JSON.stringify(this.selectedTourney);
        return tvo;
    }

    private prepareTourneyVOForEliminatoryB(cleanEliminatory : boolean ): TourneyVO {
        this.meetingRoundService.cleanEliminatoryBMeetings(cleanEliminatory);
        let tvo = new TourneyVO();
        tvo.id = this.selectedTourney.id;
        tvo.tourneyName = this.selectedTourney.tourneyName == null ? "" : this.selectedTourney.tourneyName;
        tvo.country = this.selectedTourney.country;
        tvo.clientVO = this.clientService.selectedClient;
        tvo.json = JSON.stringify(this.selectedTourney);
        return tvo;
    }

    onPlayoffRowSelect(event : any) {
        this.tourneyService.selectedPlayoff = event.data;
        this.tourneyService.selectedPlayout = null;
        this.router.navigate([REDIRECT_PLAYOFF_DV]);
    }
    
    onPlayoutRowSelect(event : any)  {
        this.tourneyService.selectedPlayout = event.data;
        this.tourneyService.selectedPlayoff = null;
        this.router.navigate([REDIRECT_PLAYOFF_DV]);
    }

    private createPlayoff(i: number): Playoff {
        let po: Playoff = new Playoff();
        po.id = this.tourneyService.getSequenceNumber();
        po.playoffRules = [];
        po.round = new Round();
        po.round.id = this.tourneyService.getSequenceNumber();
        po.round.name =  "Girone: " + (1 + i);
        po.round.onewayCurrentDay =  1;
        po.round.roundtripCurrentDay =  1;
        po.round.type =  RoundType.P;
        po.round.direction =  Direction.OneWay;
        po.round.pageSize =  1;
        po.round.daysNo =  1;
        po.round.teamNames = [];
        po.round.onewayMeetings =  [];
        po.round.roundtripMeetings =  [];
        po.round.classification =  [];
        return po;
    }

    private prepareFromRound(pos: number, round: Round): PlayoffRule {
        let posCB:     Combobox    = { label: "" + pos + "°", value: pos };
        let roundCB:   Combobox    = { label: round.name, value: round.id };
        let fromRound: FromRound   = { id: round.id
            , isDummy: false
            , position: posCB
            , round: roundCB
            , bandPosition: posCB.value==null ? 0 : posCB.value};
        let pr: PlayoffRule = { id: pos, fromRound: fromRound, ruleName: "", isDummy: false  };
        return pr;
    }    

    onEliminatoryLevelRowSelect(event : any) {
        console.log("Entering onEliminatoryLevelRowSelect()");
        console.log(event);

        let redirect: string = LevelService.autoRedirectLV;
        if(!this.levelService.isStandAlone(this.selectedTourney) ) {
            redirect = LevelService.manualRedirectLV;
        }

        let indexOf = this.eliminatoryLevelRows.indexOf( event.data );
        this.tourneyService.selectedEliminatoryLevelIndex  = indexOf;

        this.tourneyService.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[indexOf];
        this.tourneyService.selectedEliminatoryLevelIndex=indexOf;
        // this.tourneyService.selectedEliminatoryBLevelIndex=null;

        this.meetingService.abstractRoundVO = this.tourneyService.selectedEliminatoryLevel.abstractRoundVO;
        this.meetingRoundService.abstractRoundVO = this.tourneyService.selectedEliminatoryLevel.abstractRoundVO;
        this.tourneyService.eliminatoryTabName = this.selectedTourney.eliminatoryTabName;

        let elList: EliminatoryLevel[] = [];
        elList.push(this.tourneyService.selectedEliminatoryLevel);
        this.levelService.loadAllEliminatoryMeetingByIdList(elList, () => this.doRedirect(redirect), (e) => this.onError(e));
    }

    onEliminatoryBLevelRowSelect(event : any) {
        console.log("Entering onEliminatoryBLevelRowSelect()");
        console.log(event);

        let redirect = LevelService.manualRedirectLV;

        let indexOf = this.eliminatoryBLevelRows.indexOf( event.data );
        this.tourneyService.selectedEliminatoryLevelBIndex  = indexOf;

        this.tourneyService.selectedEliminatoryLevel = this.selectedTourney.eliminatoryBLevels[indexOf];
        this.tourneyService.selectedEliminatoryBLevelIndex=indexOf;
        // this.tourneyService.selectedEliminatoryLevelIndex=null;

        this.meetingService.abstractRoundVO = this.tourneyService.selectedEliminatoryLevel.abstractRoundVO;
        this.meetingRoundService.abstractRoundVO = this.tourneyService.selectedEliminatoryLevel.abstractRoundVO;
        this.tourneyService.eliminatoryTabName = this.selectedTourney.eliminatoryBTabName;

        let elList: EliminatoryLevel[] = [];
        elList.push(this.tourneyService.selectedEliminatoryLevel);
        this.levelService.loadAllEliminatoryBMeetingByIdList(elList, () => this.doRedirect(redirect), (e) => this.onError(e));
    }

    private doRedirect( redirect: string): void {
        if( redirect != null ) {
            this.router.navigate([redirect]);
        }
    }
    
    onOnewayRoundClick() {
        console.log("Entering onOnewayRoundClick()");
        this.selectedTourney.isOnewayRound = "true";
    }

    onRoundtripRoundClick() {
        console.log("Entering onRoundtripRoundClick()");
        this.selectedTourney.isOnewayRound = "false";
    }
    
    onOnewayPlayoffClick() {
        console.log("Entering onOnewayPlayoffClick()");
        this.selectedTourney.isOnewayPlayoff = "true";
    }    

    onOnewayPlayoutClick() {
        console.log("Entering onOnewayPlayoutClick()");
        this.selectedTourney.isOnewayPlayout = "true";
    }

    onRoundtripPlayoffClick() {
        console.log("Entering onRoundtripPlayoffClick()");
        this.selectedTourney.isOnewayPlayoff = "false";
    }

    onRoundtripPlayoutClick() {
        console.log("Entering onRoundtripPlayoutClick()");
        this.selectedTourney.isOnewayPlayout = "false";
    }

    onIsDailyClick() {
        this.selectedTourney.isDaily = "true";
    }
    onIsNotDailyClick() {
        this.selectedTourney.isDaily = "false";
    }

    onScoreClick() {
        this.selectedTourney.tourneyType = TourneyType.Score;
    }
    onTimeClick() {
        this.selectedTourney.tourneyType = TourneyType.Time;
    }
    
    onAllRoundMatchesClick() {
        this.selectedTourney.roundVO.isAllMatches = "true";
    }
    onRoundBestOfClick() {
        this.selectedTourney.roundVO.isAllMatches = "false";
    }

    onRoundCompleteClick() {
        this.selectedTourney.resultTool = EResultTool.C;
    }
    onRoundReducedClick() {
        this.selectedTourney.resultTool = EResultTool.R;
    }
    
    onAllPlayoffMatchesClick() {
        this.selectedTourney.playoffVO.isAllMatches = "true";
    }
    onPlayoffBestOfClick() {
        this.selectedTourney.playoffVO.isAllMatches = "false";
    }

    onAllPlayoutMatchesClick() {
        this.selectedTourney.playoutVO.isAllMatches = "true";
    }
    onPlayoutBestOfClick() {
        this.selectedTourney.playoutVO.isAllMatches = "false";
    }

    onRoundPhaseChange(event : any) {
        console.log("Entering onRoundPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.R);
        if(event) {
            this.prepareRoundsCombobox();
        } else {
            this.initDefaultRoundVO();
        }
    }

    onPlayoffPhaseChange(event : any) {
        console.log("Entering onPlayoffPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.P);
        this.initDefaultPlayoffVO();
        if(event) {
            this.preparePlayoffsCombobox();
        } else {
            this.onPlayoutPhaseChange(event);
        }
    }

    onPlayoutPhaseChange(event : any) {
        console.log("Entering onPlayoutPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.O);
        this.initDefaultPlayoutVO();
    }

    onEliminatoryPhaseChange(event : any) {
        console.log("Entering onEliminatoryPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.E);
        if(event) {
            this.prepareEliminatoryCombobox();
        } else {        
            this.selectedTourney.eliminatoryLevels = [];
            this.selectedTourney.eliminatoryTabName="Eliminazioni Dirette";
            this.tourneyService.eliminatoryTabName = this.selectedTourney.eliminatoryTabName;
            this.onEliminatoryBPhaseChange(event);
        }
    }

    onEliminatoryBPhaseChange(event : any) {
        console.log("Entering onEliminatoryBPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.EB);
        if(event) {
            this.prepareEliminatoryB();
        } else {
            this.selectedTourney.eliminatoryBLevels = [];
            this.selectedTourney.eliminatoryBTabName="Eliminazioni Dirette B";
            this.tourneyService.eliminatoryTabName = this.selectedTourney.eliminatoryBTabName;
        }
    }

    private updatePhases(event: any, pp: PhaseType) {
        if (event) {
            let indexOf = this.selectedTourney.phases.indexOf(pp);
            if (indexOf == -1) {
                this.selectedTourney.phases.push(pp);
            }
        } else {
            let indexOf = this.selectedTourney.phases.indexOf(pp);
            if (indexOf != -1) {
                this.selectedTourney.phases.splice(indexOf, 1);
            }
        }
    }

    onRoundSpinnerChange(event : any)  {
        let spin = this.selectedTourney.roundVO.maxMatchesPerMeeting;
        if(spin == 1 || spin == 2) {
            this.selectedTourney.roundVO.allMatchesEnabled = false;
        } else {
            this.selectedTourney.roundVO.allMatchesEnabled = true;
        }
        this.selectedTourney.roundVO.bestOfWinner = spin;
    }
    
    onPlayoffSpinnerChange(event : any) {
        let spin = this.selectedTourney.playoffVO.maxMatchesPerMeeting;
        if(spin == 1 || spin == 2) {
            this.selectedTourney.playoffVO.allMatchesEnabled = false;
        } else {
            this.selectedTourney.playoffVO.allMatchesEnabled = true;
        }
        this.selectedTourney.playoffVO.bestOfWinner = spin;
    }

    onPlayoutSpinnerChange(event : any) {
        let spin = this.selectedTourney.playoutVO.maxMatchesPerMeeting;
        if(spin == 1 || spin == 2) {
            this.selectedTourney.playoutVO.allMatchesEnabled = false;
        } else {
            this.selectedTourney.playoutVO.allMatchesEnabled = true;
        }
        this.selectedTourney.playoutVO.bestOfWinner = spin;
    }

    private doSave(): void {
        console.log("Entering doSave()");

        this.tourneyService.clearTourneyMeetings(this.selectedTourney, this.tabChangedIndex);
        let tvo: TourneyVO = this.prepareTourneyVO();
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
         if( !this.onSaveTourneyError ) {
            subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.saveComplete());
            // this.mergeOperators();
        } 
    }

    private saveComplete(): void {
        console.log("Entering saveComplete()");
        if( !this.onSaveTourneyError ) {
            this.playerService.newPlayer = false;
            this.gotoListView();
        }
    }

    prevTab(): void {
        this.tourneyService.selectedTabIndex--;
        this.tourneyService.selectedTabIndex = this.tourneyService.selectedTabIndex < 0 ? 0 : this.tourneyService.selectedTabIndex;
        this.makeButtonLabel();
    }

    nextTab(): void {
        console.log("Entering nextTab()");
        if( !this.isInWizardMode() ) {
            this.doSave();
            return;
        }

        let rewind  = true;
        if( this.tourneyService.selectedTabIndex >= this.maxBoundaryTabIndex ) {
            this.tourneyService.selectedTabIndex = 0;
            this.selectedTourney.wizardModeIndex = -1
            let tvo: TourneyVO = this.cloneTourneyVO(true);
            const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
            subscriber.subscribe(tvo => this.saveTourneyNext(tvo), e => this.subscribeErrorHandler(e), () => this.nextSaveComplete(true));
            return;
        }

        if( this.levelService.isStandAlone(this.selectedTourney) ) {
            if( this.tourneyService.selectedTabIndex >= MIN_ELIMINATORY_TAB_INDEX ) {
                this.tourneyService.selectedTabIndex++;
                let teamNo: number  = this.selectedTourney.teams.length;
                this.selectedTourney.selectedEliminatoryTeamsCB.value = teamNo;
                this.doEliminatoryTeamNumChange(teamNo);
                return;
            }
        }

        let tvo: TourneyVO = this.cloneTourneyVO(rewind);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.saveTourneyNext(tvo), e => this.subscribeErrorHandler(e), () => this.nextSaveComplete(false));
    }
 
    private saveTourneyNext(tvo: TourneyVO): void {
        console.log("saveTourneyNext()");
        console.log(tvo);
        this.selectedTourney.id = tvo.id;
    }

    private nextSaveComplete(rewind : boolean): void {
        console.log("Entering nextSaveComplete()");
        
        if( this.onSaveTourneyError ) {
            return;
        }

        this.tourneyService.newTourney = false;

        if( rewind ) {
            this.gotoListView();
            return;
        }

        this.tourneyService.selectedTabIndex++;
        this.selectedTourney.wizardModeIndex = this.tourneyService.selectedTabIndex > this.selectedTourney.wizardModeIndex 
            ? ++this.selectedTourney.wizardModeIndex
            : this.selectedTourney.wizardModeIndex;
        this.makeButtonLabel();
        if( this.tourneyService.selectedTabIndex == 3 && this.isRoundTabEnabled() ) {
            this.prepareRoundsCombobox();
        }
    }
 
    private updatePlayoffMeetings(complete: () => void) {
        this.tourneyService.updateTourneyAndPlayoffs(this.selectedTourney, () => complete());
    } 

    private updatePlayoutMeetings() {
        this.tourneyService.updateTourneyAndPlayouts(this.selectedTourney, () => this.unBlockDocument());
    }


    private cloneTourneyVO(rewind : boolean) : TourneyVO {
        this.tourneyAlreadyExists = false;
        this.onSaveTourneyError = false;

        if( !this.isInWizardMode() ) {
            this.tourneyService.clearTourneyMeetings(this.selectedTourney, this.tabChangedIndex);
        }

        let tmp = {...this.selectedTourney };
        if( rewind ) {
            // tmp.selectedTabIndex = 0;
            tmp.wizardModeIndex = -1;
        } else {
            // tmp.selectedTabIndex++;
            // tmp.wizardModeIndex = tmp.selectedTabIndex;
        }
        
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(tmp, this.clientService.selectedClient);

        return tvo;
    }

    private prepareTourneyVO() : TourneyVO {
        this.tourneyAlreadyExists = false;
        this.onSaveTourneyError = false;
        if( !this.isInWizardMode() ) {
            this.tourneyService.clearTourneyMeetings(this.selectedTourney, this.tabChangedIndex);
        }
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        return tvo;
    }


    public gotoListView() {
        this.tourneyService.newTourney = false;
        this.router.navigate([REDIRECT_ADMIN_TOURNEY]);
    }

    override goBack() {
        this.tourneyService.newTourney = false;
        let popup = 'Sicuro di NON dover salvare niente?';
        if(confirm(popup)) {
            this.gotoListView();
        }    
    }

    atLeastOnePhase() : boolean{
        if(this.tourneyService.containsPhase(PhaseType.R)) {
            return true;
        }
        if(this.tourneyService.containsPhase(PhaseType.P)) {
            return true;
        }
        if(this.tourneyService.containsPhase(PhaseType.E)) {
            return true;
        }

        return false;
    }

    notAllowedPhases(): boolean {
        if(!this.tourneyService.containsPhase(PhaseType.R) 
            && this.tourneyService.containsPhase(PhaseType.P)
            && this.tourneyService.containsPhase(PhaseType.E)) 
        {
            return true;
        }
        
        if(!this.tourneyService.containsPhase(PhaseType.R) 
            && this.tourneyService.containsPhase(PhaseType.P)
            && !this.tourneyService.containsPhase(PhaseType.E)) 
        {
            return true;
        }

        return false;
    }

    editDisabled(): string {
        return "";
    }

    enableSaveButton() : string {
        let n : String = this.selectedTourney.tourneyName == null ? "" : this.selectedTourney.tourneyName;
        let a : String = this.selectedTourney.address;
        let fase1 = this.notAllowedPhases();
        let fase2 = !this.atLeastOnePhase();
        return n.trim() == "" || a.trim() == "" || fase1 || fase2 ? "disabled" : "";
    }

    teamButtonDisabled() : string {
        return this.selectedTourney.teams.length < 2 ? "disabled" : "";
    }

    roundButtonDisabled() : string {
        return this.selectedTourney.selectedRoundsNumCB.value == 0 ? "disabled" : "";        
    }

    playoffButtonDisabled() : string {
        let disabled = this.selectedTourney.selectedTeams4PlayoffsCB.value == 0;
        return disabled ? "disabled" : "";        
    }

    playoutButtonDisabled() : string {
        let disabled = false;
        return disabled ? "disabled" : "";        
    }

    eliminatoryButtonDisabled() : string {
        let value = this.selectedTourney.selectedEliminatoryTeamsCB.value == null ? 0 : this.selectedTourney.selectedEliminatoryTeamsCB.value;
        return value <= 0 ? "disabled" : "";        
    }

    override onError(n:any) {
        let msgerr : string;
        msgerr = 'Creazione/Modifica nuovo torneo fallita';
        console.error(msgerr);
    }
}


