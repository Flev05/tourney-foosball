import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { PhaseType, EliminatoryMode, AccessMode, TourneyType, TeamSortType,  RoundType } from '../../../domain/enumerations';
import { Discipline } from 'app/tourneyonline/domain/discipline';
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
import { Classification } from 'app/tourneyonline/domain/classification';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { FromRound } from 'app/tourneyonline/domain/from-round';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Player } from 'app/tourneyonline/domain/player';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { MeetingRoundService } from '../round/meeting-round-service';
import { MeetingPlayoffService } from '../playoff/meeting-playoff-service';

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
    
    disciplines: Discipline[];
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
    
    teamsCombobox: Combobox[];
    eliminatoryMode: EliminatoryMode;
    eliminatoryCols: TableCols[];
    eliminatoryRows: any[];
    eliminatorySelectedRow: any;

    atLeastTwoTeams: boolean;
    team4roundsCombobox: Combobox[];
    roundsCombobox: Combobox[];

    atLeastOneRound: boolean;
    playoffsCombobox: Combobox[];
    team4playoffsCombobox: Combobox[];
    incompleteEliminatoryConfiguration: boolean;

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
    nextButtonClass: string = "fa fa-arrow-right";

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
        protected disciplineService: DisciplineService,
        private router: Router 
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TourneyDetailView.ngOnInit() ");
        
        super.ngOnInit();

        this.alignTourney();

        if(this.tourneyService.newTourney) {
            this.initTourney();
        }

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.selectedTourney.datetime = new Date(this.selectedTourney.datetime);

        this.atLeastTwoTeams = this.selectedTourney.teams.length >= 2 ? true : false;
        this.teamCols = TeamService.cols;

        if(this.selectedTourney.maxMatchesPerMeeting <= 2) {
            this.allMatchesEnabled = false;
        }

        let spin = this.selectedTourney.maxMatchesPerMeeting;
        this.bestOffWinner = spin % 2 == 0 ? (spin / 2) + 1 : Math.ceil(spin / 2);

        this.teamLabel = this.selectedTourney.teams.length == 0 ? "Aggiungi squadre" : "Gestisci Squadre";

        this.refreshTabsAndButtons();
    }

    private initTourney() {
        this.selectedTourney = {};

        this.selectedTourney.id = null;
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
        this.selectedTourney.isAllMatches = "false";
        this.selectedTourney.playersPerTeam = 1;
        this.selectedTourney.phases = [PhaseType.R];
        this.selectedTourney.eliminatoryMode = EliminatoryMode.A;
        this.selectedTourney.teamSortType = TeamSortType.O;
        this.selectedTourney.isOnewayRound = "true";
        this.selectedTourney.isOnewayPlayoff = "true";
                
        this.selectedTourney.selectedTeamsNumCombobox = {label: "", value: 0};
        this.selectedTourney.discipline = {id:0, name: "", description: ""};

        this.tourneyService.selectedTourney = this.selectedTourney;    

        this.selectedTourney.selectedTabIndex = 0;
        this.selectedTourney.saveButtonEnabled = false;
        this.roundTabEnabled = false;
        this.playoffTabEnabled = false;
        this.teamTabEnabled = false;
        this.eliminatoryTabEnabled = false;
        this.selectedTourney.selectedTeams4PlayoffsCB = {label: "", value: 0};
        this.selectedTourney.selectedPlayoffsCB       = {label: "", value: 0};
        this.selectedTourney.selectedRoundsNumCB      = {label: "", value: 0};
    }

    private refreshTabsAndButtons(): any {
        this.modeTabEnabled = this.selectedTourney.saveButtonEnabled || this.selectedTourney.selectedTabIndex >= 1 ? true : false
        this.teamTabEnabled = this.selectedTourney.saveButtonEnabled || this.selectedTourney.selectedTabIndex >= 2 ? true : false

        this.makeButtonLabel();

        this.roundTabEnabled = this.selectedTourney.saveButtonEnabled || this.selectedTourney.selectedTabIndex >= 3 ? true : false;
        if(this.containsRound() && this.roundTabEnabled ) {
            this.prepareRounds();
        }

        this.playoffTabEnabled = this.selectedTourney.saveButtonEnabled || this.selectedTourney.selectedTabIndex >= 4 ? true : false; 
        if( this.containsPlayoff() && this.playoffTabEnabled) {
            this.preparePlayoffs();
        }

        let eliminatoryIndex = this.getEliminatoryIndex();
        this.eliminatoryTabEnabled = this.selectedTourney.saveButtonEnabled || this.selectedTourney.selectedTabIndex >= eliminatoryIndex ? true : false;

        if( this.containsEliminatory() && this.eliminatoryTabEnabled ) {
            this.prepareEliminatory();
        }
    }

    private getEliminatoryIndex() {
        let eliminatoryIndex = 3;
        if (this.containsRound()) {
            if (this.containsPlayoff()) {
                eliminatoryIndex = 5;
            }
            else {
                eliminatoryIndex = 4;
            }
        }
        return eliminatoryIndex;
    }

    private makeButtonLabel() {

        let lastTabIndex = this.getLastTabIndex();

        if (this.selectedTourney.selectedTabIndex == lastTabIndex) {
            this.nextButtonLabel = "Fine";
            this.nextButtonClass = "fa fa-save";
        }
        else {
            this.nextButtonLabel = "Avanti";
            this.nextButtonClass = "fa fa-arrow-right";
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
            }
        }
        return lastTabIndex;
    }

    private alignTourney(): any {
        this.disciplineService.loadAllDisciplines().subscribe(t => {this.disciplines = t;}
            , (error) => this.onError(error)
            , ()=>this.onLoadDisciplineComplete());

        this.teamService.loadAllTeams(()=>this.onLoadTeamComplete());
    }

    private onLoadTeamComplete(): void {
        this.playerService.loadAllPlayers(()=>this.onLoadPlayerComplete());

        this.alignTeams();
    }
    
    private alignTeams(): any {
        for( let team of this.selectedTourney.teams ) {
            let teamFound = this.teamService.teamPool.find( t => t.teamName == team.teamName );
            if( teamFound != undefined ) {
                team = this.copyTeam(team, teamFound);
            }
        }
    }
    
    private onLoadPlayerComplete(): void {
        for( let team of this.selectedTourney.teams ) {
            for( let player of team.players ) {
                let playerFound = this.playerService.playerPool.find( p => p.playerName == player.playerName );
                if( playerFound != undefined ) {
                    player = this.copyPlayer(player, playerFound);
                }
            }
        }
    }

    private copyPlayer(player:  Player, pf:  Player):  Player {
        player.id = pf.id;
        player.country = pf.country;
        player.address = pf.address;
        player.email = pf.email;
        player.phoneNumber = pf.phoneNumber;
        return player;
    }

    private copyTeam(team: Team, teamFound: Team): Team    {     
        team.id = teamFound.id;
        team.address = teamFound.address;
        team.country = teamFound.country;
        return team;
    }
    
    private onLoadDisciplineComplete() {
        this.disciplineOptions = [];
        for( let d of this.disciplines ) {
            let cb : Combobox = {label: d.name, value: d.id};
            this.disciplineOptions.push(cb);
        }

        if( this.selectedTourney != undefined ) {
            this.selectedDiscipline = {label: this.selectedTourney.discipline.name, value: this.selectedTourney.discipline.id};
        }
    }


    private prepareRounds(): void {
        console.log("Entering prepareRounds()");

        if( !this.containsRound() ) {
            return;
        }

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

    private preparePlayoffs(): void {
        console.log("Entering preparePlayoffs()");

        if( !this.containsPlayoff() ) {
            return;
        }
        if( this.selectedTourney.selectedTabIndex <= 3 ) {
            return;
        }
        
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

    private prepareEliminatory() {
        if( !this.containsEliminatory() ) {
            return;
        }

        let eliminatoryIndex = this.getEliminatoryIndex();
        if( !this.selectedTourney.saveButtonEnabled && this.selectedTourney.selectedTabIndex == eliminatoryIndex ) {
            return;
        }

        this.levelService.ngOnInit();
        this.eliminatoryCols = this.levelService.cols;
        this.eliminatoryRows = this.levelService.rows;
        this.teamsCombobox   = this.levelService.teamsCombobox;
        this.incompleteEliminatoryConfiguration = this.levelService.incompleteEliminatoryConfiguration;
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);

        this.selectedTourney.selectedTabIndex = index; 
        this.makeButtonLabel();
    }

    addTeams() {

        let tvo: TourneyVO = this.saveTourney();

        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () => this.onComplete());
    }

    private onComplete(): void {
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
 
    onTeamEliminatoryNumChange(event) {
        console.log(event);

        this.levelService.selectedTeamsNumCombobox = event;
        this.levelService.onTeamEliminatoryNumChange(event);
        this.eliminatoryRows = this.levelService.rows;
    }
    
    onDisciplineChange(cb: Combobox) {
        console.log(cb);

        this.selectedTourney.discipline.name = cb.label;
        this.selectedTourney.discipline.id = cb.value;
    }

    onRoundNumChange(cb: Combobox) {
        console.log(cb);

        this.selectedTourney.selectedRoundsNumCB = cb;

        this.resetRounds();
       
        let T = this.selectedTourney.teams.length;
        let R: number = this.selectedTourney.selectedRoundsNumCB.value;

        let teamsPerRound: number = Math.floor(T/R);
        let teamsModRound: number = T % R;

        let randomTeams: Team[] = [];

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

        for(let i=0; i<R; i++) {
            let r: Round = this.prepareRound(i, teamsPerRound, randomTeams);
            this.selectedTourney.rounds.push(r);
        }
        for(let r=0; r<teamsModRound; r++) {
            let start = R * teamsPerRound;
            let teams: Team[] = this.cutoffTeams(randomTeams, start, 1);
            for(let t of teams) {
                let round: Round = this.selectedTourney.rounds[r];
                round.teams.push(t);
                let c: Classification = this.tourneyService.newClassification(t, 0);
                round.classification.push(c);
            }
        }

        this.roundRows = this.selectedTourney.rounds;
    }
    
    private resetRounds() {
        this.meetingRoundService.deleteMeetingByRoundId(this.selectedTourney.id);

        for (let r of this.selectedTourney.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }

        this.selectedTourney.rounds = [];
        this.roundRows = this.selectedTourney.rounds;
    }

    private prepareRound(i: number, teamsPerRound: number, randomTeams: Team[]): Round {
        let start = i * teamsPerRound;
        let teams: Team[] = this.cutoffTeams(randomTeams, start, teamsPerRound);
        let roundId: number = this.tourneyService.getSequenceNumber();

        let classifications: Classification[] = this.prepareClassification(teams);
        let r: Round = {
            id: roundId,
            name: "Girone." + (1 + i),
            type: RoundType.R,
            teams: teams,
            onewayMeetings: [],
            roundtripMeetings: [],
            classification: classifications,
            matrix: null,
        };

        this.meetingRoundService.createRoundMeeting(this.selectedTourney, r);
        
        return r;
    }

    private cutoffTeams(teamSlice: Team[], start: number, size: number): Team[] {
        let teams: Team[] = [];

        for(let i=start; i<start+size; i++) {
            teams.push(teamSlice[i]);
        }

        return teams;
    }

    private prepareClassification(randomTeams: Team[]): Classification[] {
        let classifications: Classification[] = [];

        for(let t of randomTeams) {
            let c: Classification = this.tourneyService.newClassification(t, 0);
            c.team = t;
            classifications.push(c);
        }
        return classifications;
    }

    onTeams4PlayoffsChange(cb: Combobox) {
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
 
        this.resetPlayoff();
        this.selectedTourney.selectedPlayoffsCB = firstRow;
    }

    onPlayoffNumChange(cb: Combobox) {
        console.log(cb);

        this.preparePlayoffRules(cb);

        for(let p of this.selectedTourney.playoffs ) {
            this.meetingPlayoffService.createPlayoffMeeting(this.selectedTourney, p);
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
        this.resetPlayoff();

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

    private resetPlayoff() {
        this.meetingPlayoffService.deleteMeetingByPlayoffId(this.selectedTourney.id);

        for (let p of this.selectedTourney.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }

        this.selectedTourney.playoffs = [];
        this.playoffRows = [];
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
    
    onEliminatoryRowSelect(event) {
        this.levelService.onRowSelect(event.data);
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
    }

    onPlayoffPhaseChange(event) {
        console.log("Entering onPlayoffPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.P);
    }

    onEliminatoryPhaseChange(event) {
        console.log("Entering onEliminatoryPhaseChange()");
        console.log(event);
        this.updatePhases(event, PhaseType.E);
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

        this.bestOffWinner = spin % 2 == 0 ? (spin / 2) + 1 : Math.ceil(spin / 2);
    }

    onSubmit() {
        let tvo: TourneyVO = this.saveTourney();

        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
    }

    prevTab() {
        this.selectedTourney.selectedTabIndex = this.selectedTourney.selectedTabIndex > 0 ? this.selectedTourney.selectedTabIndex-1 : 0;
        this.makeButtonLabel();
    }

    nextTab() {
        
        this.selectedTourney.selectedTabIndex++;
        
        let lastTabIndex = this.getLastTabIndex();
        if( this.selectedTourney.selectedTabIndex > lastTabIndex ) {
            this.selectedTourney.saveButtonEnabled = true;
            this.selectedTourney.selectedTabIndex = 0;
        }

        let tvo: TourneyVO = this.saveTourney();

        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.saveTourneyNext(tvo), e => this.subscribeErrorHandler(e), () => this.onNextSaveComplete());
    }

    private saveTourneyNext(tvo: TourneyVO) {
        console.log("saveTourneyNext()");
        console.log(tvo);
        this.selectedTourney.id = tvo.id;
    }

    private onSaveComplete() {
        console.log("Entering onSaveComplete()");
        if( !this.onSaveTourneyError ) {
            this.playerService.newPlayer = false;
            this.gotoListView();
        }
    }

    private onNextSaveComplete(): void {
        console.log("Entering onNextSaveComplete()");
        if( this.onSaveTourneyError ) {
            this.selectedTourney.selectedTabIndex--;
            return;
        }

        this.tourneyService.newTourney = false;

        if( this.selectedTourney.selectedTabIndex == 0 ) {
            this.gotoListView();
            return;
        }

        this.refreshTabsAndButtons();
    }

    private saveTourney() {
        this.onSaveTourneyError = false;
        
        if (this.tourneyService.containsPhase(PhaseType.R) && this.selectedTourney.selectedTabIndex > 2 ) {
            for (let r of this.selectedTourney.rounds) {
                for (let m of r.onewayMeetings) {
                    let observer = this.meetingRoundService.saveRoundMeetingDb(m, this.selectedTourney.id, r.id);
                    observer.subscribe( n => this.saveMeetingNext(n, m));
                }
                for (let m of r.roundtripMeetings) {
                    let observer = this.meetingRoundService.saveRoundMeetingDb(m, this.selectedTourney.id, r.id);
                    observer.subscribe( n => this.saveMeetingNext(n, m));
                }
            }
        }

        if (this.tourneyService.containsPhase(PhaseType.P) && this.atLeastOneRound && this.selectedTourney.selectedTabIndex > 3 ) {
            for (let p of this.selectedTourney.playoffs) {
                for (let m of p.round.onewayMeetings) {
                    let observer = this.meetingRoundService.savePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
                    observer.subscribe( n => this.saveMeetingNext(n, m));
                }
                for (let m of p.round.roundtripMeetings) {
                    let observer = this.meetingRoundService.savePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
                    observer.subscribe( n => this.saveMeetingNext(n, m));
                }
            }
        }
        
        if (this.tourneyService.containsPhase(PhaseType.E)) {

            let eliminatoryIndex = this.getEliminatoryIndex();

            if( this.selectedTourney.selectedTabIndex == eliminatoryIndex ) {
                for (let el of this.selectedTourney.eliminatoryLevels) {
                    for (let e of el.eliminatories) {
                        for (let m of e.round.onewayMeetings) {
                            let observer = this.meetingRoundService.saveEliminatoryMeetingDb(m, this.selectedTourney.id, e.id);
                            observer.subscribe( n => this.saveMeetingNext(n, m));
                        }
                        for (let m of e.round.roundtripMeetings) {
                            let observer = this.meetingRoundService.saveEliminatoryMeetingDb(m, this.selectedTourney.id, e.id);
                            observer.subscribe( n => this.saveMeetingNext(n, m));
                        }
                    }
                }
            }
        }

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

    private saveMeetingNext(n:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(n);
        m.id = n.id;
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

    private saveTourneyErrorHandler<T> (operation = 'operation', result?: T) {
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
        return this.selectedTourney.rounds.length < 1 ? "disabled" : "";        
    }

    playoffButtonDisabled() : string {
        return this.selectedTourney.playoffs.length < 1 ? "disabled" : "";        
    }

    onError(n:any) {
        let msgerr : string;
        msgerr = 'Creazione/Modifica nuovo torneo fallita';

        console.error(msgerr);
    }
}


