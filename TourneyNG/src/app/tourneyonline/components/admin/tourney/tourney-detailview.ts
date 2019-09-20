import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { PhaseType, EliminatoryMode, AccessMode, TourneyType, TeamSortType,  RoundType } from '../../../domain/enumerations';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';
import { Router } from '@angular/router';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { LevelService } from '../eliminatory/level-service';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { FromRound } from 'app/tourneyonline/domain/from-round';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { MeetingRoundService } from '../round/meeting-round-service';
import { MeetingPlayoffService } from '../playoff/meeting-playoff-service';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

const REDIRECT_TEAM_DV      = 'admintourney/dv/team';
const REDIRECT_ADD_TEAM_DV  = 'admintourney/dv/addteam';

const REDIRECT_ROUND_DV     = 'admintourney/dv/round';
const REDIRECT_PLAYOFF_DV   = 'admintourney/dv/playoff';

const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
    templateUrl: './tourney-detailview.html',
})
export class TourneyDetailView extends AbstractDetailView {
    static redirect = 'admintourney/dv';
    
    blockedDocument: boolean = false;

    disciplineOptions : Combobox[];
    selectedDiscipline: Combobox;

    gender: string = "tourney";

    allMatchesEnabled: boolean = true;
    bestOffWinner: number;

    selectedTeam: Team;

    teamCols: TableCols[];

    roundCols: TableCols[] = TourneyService.roundCols;
    roundRows: Round[];
    selectedRound: Round;

    playoffCols: TableCols[] = TourneyService.playoffCols;
    playoffRows: Playoff[];
    selectedPlayoff: Playoff;
    
    eliminatoryTeamsCombobox: Combobox[];
    eliminatoryMode: EliminatoryMode;
    eliminatoryLevelCols: TableCols[];
    eliminatoryLevelRows: EliminatoryLevelVO[];

    atLeastTwoTeams: boolean;
    team4roundsCombobox: Combobox[];
    roundsCombobox: Combobox[];

    atLeastOneRound: boolean;
    playoffsCombobox: Combobox[];
    team4playoffsCombobox: Combobox[];

    meetingDaysMap: Map<number, Meeting[]>;
    teamLabel: string;
    tourneyAlreadyExists: boolean;
    onSaveTourneyError: boolean;
    badRequest: boolean;

    roundTabEnabled: boolean = false;
    playoffTabEnabled: boolean = false;
    eliminatoryTabEnabled: boolean = false;
    modeTabEnabled: boolean = false;
    teamTabEnabled: boolean = false;

    nextButtonLabel: string = "Avanti";
    nextButtonIcon: string = "fa fa-arrow-right";
    maxBoundaryTabIndex: number;
    rewind: boolean;

    constructor(
        protected location: Location,
        public tourneyService: TourneyService,
        protected countryService: CountryService,
        protected clientService: ClientService,
        protected playerService: PlayerService,
        protected teamService: TeamService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected levelService: LevelService,
        private disciplineService: DisciplineService,
        private router: Router 
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("TourneyDetailView.ngOnInit() ");
        this.blockDocument();

        super.ngOnInit();

        this.countries = this.countryService.countries;

        if (this.tourneyService.newTourney) {
            this.initNewTourney();
        }
        this.maxBoundaryTabIndex = this.getLastTabIndex();

        this.initiDisciplineCombobox();

        this.initUndefined();
    
        this.selectedTourney.datetime = new Date(this.selectedTourney.datetime);
        this.atLeastTwoTeams = this.selectedTourney.teams.length >= 2 ? true : false;
        this.teamCols = TeamService.cols;
        if (this.selectedTourney.maxMatchesPerMeeting <= 2) {
            this.allMatchesEnabled = false;
        }
        let spin = this.selectedTourney.maxMatchesPerMeeting;
        this.bestOffWinner = spin;
        this.teamLabel = this.selectedTourney.teams.length == 0 ? "Aggiungi squadre" : "Gestisci Squadre (" +this.selectedTourney.teams.length + ")";

        this.checkTeamsChanged();

        this.prepareTabsGui();
    }
 
    private blockDocument() {
        this.blockedDocument = false;
    }

