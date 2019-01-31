import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { PhaseType, EliminatoryMode, AccessMode, TourneyType, TeamSortType, Direction, RoundType } from '../../../domain/enumerations';
import { Discipline } from 'app/tourneyonline/domain/discipline';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
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

const REDIRECT_TEAM_DV      = 'admintourney/dv/team';
const REDIRECT_ADD_TEAM_DV  = 'admintourney/dv/addteam';

const REDIRECT_ROUND_DV     = 'admintourney/dv/round';
const REDIRECT_PLAYOFF_DV   = 'admintourney/dv/playoff';

@Component({
    templateUrl: './tourney-detailview.html',
})
export class TourneyDetailView extends AbstractDetailView {

    submitted: boolean;

    disciplines: Discipline[];

    gender: string = "tourney";

    fullAddress: string;

    allMatchesEnabled: boolean = true;
    bestOffWinner: number;

    activeIndex: number;

    selectedTeam: Team;

    teamCols: TableCols[];

    roundCols: TableCols[] = TourneyService.roundCols;
    roundRows: Round[];
    selectedRound: Round;

    playoffCols: TableCols[] = TourneyService.playoffCols;
    playoffRows: Playoff[];
    selectedPlayoff: Playoff;
    
    teamsCombobox: Combobox[];
    selectedTeamsNumCombobox: Combobox;
    eliminatoryMode: EliminatoryMode;
    eliminatoryCols: TableCols[];
    eliminatoryRows: any[];
    eliminatorySelectedRow: any;

    atLeastTwoTeams: boolean;
    team4roundsCombobox: Combobox[];
    selectedTeams4RoundsCB: Combobox;    
    roundsCombobox: Combobox[];
    selectedRoundsNumCombobox: Combobox;

    atLeastTwoRounds: boolean;
    playoffsCombobox: Combobox[];
    selectedTeams4PlayoffsCB: Combobox;
    selectedPlayoffsCB: Combobox;
    team4playoffsCombobox: Combobox[];
    incompleteConfiguration: boolean;
    
    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        protected playerService: PlayerService,
        protected teamService: TeamService,
        protected levelService: LevelService,
        private router: Router 
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TourneyDetailView.ngOnInit() ");
        
        super.ngOnInit();

        this.activeIndex = this.tourneyService.selectedTabIndex;

        this.eliminatoryCols = this.levelService.cols;
        this.eliminatoryRows = this.levelService.rows;

        this.tourneyService.loadDisciplines().subscribe(t => {
            this.disciplines = t;
        });

        if(this.tourneyService.newTourney) {
            this.initTourney();
        }

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.selectedTourney.datetime = new Date(this.selectedTourney.datetime);

        this.atLeastTwoTeams = this.selectedTourney.teams.length >= 2 ? true : false;
        this.prepareRounds();
        this.atLeastTwoRounds = this.selectedTourney.rounds.length >= 2 ? true : false;

        this.preparePlayoffs();

        this.levelService.ngOnInit();

        this.teamsCombobox = this.levelService.teamsCombobox;
        this.incompleteConfiguration = this.levelService.incompleteConfiguration;

        this.teamCols = TeamService.cols;

        if(this.selectedTourney.country != undefined ) {
            this.fullAddress = this.selectedTourney.address + " - " 
                + this.selectedTourney.country.zipCode + " " + this.selectedTourney.country.city
                + " (" + this.selectedTourney.country.provinceCode +")";
        }

        if(this.selectedTourney.maxMatchesPerMeeting == 1) {
            this.allMatchesEnabled = false;
        }

        let spin = this.selectedTourney.maxMatchesPerMeeting;
        this.bestOffWinner = spin % 2 == 0 ? (spin / 2) + 1 : Math.ceil(spin / 2);
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
        this.selectedTourney.playoffs = [];
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
        this.selectedTourney.phases.push(PhaseType.E);
        this.selectedTourney.eliminatoryMode = EliminatoryMode.A;
        this.selectedTourney.teamSortType = TeamSortType.O;
        this.selectedTourney.isOnewayRound = "true";
        this.selectedTourney.isOnewayPlayoff = "true";
        this.activeIndex = 0;
        this.selectedTourney.meetingsForDelete = []
        this.selectedTourney.selectedTeamsNumCombobox = {label: "", value: 0};