    private checkTeamsChanged() {
        if (this.teamService.isTeamsChanged) {
            this.teamService.isTeamsChanged = false;
            this.turnOnWizardMode(2);
            this.resetMeetings();
        }
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
            if (this.selectedTourney.selectedTabIndex <= this.maxBoundaryTabIndex) {
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

    private initNewTourney() {
        this.selectedTourney = {};

        this.selectedTourney.id = null;
        this.selectedTourney.wizardModeIndex = -1;
        this.selectedTourney.datetime = new Date();
        this.selectedTourney.tourneyName = "";
        this.selectedTourney.isDaily = "true";
        this.selectedTourney.address = "";
        this.selectedTourney.tourneyType = TourneyType.Score;
        this.selectedTourney.matchBalanceScores = 0;
        this.selectedTourney.matchWinnerScores = 3;
        this.selectedTourney.access = AccessMode.PU;
        this.selectedTourney.objectives = [];
        this.selectedTourney.rounds = [];
        this.selectedTourney.eliminatoryLevels = [];
        this.selectedTourney.teams = [];
        this.selectedTourney.playoffs = [];
        this.selectedTourney.pointsNeededToWin = 9;
        this.selectedTourney.pointsGoldenGoalTieBreakWin = 2;
        this.selectedTourney.pointsGoldenGoalTieBreakDefeat = 1;
        this.selectedTourney.maxMatchesPerMeeting = 1;
        this.selectedTourney.isAllMatches = "true";
        this.selectedTourney.playersPerTeam = 1;
        this.selectedTourney.phases = [PhaseType.R, PhaseType.P, PhaseType.E];
        this.selectedTourney.eliminatoryMode = EliminatoryMode.A;
        this.selectedTourney.teamSortType = TeamSortType.O;
        this.selectedTourney.isOnewayRound = "true";
        this.selectedTourney.isOnewayPlayoff = "true";
        this.selectedTourney.teamsWeightEnabled = "false";
                
        this.selectedTourney.discipline = {id:0, name: "", description: ""};

        this.selectedTourney.selectedTabIndex = 0;
        this.roundTabEnabled = false;
        this.playoffTabEnabled = false;
        this.teamTabEnabled = false;
        this.eliminatoryTabEnabled = false;

        this.eliminatoryLevelRows = [];

        this.tourneyService.selectedTourney = this.selectedTourney;    
        this.teamService.isTeamsChanged = false;
        this.selectedTourney.wizardModeIndex = 0;

        this.resetComboBoxes();
    }

    private resetMeetings(): void {
        
        this.resetComboBoxes();

        if( this.isRoundTabEnabled() ) {
            this.resetRoundMeetings();
        }
        if( this.isPlayoffTabEnabled() ) {
            this.resetPlayoffMeetings();
        }
        if( this.isEliminatoryTabEnabled() ) {
            this.resetEliminatoryMeetings();
        }   
        this.makeButtonLabel();
    }

    private resetComboBoxes() {
        this.selectedTourney.selectedTeams4PlayoffsCB = { label: "", value: 0 };
        this.selectedTourney.selectedPlayoffsCB = { label: "", value: 0 };
        this.selectedTourney.selectedRoundsNumCB = { label: "", value: 0 };
        this.selectedTourney.selectedEliminatoryTeamsCB = { label: "", value: 0 };
    }

    private prepareTabsGui( ): void {
        this.enableTabsFlags();

        if( this.isRoundTabEnabled() ) {
            this.prepareRoundsCombobox();
        }

        if( this.isPlayoffTabEnabled() ) {
            this.preparePlayoffsCombobox();
        }

        if( this.isEliminatoryTabEnabled() ) {
            this.levelService.ngOnInit();
            this.levelService.prepareEliminatoryLevelsGui();
            this.prepareEliminatoryCombobox();
        }
    }

    private enableTabsFlags() {
        this.modeTabEnabled = this.isModalityTabEnabled();
        this.teamTabEnabled = this.isTeamTabEnabled();
        this.roundTabEnabled = this.isRoundTabEnabled();
        this.playoffTabEnabled = this.isPlayoffTabEnabled();
        this.eliminatoryTabEnabled = this.isEliminatoryTabEnabled();
        this.makeButtonLabel();
    }

    private isModalityTabEnabled(): boolean {
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.selectedTourney.selectedTabIndex <= this.selectedTourney.wizardModeIndex ? true : false;
    }

    private isTeamTabEnabled(): boolean {
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.selectedTourney.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isRoundTabEnabled(): boolean {
        if( !this.containsRound() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.selectedTourney.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isPlayoffTabEnabled(): boolean {
        if( !this.containsPlayoff() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.selectedTourney.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isEliminatoryTabEnabled(): boolean {
        if( !this.containsEliminatory() ) {
            return false;
        }
        if( !this.isInWizardMode() ) {
            return true;
        }
        return this.selectedTourney.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private makeButtonLabel(): void {

        if( !this.isInWizardMode()  ) {
            this.nextButtonLabel = "Salva";
            this.nextButtonIcon = "fa fa-save";
            return;
        }

        if (this.selectedTourney.selectedTabIndex >= this.maxBoundaryTabIndex) {
            this.nextButtonLabel = "Fine";
            this.nextButtonIcon = "fa fa-save";
        }
        else {
            this.nextButtonLabel = "Avanti";
            this.nextButtonIcon = "fa fa-arrow-right";
        }
    }

    private getLastTabIndex() {
        let lastTabIndex = 3;
        if (this.containsRound()) {
            if (this.containsPlayoff()) {
                lastTabIndex = 4;
                if (this.containsEliminatory()) {
                    lastTabIndex = 5;
                }
            } else if (this.containsEliminatory()) {
                lastTabIndex = 4;
            }
        }
        return lastTabIndex;
    }

    private prepareRoundsCombobox(): void {
        console.log("Entering prepareRoundsCombobox()");

        this.team4roundsCombobox = [];

        let N = this.selectedTourney.teams.length;
        for (let t=2; t<=N; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.team4roundsCombobox.push(cb);
        } 
        
        this.roundsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.roundsCombobox.push(firstRow);

        let R: number = Math.floor(this.selectedTourney.teams.length/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.roundsCombobox.push(cb);
        } 

        this.roundRows = this.selectedTourney.rounds;
        this.atLeastOneRound = this.selectedTourney.rounds.length >= 1 ? true : false;
    }

    private preparePlayoffsCombobox(): void {
        console.log("Entering preparePlayoffsCombobox()");
        
        this.team4playoffsCombobox = [];

        let N = this.selectedTourney.teams.length;
        for(let r of this.selectedTourney.rounds) {
            if( r.teams.length < N ) {
                N = r.teams.length;
            }
        }

        for (let t=2; t<=N; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.team4playoffsCombobox.push(cb);
        } 

        this.playoffsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.playoffsCombobox.push(firstRow);

        let R: number = Math.floor(N * this.selectedTourney.rounds.length / 2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.playoffsCombobox.push(cb);
        } 

        this.playoffRows = this.selectedTourney.playoffs;
        for(let p of this.playoffRows) {
            p.playoffName = p.round.name;
        }
    }

    private prepareEliminatoryCombobox() {
        console.log("Entering prepareEliminatoryCombobox()");

        this.eliminatoryTeamsCombobox = this.tourneyService.eliminatoryTeamsCombobox;
 
        this.eliminatoryLevelCols = this.levelService.eliminatoryLevelCols;
        if(this.selectedTourney.selectedEliminatoryTeamsCB.value >= 0 ) {
            this.eliminatoryLevelRows = this.levelService.eliminatoryLevelRows;
        }
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);

        this.selectedTourney.selectedTabIndex = index; 

        this.enableTabsFlags();
    }

    addTeams() {
        this.router.navigate([REDIRECT_ADD_TEAM_DV]);
    }

    onTeamRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedTeam;

        this.router.navigate([REDIRECT_TEAM_DV]);
    }
     
    onRoundRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.router.navigate([REDIRECT_ROUND_DV]);
    }

    doRoundDelete(round: Round) {
        this.tourneyService.doRoundDelete(round, this.saveTourneyErrorHandler('Delete Round operation'));
    }
 
    doPlayoffDelete(playoff: Playoff) {
        this.tourneyService.doPlayoffDelete(playoff, this.saveTourneyErrorHandler('Delete Playoff operation'));
    }
 
    onEliminatoryTeamNumChange(event) {
        console.log(event);

        this.blockDocument();
        const teamsNo = this.selectedTourney.selectedEliminatoryTeamsCB.value;
        this.eliminatoryLevelRows = this.levelService.onEliminatoryTeamNumChange(teamsNo);
        
        let mdbs : MeetingDb[] = [];
        for (let el of this.levelService.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                for( let m of e.round.onewayMeetings) {
                    let mdb = this.meetingRoundService.prepareEliminatoryMeetingDb(m, this.selectedTourney.id, e.id);
                    mdbs.push(mdb);
                }
                for( let m of e.round.roundtripMeetings) {
                    let mdb = this.meetingRoundService.prepareEliminatoryMeetingDb(m, this.selectedTourney.id, e.id);
                    mdbs.push(mdb);
                }
            }
        }

        let tvo: TourneyVO = this.prepareTourneyVOForEliminatory(false);
        tvo.mdbs = mdbs;
        const subscriber = this.tourneyService.updateTourneyAndEliminatories(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.unBlockDocument() );
        this.turnOnWizardMode(this.maxBoundaryTabIndex);
    }
    
    onDisciplineChange(cb: Combobox) {
        console.log(cb);

        this.selectedTourney.discipline.name = cb.label;
        this.selectedTourney.discipline.id = cb.value;
    }

    onRoundNumChange(cb: Combobox) {
        console.log(cb);

        if(this.selectedTourney.rounds.length > 0 ) {
            let popup = 'ATTENZIONE! Se si cambia il numero di gironi si perdono tutte le impostazioni preesistenti. Confermi?';
            if(!confirm(popup)) {
                return;
            } 
        }

        this.blockDocument();

        this.selectedTourney.selectedRoundsNumCB = cb;
       
        let T: number = this.selectedTourney.teams.length;
        let R: number = this.selectedTourney.selectedRoundsNumCB.value;

        let randomTeams: Team[] = this.prepareTourneyTeams(T);
        
        this.prepareTourneyRounds(R, randomTeams);

        for( let r of this.selectedTourney.rounds ) {
            this.meetingRoundService.createRoundMeeting(this.selectedTourney, r);
        }

        this.roundRows = this.selectedTourney.rounds;

        this.selectedTourney.selectedPlayoffsCB       = {label: "", value: 0};
        this.selectedTourney.selectedTeams4PlayoffsCB = {label: "", value: 0};

        this.selectedTourney.selectedEliminatoryTeamsCB = {label: "", value: 0};
        
        this.saveRoundMeetings();
        this.turnOnWizardMode(3);
    }

    /**
     * Prepares the rounds of the selected tourney in function of the received parameters.
     * 
     * The received team list is spawn on the number of received rounds so each round contains
     * at most the same number of teams.
     */
    private prepareTourneyRounds(roundCount: number, randomTeams: Team[]) {
        this.selectedTourney.rounds = [];

        for (let i = 0; i < roundCount; i++) {
            let r: Round = this.prepareEmptyRound(i);
            this.selectedTourney.rounds.push(r);
        }

        for( let i=0; i<randomTeams.length; i++ ) {            
            let r = i % roundCount;
            let round = this.selectedTourney.rounds[r]; 
            let rt = randomTeams[i];
            round.teams.push(rt);
        }

        for (let r of this.selectedTourney.rounds) {
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
     * @returns the list of team list
     */
    private prepareTourneyTeams(T : number) : Team[]  {
        let randomTeams: Team[] = [];
        
        if( this.selectedTourney.teamsWeightEnabled == "false" ) {
            return  this.selectedTourney.teams;         
        } 

        for(let t=0; t<T; t++) {
            let team: Team = this.selectedTourney.teams[t];
            randomTeams.push(team);
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

    /**
     * Resets the round. playoff and eliminatory meeetings
     */
    private resetRoundMeetings( ) {
        let tvo: TourneyVO = this.prepareTourneyVOForRound(true);
        this.tourneyService.updateTourneyDeleteRoundMeetings(tvo);
    }
 
    private prepareTourneyVOForRound(cleanRounds: boolean) {
        this.cleanRoundMeetings(cleanRounds);
        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        return tvo;
    }

    private cleanRoundMeetings(cleanRounds: boolean) {
        for (let r of this.selectedTourney.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }
        if (cleanRounds) {
            this.selectedTourney.rounds = [];
            this.roundRows = [];
        }
        if(this.containsPlayoff()) {
            this.cleanPlayoffMeetings(cleanRounds);
        }
    }

    private saveRoundMeetings() {
        let roundsMeetings: MeetingDb[] = [];
        for (let r of this.selectedTourney.rounds) {
            for(let m of r.onewayMeetings ) {
                let mdb = this.meetingRoundService.prepareRoundMeetingDb(m, this.selectedTourney.id, r.id);
                roundsMeetings.push(mdb);
            }
            for(let m of r.roundtripMeetings ) {
                let mdb = this.meetingRoundService.prepareRoundMeetingDb(m, this.selectedTourney.id, r.id);
                roundsMeetings.push(mdb);
            }
        }

        let tvo: TourneyVO = this.prepareTourneyVOForRound(false);
        tvo.mdbs = roundsMeetings;
        const subscriber = this.tourneyService.updateTourneyAndRounds(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.unBlockDocument() );
    }

    private unBlockDocument(): void {
        this.blockedDocument = false;
    }

    private prepareEmptyRound(i: number): Round {
        let roundId: number = this.tourneyService.getSequenceNumber();

        let r: Round = {
            id: roundId,
            name: "Girone." + (1 + i),
            type: RoundType.R,
            teams: [],
            onewayMeetings: [],
            roundtripMeetings: [],
            classification: [],
            matrix: null,
        };
        
        return r;
    }

    onPlayoffs4TeamsChange(cb: Combobox) {
        console.log(cb);
        this.selectedTourney.selectedTeams4PlayoffsCB = cb;

        let T: number = this.selectedTourney.selectedTeams4PlayoffsCB.value;

        this.playoffsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.playoffsCombobox.push(firstRow);

        let P = Math.floor( T * this.selectedTourney.rounds.length / 2 );

        if( P >= this.selectedTourney.selectedPlayoffsCB.value ) {
            for (let r=1; r <= P; r++ ) {
                let cb: Combobox = { label: "" + r, value: r };
                this.playoffsCombobox.push(cb);
            }         
        }
 
        this.turnOnWizardMode(4);
        this.selectedTourney.selectedPlayoffsCB = firstRow;
    }

    onPlayoffNumChange(cb: Combobox) {
        console.log(cb);

        this.blockDocument();

        this.preparePlayoffRules(cb);

        for(let p of this.selectedTourney.playoffs ) {
            this.meetingPlayoffService.createPlayoffMeeting(this.selectedTourney, p);
        }

        this.selectedTourney.selectedEliminatoryTeamsCB = {label: "", value: 0};

        this.updatePlayoffMeetings();
        this.turnOnWizardMode(4);
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
     * @param cb the selected combo box
     */
    private preparePlayoffRules(cb: Combobox) {
        this.selectedTourney.selectedPlayoffsCB = cb;
        let N = this.selectedTourney.rounds.length * this.selectedTourney.selectedTeams4PlayoffsCB.value;

        let p: Playoff = this.createPlayoff(1);

        let R = this.selectedTourney.rounds.length;
        let firstPosition: number = 1;
        let lastPosition: number = Math.floor(N / R);
        
        while (firstPosition < lastPosition) {
            for (let r = 0; r < R; r++) {
                let curretRound = this.selectedTourney.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, curretRound);
                p.playoffRules.push(pr1);
                let nr = (r + 1) % R;
                let nextRound = this.selectedTourney.rounds[nr];
                let pr2: PlayoffRule = this.prepareFromRound(lastPosition, nextRound);
                p.playoffRules.push(pr2);
            }
            firstPosition++;
            lastPosition--;
        }
        if (firstPosition == lastPosition) {
            for (let r = 0; r < R; r++) {
                let round = this.selectedTourney.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, round);
                p.playoffRules.push(pr1);
            }
        }
        let teamsModPlayoff: number = N % R;
        lastPosition = Math.ceil(N / R);
        for (let r = 0; r < teamsModPlayoff; r++) {
            let round = this.selectedTourney.rounds[r];
            let pr: PlayoffRule = this.prepareFromRound(lastPosition, round);
            p.playoffRules.push(pr);
        }

        this.spawnGeneratedRules(N, p.playoffRules);
    }

    /**
     * Copies the generated rules from the received rule list to the set of 
     * requested playoffs
     * 
     * @param N number of teams to pass the phase
     * @param playoffRules the list of rules
     */
    private spawnGeneratedRules(N: number, playoffRules: PlayoffRule[]) : void {
        this.resetPlayoffMeetings();

        let P: number = this.selectedTourney.selectedPlayoffsCB.value;
        let coupleNo = 2 * P;
        let chunksInteger = Math.floor(N / coupleNo);
        let chunksNo = Math.floor(chunksInteger * coupleNo);
        
        let r = 0;

        let poCounter = 0;
        for (r = 0; r < chunksNo; r += 2) {
            let rule = playoffRules[r];

            if(this.selectedTourney.playoffs.length <= poCounter) {
                let p: Playoff = this.createPlayoff(r/2);
                this.selectedTourney.playoffs.push(p);    
            }
            this.selectedTourney.playoffs[poCounter].playoffRules.push(rule);

            rule = playoffRules[r + 1];
            this.selectedTourney.playoffs[poCounter].playoffRules.push(rule);

            poCounter = (poCounter + 1) % P;
        }
        for (; r < N; r++) {
            let rule = playoffRules[r];
            if(this.selectedTourney.playoffs.length <= poCounter) {
                let p: Playoff = this.createPlayoff(r);
                this.selectedTourney.playoffs.push(p);    
            }
            this.selectedTourney.playoffs[poCounter].playoffRules.push(rule);
            poCounter = (poCounter + 1) % P;
        }

        this.playoffRows = this.selectedTourney.playoffs;
        for (let p of this.playoffRows) {
            let r: Round = p.round;
            p.playoffName = r.name;
        }
    }

    private resetPlayoffMeetings() {
        let tvo: TourneyVO = this.prepareTourneyVOForPlayoff(true);
        // this.tourneyService.updateTourneyDeletePlayoffMeetings(tvo);
    }

    private prepareTourneyVOForPlayoff(cleanPlayoffs: boolean) {
        this.cleanPlayoffMeetings(cleanPlayoffs);
        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        return tvo;
    }

    private cleanPlayoffMeetings(cleanPlayoffs: boolean) {
        for (let p of this.selectedTourney.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        if (cleanPlayoffs) {
            this.selectedTourney.playoffs = [];
            this.playoffRows = [];
        }
        if(this.containsEliminatory()) {
            this.cleanEliminatoryMeetings(cleanPlayoffs);
        }
    }

    private resetEliminatoryMeetings() {        
        // this.meetingRoundService.deleteEliminatoryMeetingsByTourneyId(this.selectedTourney.id);
        this.selectedTourney.selectedEliminatoryTeamsCB = { label: "", value: 0 };

        // let tvo : TourneyVO = this.prepareTourneyVOForEliminatory(true);
        this.cleanEliminatoryMeetings(true);
        // this.tourneyService.updateTourneyDeleteEliminatoryMeetings(tvo);
    }
    
    private prepareTourneyVOForEliminatory(cleanEliminatory : boolean ): TourneyVO {
        this.cleanEliminatoryMeetings(cleanEliminatory);

        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };

        return tvo;
    }

    private cleanEliminatoryMeetings(cleanEliminatory: boolean) {
        for (let el of this.selectedTourney.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        if (cleanEliminatory) {
            for (let el of this.selectedTourney.eliminatoryLevels) {
                el.eliminatories = [];
            }
            this.selectedTourney.eliminatoryLevels = [];
            this.eliminatoryLevelRows = [];
        }
    }

    onPlayoffRowSelect(event) {
        this.tourneyService.selectedPlayoff = event.data;
        this.router.navigate([REDIRECT_PLAYOFF_DV]);
    }

    private createPlayoff(i: number): Playoff {
        let po: Playoff = {
            id: this.tourneyService.getSequenceNumber()
          , round:{id: this.tourneyService.getSequenceNumber()
              , name: "Playoff."+ (1 + i)
              , type: RoundType.P
              , teams:[]
              , onewayMeetings: []
              , roundtripMeetings: []
              , classification: []
            }
          , playoffRules: []
        };
        return po;
    }

    private prepareFromRound(pos: number, round: Round): PlayoffRule {
        let posCB:     Combobox    = { label: "" + pos + "°", value: pos };
        let roundCB:   Combobox    = { label: round.name, value: round.id };
        let fromRound: FromRound   = { id: round.id, position: posCB, round: roundCB };
        let pr:        PlayoffRule = { id: pos, fromRound: fromRound };
        return pr;
    }    
    
    onEliminatoryLevelRowSelect(event) {
        console.log("Entering onEliminatoryLevelRowSelect()");
        console.log(event);
        this.levelService.onEliminatoryLevelRowSelect(event);
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

    onRoundtripPlayoffClick() {
        console.log("Entering onRoundtripPlayoffClick()");
        this.selectedTourney.isOnewayPlayoff = "false";
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
    
    onAllMatchesClick() {
        this.selectedTourney.isAllMatches = "true";
    }
    onBestOfClick() {
        this.selectedTourney.isAllMatches = "false";
    }

    onRoundPhaseChange(event) {
        console.log("Entering onRoundPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.R);
        if(event) {
            this.prepareRoundsCombobox();
        }
    }

    onPlayoffPhaseChange(event) {
        console.log("Entering onPlayoffPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.P);
        if(event) {
            this.preparePlayoffsCombobox();
        }
    }

    onEliminatoryPhaseChange(event) {
        console.log("Entering onEliminatoryPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.E);
        if(event) {
            this.prepareEliminatoryCombobox();
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

    onSpinnerChange(event) {
        let spin = this.selectedTourney.maxMatchesPerMeeting;
        
        if(spin == 1 || spin == 2) {
            this.allMatchesEnabled = false;
        } else {
            this.allMatchesEnabled = true;
        }

        this.bestOffWinner = spin;
    }

    private doSave(): void {
        console.log("Entering doSave()");

        let tvo: TourneyVO = this.prepareTourneyVO();
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.saveComplete());
    }

    private saveComplete(): void {
        console.log("Entering saveComplete()");
        if( !this.onSaveTourneyError ) {
            this.playerService.newPlayer = false;
            this.gotoListView();
        }
    }

    prevTab(): void {
        this.selectedTourney.selectedTabIndex--;
        this.selectedTourney.selectedTabIndex = this.selectedTourney.selectedTabIndex < 0 ? 0 : this.selectedTourney.selectedTabIndex;
        this.makeButtonLabel();
    }

    nextTab(): void {
        console.log("Entering nextTab()");

        if( !this.isInWizardMode() ) {
            this.doSave();
            return;
        }
        
        this.rewind  = false;
        if( this.selectedTourney.selectedTabIndex >= this.maxBoundaryTabIndex ) {
            this.rewind = true;
        }

        if( this.levelService.isStandAlone(this.selectedTourney) ) {
            if( this.selectedTourney.selectedTabIndex == 2 ) {
                this.levelService.loadEliminatoryMeetings(() => this.standAloneComplete());
                return;
            }
        }

        let tvo: TourneyVO = this.cloneTourneyVO(this.rewind);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.saveTourneyNext(tvo), e => this.subscribeErrorHandler(e), () => this.nextSaveComplete(this.rewind));
    }

    private standAloneComplete():  void {
        this.eliminatoryLevelRows = this.levelService.eliminatoryLevelRows;
        if( this.selectedTourney.selectedTabIndex == 3 ) {
            this.saveEliminatoryMeetings();
        }
        let tvo: TourneyVO = this.cloneTourneyVO(this.rewind);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.saveTourneyNext(tvo), e => this.subscribeErrorHandler(e), () => this.nextSaveComplete(this.rewind));
    }

    private saveEliminatoryMeetings() {
        for (let el of this.selectedTourney.eliminatoryLevels) {
            for( let elim of el.eliminatories ) {
                for (let m of elim.round.onewayMeetings) {
                    let observer = this.meetingRoundService.saveEliminatoryMeetingDb(m, this.selectedTourney.id, elim.id);
                    observer.subscribe(n => this.meetingRoundService.saveMeetingNext(n, m));
                }
                for (let m of elim.round.roundtripMeetings) {
                    let observer = this.meetingRoundService.saveEliminatoryMeetingDb(m, this.selectedTourney.id, elim.id);
                    observer.subscribe(n => this.meetingRoundService.saveMeetingNext(n, m));
                }
            }
        }
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

        this.selectedTourney.selectedTabIndex++;
        this.selectedTourney.wizardModeIndex = this.selectedTourney.selectedTabIndex > this.selectedTourney.wizardModeIndex 
            ? this.selectedTourney.wizardModeIndex++ 
            : this.selectedTourney.wizardModeIndex;
    }
 
    private updatePlayoffMeetings() {

        let playoffsMeetings : MeetingDb [] = [];
        for (let p of this.selectedTourney.playoffs) {
            for (let m of p.round.onewayMeetings) {
                let mdb = this.meetingRoundService.preparePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
                playoffsMeetings.push(mdb);
            }
            for (let m of p.round.roundtripMeetings) {
                let mdb = this.meetingRoundService.preparePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
                playoffsMeetings.push(mdb);
            }
        }

        let tvo: TourneyVO = this.prepareTourneyVOForPlayoff(false);
        tvo.mdbs = playoffsMeetings;
        const subscriber = this.tourneyService.updateTourneyAndPlayoffs(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.unBlockDocument() );
    }

    private cloneTourneyVO(rewind : boolean) : TourneyVO {
        this.tourneyAlreadyExists = false;
        this.onSaveTourneyError = false;

        this.clearTourneyMeetings();

        let tmp = this.cloneObject(this.selectedTourney);
        if( rewind ) {
            tmp.selectedTabIndex = 0;
            tmp.wizardModeIndex = -1;
        } else {
            tmp.selectedTabIndex++;
            tmp.wizardModeIndex = tmp.selectedTabIndex;
        }
        
        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(tmp)
        };
        return tvo;
    }

    private prepareTourneyVO() : TourneyVO {
        this.tourneyAlreadyExists = false;
        this.onSaveTourneyError = false;

        this.clearTourneyMeetings();

        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        return tvo;
    }

    /**
     * Clears tourney local meetings array before create che JSON string to save on the Back End
     */
    private clearTourneyMeetings() {
        if( this.isInWizardMode() ) {
            return;
        }
        for (let r of this.selectedTourney.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }
        for (let p of this.selectedTourney.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        for (let el of this.selectedTourney.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
    }

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");

            this.onSaveTourneyError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

    private saveTourneyErrorHandler<T> (operation = 'operation', result?: T): any {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveTourneyError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            if( res.error.errorCode == "TourneyAlreadyExists" ) {
                this.tourneyAlreadyExists = true;
                return of(result as T);
            }
      
            return of(result as T);
        };
    }

    private gotoListView() {
        this.tourneyService.newTourney = false;
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }

    goBack() {
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

    enableSaveButton() : string {
        let n : String = this.selectedTourney.tourneyName;
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
        let disabled = this.selectedTourney.selectedPlayoffsCB.value == 0 
            || this.selectedTourney.selectedTeams4PlayoffsCB.value == 0;
        return disabled ? "disabled" : "";        
    }

    eliminatoryButtonDisabled() : string {
        return this.selectedTourney.selectedEliminatoryTeamsCB.value <= 0 ? "disabled" : "";        
    }

    onError(n:any) {
        let msgerr : string;
        msgerr = 'Creazione/Modifica nuovo torneo fallita';

        console.error(msgerr);
    }
}