        this.tourneyService.selectedTourney = this.selectedTourney;
    
        this.tourneyService.newTourney = false;
    }

    private prepareRounds(): void {
        console.log("Entering prepareRounds()");

        if( !this.atLeastOnePhase) {
            return;
        }

        this.team4roundsCombobox = [];

        let N = this.selectedTourney.teams.length;
        for (let t=2; t<=N; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.team4roundsCombobox.push(cb);
        } 

        if(this.selectedTeams4RoundsCB == undefined) {
            if(this.selectedTourney.rounds.length > 0) {
                N = 0;
                for(let r of this.selectedTourney.rounds) {
                    N += r.teams.length;
                }
            }
            let cb: Combobox = { label: "" + N, value: N };
            this.selectedTeams4RoundsCB = cb;
        }

        this.roundsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.roundsCombobox.push(firstRow);

        let R: number = Math.floor(this.selectedTourney.teams.length/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.roundsCombobox.push(cb);
        } 

        if(this.selectedRoundsNumCombobox == undefined) {
            if(this.selectedTourney.rounds.length > 0) {
                R = this.selectedTourney.rounds.length;
            }

            let cb: Combobox = { label: "" + R, value: R };
            this.selectedRoundsNumCombobox = cb;
        }

        this.roundRows = this.selectedTourney.rounds;
    }

    private preparePlayoffs(): void {
        console.log("Entering preparePlayoffs()");

        if( !this.atLeastTwoRounds) {
            return;
        }
                
        let N = 0;
        for(let r of this.selectedTourney.rounds) {
            N += r.teams.length;
        }
        
        this.team4playoffsCombobox = [];
        for (let t=2; t<=N; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.team4playoffsCombobox.push(cb);
        } 

        this.playoffsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.playoffsCombobox.push(firstRow);

        let R: number = Math.floor(N/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.playoffsCombobox.push(cb);
        } 

        if(this.selectedTeams4PlayoffsCB == undefined) {
            N = 0;
            if(this.selectedTourney.playoffs.length > 0) {
                for(let p of this.selectedTourney.playoffs) {
                    N += p.playoffRules.length;
                }
            }
            let cb: Combobox = { label: "" + N, value: N };
            this.selectedTeams4PlayoffsCB = cb;
        }

        if(this.selectedPlayoffsCB == undefined) {
            R = 0;
            if(this.selectedTourney.playoffs.length > 0) {
                R = this.selectedTourney.playoffs.length;
            }

            let cb: Combobox = { label: "" + R, value: R };
            this.selectedPlayoffsCB = cb;
        }

        this.playoffRows = this.selectedTourney.playoffs;
        for(let p of this.playoffRows) {
            p.playoffName = p.round.name;
        }
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.activeIndex = index;
        this.tourneyService.selectedTabIndex = this.activeIndex;
        
        if(index==2) {
        }
    }

    addTeams() {
        this.teamService.loadAllTeams().subscribe(t => this.teamService.teamPool = t, e => this.onError(e), () => this.onComplete());
    }

    private onComplete(): void {
        this.router.navigate([REDIRECT_ADD_TEAM_DV]);
    }

    onTeamRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedTeam;

        this.router.navigate([REDIRECT_TEAM_DV]);
    }

    doTeamDelete(team: Team) {
        console.log("doTeamDelete(" + team.teamName+")");
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName + "?";

        if(confirm(popup)) {
            let index: number = this.selectedTourney.teams.indexOf(team);
            if(index > -1) {
                this.selectedTourney.teams.splice(index, 1);
                this.teamService.deleteTeam(team).subscribe(n => this.next(n), e => this.onError(e) );
            }
        }
    }
    
    onRoundRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.router.navigate([REDIRECT_ROUND_DV]);
    }

    doRoundDelete(round: Round) {
        this.tourneyService.doRoundDelete(round);
    }

    addRound() {
        this.tourneyService.newRound = true;
        this.tourneyService.selectedIndex = 0;
        this.router.navigate([REDIRECT_ROUND_DV]);
    }

    doPlayoffDelete(playoff: Playoff) {
        this.tourneyService.doPlayoffDelete(playoff);
    }

    addPlayoff() {
        this.tourneyService.selectedIndex = 0;
        this.router.navigate([REDIRECT_PLAYOFF_DV]);
    }
    
    onTeamNumChange(event) {
        console.log(event);

        this.levelService.selectedTeamsNumCombobox = event;
        this.levelService.onTeamNumChange(event);
        this.eliminatoryRows = this.levelService.rows;
    }

    onTeam4roundNumChange(cb: Combobox) {
        console.log(cb);
        this.selectedTeams4RoundsCB = cb;

        let T: number = this.selectedTeams4RoundsCB.value;

        this.roundsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.roundsCombobox.push(firstRow);

        let R = Math.floor(T/2);       
        for (let r=1; r<=R; r++ ) {
            let ccb: Combobox = { label: "" + r, value: r };
            this.roundsCombobox.push(ccb);
        } 

        this.selectedRoundsNumCombobox = firstRow;
        this.resetRounds();
    }

    onRoundNumChange(cb: Combobox) {
        console.log(cb);

        this.selectedRoundsNumCombobox = cb;

        this.resetRounds();
       
        let T = this.selectedTeams4RoundsCB.value;
        let R: number = this.selectedRoundsNumCombobox.value;

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
            let teams: Team[] = this.prepareRandomTeams(randomTeams, start, teamsPerRound);
            for(let t of teams) {
                let round: Round = this.selectedTourney.rounds[r];
                round.teams.push(t);
                let c: Classification = super.newClassification(t, 0);
                round.classification.push(c);
            }
        }

        this.roundRows = this.selectedTourney.rounds;
    }
    
    private resetRounds() {
        for (let r of this.selectedTourney.rounds) {
            this.markMeetingsForDelete(r);
            r.meetings = [];
        }
        this.selectedTourney.rounds = [];
        this.roundRows = this.selectedTourney.rounds;
    }

    private prepareRound(i: number, teamsPerRound: number, randomTeams: Team[]): Round {
        let start = i * teamsPerRound;
        let teams: Team[] = this.prepareRandomTeams(randomTeams, start, teamsPerRound);
        let roundId: number = this.tourneyService.getSequenceNumber();
        let meetings: MeetingDb[] = this.prepareMeetings(teams, roundId);
        let classifications: Classification[] = this.prepareClassification(teams);
        let r: Round = {
            id: roundId,
            name: "GIRONE." + (1 + i),
            type: RoundType.R,
            teams: teams,
            meetings: meetings,
            classification: classifications,
            matrix: null
        };
        return r;
    }

    private prepareRandomTeams(teamSlice: Team[], start: number, size: number): Team[] {
        let teams: Team[] = [];

        for(let i=start; i<start+size; i++) {
            teams.push(teamSlice[i]);
        }

        return teams;
    }

    private prepareMeetings(teamSlice: Team[], roundId: number): MeetingDb[] {
        let meetings: MeetingDb[] = [];

        for(let i=0; i<teamSlice.length; i++) {
            let t1 = teamSlice[i];
            for(let j=i+1; j<teamSlice.length; j++) {
                let t2 = teamSlice[j];
                let m: MeetingDb = this.addTeamToMeetings(t1, t2, Direction.OneWay);
                meetings.push(m);
                m = this.addTeamToMeetings(t2, t1, Direction.RoundTrip);
                meetings.push(m);
            }
        }

        return meetings;
    }

    private addTeamToMeetings(t1: Team, t2: Team, d: Direction): MeetingDb {
        let m = this.createMeeting(t1, t2, null, null, d);
        return m;
    }

    private prepareClassification(randomTeams: Team[]): Classification[] {
        let classifications: Classification[] = [];

        for(let t of randomTeams) {
            let c: Classification = super.newClassification(t, 0);
            c.team = t;
            classifications.push(c);
        }
        return classifications;
    }

    onTeams4PlayoffsChange(cb: Combobox) {
        console.log(cb);
        this.selectedTeams4PlayoffsCB = cb;

        let T: number = this.selectedTeams4PlayoffsCB.value;

        this.playoffsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.playoffsCombobox.push(firstRow);

        let R = Math.floor( T / 2 );
        R = R < this.selectedTourney.rounds.length ? R : this.selectedTourney.rounds.length;

        if( R >= this.selectedPlayoffsCB.value) {
            for (let r=1; r <= R; r++ ) {
                let cb: Combobox = { label: "" + r, value: r };
                this.playoffsCombobox.push(cb);
            }         
        }
 
        this.resetPlayoff();
        this.selectedPlayoffsCB = firstRow;
    }

    onPlayoffNumChange(cb: Combobox) {
        console.log(cb);

        this.selectedPlayoffsCB = cb;

        this.resetPlayoff();
       
        let N = this.selectedTeams4PlayoffsCB.value;
        let P: number = this.selectedPlayoffsCB.value;

        for(let i=0; i < P; i++) {
            let p: Playoff = this.createPlayoff(i);
            this.selectedTourney.playoffs.push(p);
        }

        let R = this.selectedTourney.rounds.length;
        
        let firstPosition: number = 1;
        let lastPosition:  number = Math.floor(N / R); 
        
        let poCounter = 0;
        while( firstPosition < lastPosition) {
            for(let r=0; r < R; r++) {
                let curretRound = this.selectedTourney.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, curretRound);
                this.selectedTourney.playoffs[poCounter].playoffRules.push(pr1);

                let nr = (r + 1) % R;
                let nextRound = this.selectedTourney.rounds[ nr ];
                let pr2: PlayoffRule = this.prepareFromRound(lastPosition,  nextRound);
                
                this.selectedTourney.playoffs[poCounter].playoffRules.push(pr2);

                poCounter = (poCounter + 1) % P;
            }

            firstPosition++;
            lastPosition--;
        }
        if( firstPosition == lastPosition ) {
            for(let r=0; r < R; r++) {
                let round = this.selectedTourney.rounds[r];
                let pr1: PlayoffRule = this.prepareFromRound(firstPosition, round);
                this.selectedTourney.playoffs[poCounter].playoffRules.push(pr1);

                poCounter = (poCounter + 1) % P;
            }
        }

        let teamsModPlayoff: number = N % R;
        lastPosition = Math.ceil(N / R); 
        for(let r=0; r < teamsModPlayoff; r++) {
            let round = this.selectedTourney.rounds[r];
            let pr: PlayoffRule = this.prepareFromRound(lastPosition, round);
            this.selectedTourney.playoffs[poCounter].playoffRules.push(pr);

            poCounter = (poCounter + 1) % P;
        }

        for(let p of this.selectedTourney.playoffs) {
            for(let i=0; i<p.playoffRules.length; i++ ) {
                for(let j=i+1; j<p.playoffRules.length; j++ ) {
                    let r1 = p.playoffRules[i];
                    let r2 = p.playoffRules[j];

                    let m: MeetingDb =  this.createMeeting(null, null, r1, r2, Direction.OneWay);
                    p.round.meetings.push(m);
            
                    m  =  this.createMeeting(null, null, r2, r1, Direction.RoundTrip);
                    p.round.meetings.push(m);
                }
            }
        }

        this.playoffRows = this.selectedTourney.playoffs;
        for(let p of this.playoffRows) {
            p.playoffName = p.round.name;
        }
    }

    private resetPlayoff() {
        for (let p of this.selectedTourney.playoffs) {
            this.markMeetingsForDelete(p.round);
            p.round.meetings = [];
        }
        this.selectedTourney.playoffs = [];
        this.playoffRows = [];
    }

    onPlayoffRowSelect(event) {
        this.tourneyService.selectedPlayoff = event.data;
        this.router.navigate([REDIRECT_PLAYOFF_DV]);
    }

    private markMeetingsForDelete(round: Round): any {
        for(let m of round.meetings) {
            if(m.id != null) {
                this.selectedTourney.meetingsForDelete.push(m);
            }
        }
    }

    private createPlayoff(i: number): Playoff {
        let po: Playoff = {
            id:this.tourneyService.getSequenceNumber()
          , round:{id: this.tourneyService.getSequenceNumber()
              , name: "Playoff."+ (1 + i)
              , type: RoundType.P
              , teams:[]
              , meetings: []
              , classification: []
            }
          , playoffRules: []
        };
        return po;
    }

    private prepareFromRound(pos: number, round: Round): PlayoffRule {
        let posCB:     Combobox  = { label: "" + pos + "°", value: pos };
        let roundCB:   Combobox  = { label: round.name, value: round.id };
        let fromRound: FromRound = { id: round.id, position: posCB, round: roundCB };
        let pr: PlayoffRule = { id: pos, fromRound: fromRound };
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
            this.selectedTourney.phases.push(pp);
        } else {
            let indexOf = this.selectedTourney.phases.indexOf(pp);
            if (indexOf != -1) {
                this.selectedTourney.phases.splice(indexOf, 1);
            }
        }
    }

    onSpinnerChange(event) {
        let spin = this.selectedTourney.maxMatchesPerMeeting;
        
        if(spin == 1) {
            this.allMatchesEnabled = false;
        } else {
            this.allMatchesEnabled = true;
        }

        this.bestOffWinner = spin % 2 == 0 ? (spin / 2) + 1 : Math.ceil(spin / 2);
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.tourneyService.deleteUnusedMeetings(this.selectedTourney.meetingsForDelete);

        for(let r of this.selectedTourney.rounds) {
            for(let m of r.meetings) {
                this.tourneyService.saveRoundMeetingDb(m, this.selectedTourney.id, r.id);
            }
        }

        for(let p of this.selectedTourney.playoffs) {
            for(let m of p.round.meetings) {
                this.tourneyService.savePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
            }
        }

        for(let el of this.selectedTourney.eliminatoryLevels) {
            for(let e of el.eliminatories) {
                for(let m of e.round.meetings) {
                    this.tourneyService.saveEliminatoryMeetingDb(m, this.selectedTourney.id, e.id);
                }
            }
        }

        this.tourneyService.saveTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    goBack() {
        let popup = 'Sicuro di NON dover salvare niente?';

        if(confirm(popup)) {
            super.goBack();
        }    
    }

    containsPhase(value: string) : boolean{
        for(let i=0; i<this.selectedTourney.phases.length; i++ ) {
            if(this.selectedTourney.phases[i].toLowerCase().indexOf(value) == 0) {
                return true;
            }
        }
        return false;
    }

    atLeastOnePhase() : boolean{
        let phases = this.selectedTourney.phases;

        if(this.containsPhase(PhaseType.R)) {
            return true;
        }
        if(this.containsPhase(PhaseType.P)) {
            return true;
        }
        if(this.containsPhase(PhaseType.E)) {
            return true;
        }

        return false;
    }

    notAllowedPhases(): boolean {
        let phases = this.selectedTourney.phases;

        if(!this.containsPhase(PhaseType.R) 
            && this.containsPhase(PhaseType.P)
            && this.containsPhase(PhaseType.E)) 
        {
            return true;
        }
        if(!this.containsPhase(PhaseType.R) 
            && this.containsPhase(PhaseType.P)
            && !this.containsPhase(PhaseType.E)) 
        {
            return true;
        }

        return false;
    }

    onError(n:any) {
        let msgerr : string;
        msgerr = 'Creazione/Modifica nuovo torneo fallita';

        console.error(msgerr);
    }
}


