import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { PhaseType, EliminatoryMode, AccessMode, TourneyType, TeamSortType, Direction, RoundType } from '../../../domain/enumerations';
import { Message } from 'app/components/common/api';
import { Tourney } from 'app/tourneyonline/domain/tourney';
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

const REDIRECT_TEAM_DV      = 'admintourney/dv/team';
const REDIRECT_ADD_TEAM_DV  = 'admintourney/dv/addteam';

const REDIRECT_ROUND_DV     = 'admintourney/dv/round';
const REDIRECT_PLAYOFF_DV   = 'admintourney/dv/playoff';

@Component({
    templateUrl: './tourney-detailview.html',
})
export class TourneyDetailView extends AbstractDetailView {

    selectedTourney: Tourney;

    tourneyDate: Date;

    msgs: Message[] = [];

    tourneyFormGroup: FormGroup;

    submitted: boolean;

    disciplines: Discipline[];

    gender: string = "tourney";

    fullAddress: string;

    isOnewayRound: string;
    isOnewayPlayoff: string;
    isAllMatches: string;
    isDaily: string;
    allMatchesEnabled: boolean = true;
    bestOffWinner: number;

    activeIndex: number;

    selectedTeam: Team;

    teamCols: TableCols[];
    tourneyTeams: Team[];

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
    selectedTeam4roundsNumCombobox: Combobox;    
    roundsCombobox: Combobox[];
    selectedRoundsNumCombobox: Combobox;

    atLeastTwoRounds: boolean;
    playoffsCombobox: Combobox[];
    selectedTeam4playoffsNumCombobox: Combobox;
    selectedPlayoffsNumCombobox: Combobox;
    team4playoffsCombobox: Combobox[];
    
    constructor(
        private fb: FormBuilder,
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
        this.activeIndex = this.tourneyService.selectedTabIndex;

        super.ngOnInit();
        this.levelService.ngOnInit();

        this.teamsCombobox = this.levelService.teamsCombobox;

        this.eliminatoryCols = this.levelService.cols;
        this.eliminatoryRows = this.levelService.rows;

        let today = new Date();

        this.tourneyService.loadDisciplines().subscribe(t => {
            this.disciplines = t;
        });

        this.selectedTourney = this.tourneyService.selectedTourney;

        if(this.tourneyService.newTourney) {
            this.initTourney(today);
        } else {
            this.tourneyDate = new Date(this.selectedTourney.datetime);
        }

        this.atLeastTwoTeams = this.selectedTourney.teams.length >= 2 ? true : false;
        this.prepareRounds();
        this.atLeastTwoRounds = this.selectedTourney.rounds.length >= 2 ? true : false;

        this.preparePlayoffd();

        this.tourneyTeams = this.selectedTourney.teams;

        this.teamCols = TeamService.cols;

        this.isOnewayRound   = this.selectedTourney.isOnewayRound   ? "true" : "false";
        this.isOnewayPlayoff = this.selectedTourney.isOnewayPlayoff ? "true" : "false";

        this.isAllMatches    = this.selectedTourney.isAllMatches ? "true" : "false";
        this.isDaily         = this.selectedTourney.isDaily      ? "true" : "false";

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

        
        this.tourneyFormGroup = this.fb.group({
            'tourneyName': new FormControl(this.selectedTourney.tourneyName, Validators.compose([Validators.required])),
            'isDaily': new FormControl(this.isDaily),

            'address': new FormControl(this.selectedTourney.address, Validators.compose([Validators.required])),
            'country': new FormControl(this.selectedTourney.country),

            'tourneyDate': new FormControl(this.tourneyDate),
            'access': new FormControl(this.selectedTourney.access),

            'discipline': new FormControl(this.selectedTourney.discipline),

            'tourneyType': new FormControl(this.selectedTourney.tourneyType),
            'raceDuration': new FormControl(this.selectedTourney.raceDuration),
            
            'pointsNeededToWin': new FormControl(this.selectedTourney.pointsNeededToWin),
            
            'matchWinnerScores': new FormControl(this.selectedTourney.matchWinnerScores),
            'matchBalanceScores': new FormControl(this.selectedTourney.matchBalanceScores),

            'pointsGoldenGoalTieBreakWin': new FormControl(this.selectedTourney.pointsGoldenGoalTieBreakWin),
            'pointsGoldenGoalTieBreakDefeat': new FormControl(this.selectedTourney.pointsGoldenGoalTieBreakDefeat),

            'phases': new FormControl(this.selectedTourney.phases, Validators.compose([Validators.required])),

            'isOnewayRound': new FormControl(this.isOnewayRound),
            'isOnewayPlayoff': new FormControl(this.isOnewayPlayoff),

            'maxMatchesPerMeeting': new FormControl(this.selectedTourney.maxMatchesPerMeeting),
            'isAllMatches': new FormControl(this.isAllMatches),
            'playersPerTeam': new FormControl(this.selectedTourney.playersPerTeam),

            'selectedTeamsNumCombobox': new FormControl(this.selectedTeamsNumCombobox),
            'selectedTeam4roundsNumCombobox': new FormControl(this.selectedTeam4roundsNumCombobox),
            'selectedRoundsNumCombobox': new FormControl(this.selectedRoundsNumCombobox),

            'selectedTeam4playoffsNumCombobox': new FormControl(this.selectedTeam4playoffsNumCombobox),
            'selectedPlayoffsNumCombobox': new FormControl(this.selectedPlayoffsNumCombobox),
    
        });
    }
    
    private initTourney(today: Date) {
        this.selectedTourney = {};
        this.selectedTourney.id = this.tourneyService.getSequenceNumber();
        this.tourneyDate = today;
        this.selectedTourney.tourneyName = "";
        this.selectedTourney.isDaily = true;
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
        this.selectedTourney.players = [];
        this.selectedTourney.playoffs = [];
        this.selectedTourney.pointsNeededToWin = 9;
        this.selectedTourney.pointsGoldenGoalTieBreakWin = 2;
        this.selectedTourney.pointsGoldenGoalTieBreakDefeat = 1;
        this.selectedTourney.maxMatchesPerMeeting = 1;
        this.selectedTourney.isAllMatches = false;
        this.selectedTourney.playersPerTeam = 1;
        this.selectedTourney.phases = [PhaseType.R];
        this.selectedTourney.phases.push(PhaseType.E);
        this.selectedTourney.eliminatoryMode = EliminatoryMode.A;
        this.selectedTourney.teamSortType = TeamSortType.O;
        this.selectedTourney.isOnewayRound = true;
        this.selectedTourney.isOnewayPlayoff = true;
    }

    private prepareRounds(): void {
        if( !this.atLeastOnePhase) {
            return;
        }

        this.team4roundsCombobox = [];

        let N = this.selectedTourney.teams.length;
        for (let t=2; t<=N; t++) {
            let cb: Combobox = { label: "" + t, value: t };
            this.team4roundsCombobox.push(cb);
        } 

        if(this.selectedTeam4roundsNumCombobox == undefined) {
            if(this.selectedTourney.rounds.length > 0) {
                N = 0;
                for(let r of this.selectedTourney.rounds) {
                    N += r.teams.length;
                }
            }
            let cb: Combobox = { label: "" + N, value: N };
            this.selectedTeam4roundsNumCombobox = cb;
        }

        this.roundsCombobox = [];

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

    private preparePlayoffd(): void {
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

        if(this.selectedTeam4playoffsNumCombobox == undefined) {
            if(this.selectedTourney.playoffs.length > 0) {
                N = 0;
                for(let p of this.selectedTourney.playoffs) {
                    N += p.round.teams.length;
                }
            }
            let cb: Combobox = { label: "" + N, value: N };
            this.selectedTeam4playoffsNumCombobox = cb;
        }

        this.playoffsCombobox = [];

        let R: number = Math.floor(N/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.playoffsCombobox.push(cb);
        } 

        if(this.selectedPlayoffsNumCombobox == undefined) {
            if(this.selectedTourney.playoffs.length > 0) {
                R = this.selectedTourney.playoffs.length;
            }

            let cb: Combobox = { label: "" + R, value: R };
            this.selectedPlayoffsNumCombobox = cb;
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
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e) );
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

    onPlayoffRowSelect(event) {
        let playoff= event.data;
        this.tourneyService.onPlayoffRowSelect(playoff, REDIRECT_PLAYOFF_DV);
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
        this.selectedTeam4roundsNumCombobox = cb;

        let T: number = this.selectedTeam4roundsNumCombobox.value;

        this.roundsCombobox = [];
        let R = Math.floor(T/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.roundsCombobox.push(cb);
        } 
        
        cb = { label: "", value: 0 };
        this.selectedRoundsNumCombobox = cb;
    }

    onRoundNumChange(cb: Combobox) {
        console.log(cb);

        this.selectedRoundsNumCombobox = cb;
       
        let T = this.selectedTeam4roundsNumCombobox.value;
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

        for(let r of this.selectedTourney.rounds) {
            this.removeFromMeetings(r);
        }

        this.selectedTourney.rounds = [];
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
    
    private prepareRound(i: number, teamsPerRound: number, randomTeams: Team[]): Round {
        let start = i * teamsPerRound;
        let teams: Team[] = this.prepareRandomTeams(randomTeams, start, teamsPerRound);
        let roundId: number = this.tourneyService.getSequenceNumber();
        let meetings: Meeting[] = this.prepareMeetings(teams, roundId);
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

    private removeFromMeetings(round: Round): void {
        for(let m of round.meetings) {
            this.tourneyService.deleteMeeting(m);
        }
        round.meetings = [];    
    }

    private prepareRandomTeams(teamSlice: Team[], start: number, size: number): Team[] {
        let teams: Team[] = [];

        for(let i=start; i<start+size; i++) {
            teams.push(teamSlice[i]);
        }

        return teams;
    }

    private prepareMeetings(teamSlice: Team[], roundId: number): Meeting[] {
        let meetings: Meeting[] = [];

        for(let i=0; i<teamSlice.length; i++) {
            let t1 = teamSlice[i];
            for(let j=i+1; j<teamSlice.length; j++) {
                let t2 = teamSlice[j];
                let m: Meeting = this.addTeamToMeetings(t1, t2, roundId, Direction.OneWay);
                meetings.push(m);
                m = this.addTeamToMeetings(t2, t1, roundId, Direction.RoundTrip);
                meetings.push(m);
            }
        }

        return meetings;
    }

    private addTeamToMeetings(t1: Team, t2: Team, roundId: number, d: Direction): Meeting {
        let m = this.createMeeting(t1, t2, null, null, d);
        this.tourneyService.addRoundMeetingDb(m, this.selectedTourney.id, roundId);
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

    onTeam4playoffNumChange(cb: Combobox) {
        console.log(cb);
        this.selectedTeam4playoffsNumCombobox = cb;

        let T: number = this.selectedTeam4playoffsNumCombobox.value;

        this.playoffsCombobox = [];
        let R = Math.floor(T/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.playoffsCombobox.push(cb);
        } 
        
        cb = { label: "", value: 0 };
        this.selectedPlayoffsNumCombobox = cb;
    }

    onPlayoffNumChange(cb: Combobox) {
        console.log(cb);

        this.selectedPlayoffsNumCombobox = cb;
       
        let T = this.selectedTeam4playoffsNumCombobox.value;
        let R: number = this.selectedPlayoffsNumCombobox.value;

        let teamsPerPlayoff: number = Math.floor(T/R);
        let teamsModPlayoff: number = T % R;

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

        for(let r of this.selectedTourney.rounds) {
            this.removeFromMeetings(r);
        }

        this.selectedTourney.playoffs = [];
        for(let i=0; i<R; i++) {
            let p: Playoff = this.preparePlayoffRule(i, teamsPerPlayoff, randomTeams);
            this.selectedTourney.playoffs.push(p);
        }
        for(let r=0; r<teamsModPlayoff; r++) {
            let start = R * teamsPerPlayoff;
            let teams: Team[] = this.prepareRandomTeams(randomTeams, start, teamsPerPlayoff);
            for(let t of teams) {
                let p: Playoff = this.selectedTourney.playoffs[r];
                p.round.teams.push(t);
                let c: Classification = super.newClassification(t, 0);
                p.round.classification.push(c);
            }
        }

        this.roundRows = this.selectedTourney.rounds;
    }
    
    private preparePlayoffRule(i: number, teamsPerPlayoff: number, randomTeams: Team[]): Playoff {
        throw new Error("Method not implemented.");
    }

    onEliminatoryRowSelect(event) {
        this.levelService.selectedRow = this.eliminatorySelectedRow;
        this.levelService.onRowSelect(event);
    }
    onOnewayRoundClick() {
        console.log("Entering onOnewayRoundClick()");
        this.selectedTourney.isOnewayRound = true;
        this.onClickRoundManageMeeting(this.selectedTourney.rounds, true, null);
    }

    onRoundtripRoundClick() {
        console.log("Entering onRoundtripRoundClick()");
        this.selectedTourney.isOnewayRound = false;
        this.onClickRoundManageMeeting(this.selectedTourney.rounds, false, null);
    }
    
    onOnewayPlayoffClick() {
        console.log("Entering onOnewayPlayoffClick()");
        this.selectedTourney.isOnewayPlayoff = true;
        for(let po of this.selectedTourney.playoffs) {
            this.onClickRoundManageMeeting([po.round], true, po.id);
        }
    }

    onRoundtripPlayoffClick() {
        console.log("Entering onRoundtripPlayoffClick()");
        this.selectedTourney.isOnewayPlayoff = false;
        for(let po of this.selectedTourney.playoffs) {
            this.onClickRoundManageMeeting([po.round], false, po.id);
        }
    }
    
    private onClickRoundManageMeeting(rounds: Array<Round>, isOneway: boolean, poid: number): void {
        for(let r of rounds) {
            if(isOneway) {
                let newMeetings: Array<Meeting> = new Array<Meeting>();
                for(let m of r.meetings) {
                    if(m.direction == Direction.OneWay) {
                        newMeetings.push(m);
                    }
                    if(m.direction == Direction.RoundTrip) {
                        this.tourneyService.deleteMeeting(m);
                    }
                }
                r.meetings = newMeetings;
            } else {
                let newMeetings: Array<Meeting> = new Array<Meeting>();
                for(let m of r.meetings) {
                    let newMeeting: Meeting = this.cloneObject(m);
                    
                    newMeeting.id = this.tourneyService.getSequenceNumber();
                    newMeeting.direction = Direction.RoundTrip;
                    newMeeting.team2 = m.team1;
                    newMeeting.team1 = m.team2;

                    newMeeting.name = newMeeting.team1.teamName + " - " + newMeeting.team2.teamName;
                    
                    newMeetings.push(newMeeting);
                    if(poid == null) {
                        this.tourneyService.addRoundMeetingDb(newMeeting, this.selectedTourney.id, r.id);
                    } else {
                        this.tourneyService.addPlayoffMeetingDb(newMeeting, this.selectedTourney.id, poid);
                    }
                }

                r.meetings = r.meetings.concat(newMeetings);
            }
        }
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
    }

    onSpinnerChange(event) {
        let spin: number = this.tourneyFormGroup.get('maxMatchesPerMeeting').value;
        if(spin == 1) {
            this.allMatchesEnabled = false;
        } else {
            this.allMatchesEnabled = true;
        }

        this.bestOffWinner = spin % 2 == 0 ? (spin / 2) + 1 : Math.ceil(spin / 2);
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.selectedTourney.tourneyName = this.tourneyFormGroup.get('tourneyName').value;
        this.selectedTourney.isDaily   = this.tourneyFormGroup.get('isDaily').value == "true"? true: false;

        this.selectedTourney.address = this.tourneyFormGroup.get('address').value;
        this.selectedTourney.country = this.tourneyFormGroup.get('country').value;

        this.selectedTourney.access = this.tourneyFormGroup.get('access').value;

        this.tourneyDate = this.tourneyFormGroup.get('tourneyDate').value;
        this.selectedTourney.datetime = this.tourneyDate;

        this.selectedTourney.discipline = this.tourneyFormGroup.get('discipline').value;
        
        this.selectedTourney.tourneyType = this.tourneyFormGroup.get('tourneyType').value;
        this.selectedTourney.raceDuration = this.tourneyFormGroup.get('raceDuration').value;

        this.selectedTourney.pointsNeededToWin = this.tourneyFormGroup.get('pointsNeededToWin').value;

        this.selectedTourney.matchWinnerScores = this.tourneyFormGroup.get('matchWinnerScores').value;
        this.selectedTourney.matchBalanceScores = this.tourneyFormGroup.get('matchBalanceScores').value;

        this.selectedTourney.pointsGoldenGoalTieBreakWin = this.tourneyFormGroup.get('pointsGoldenGoalTieBreakWin').value;
        this.selectedTourney.pointsGoldenGoalTieBreakDefeat = this.tourneyFormGroup.get('pointsGoldenGoalTieBreakDefeat').value;

        this.selectedTourney.phases = this.tourneyFormGroup.get('phases').value;

        this.selectedTourney.isOnewayRound   = this.tourneyFormGroup.get('isOnewayRound').value == "true"? true: false;
        this.selectedTourney.isOnewayPlayoff = this.tourneyFormGroup.get('isOnewayPlayoff').value == "true"? true: false;

        this.selectedTourney.isAllMatches = this.tourneyFormGroup.get('isAllMatches').value == "true"? true: false;
        this.selectedTourney.maxMatchesPerMeeting = this.tourneyFormGroup.get('maxMatchesPerMeeting').value;
        this.selectedTourney.playersPerTeam = this.tourneyFormGroup.get('playersPerTeam').value;
        
        this.selectedTourney.teams = this.tourneyTeams;

        if(this.teamService.newTeam) {
            this.teamService.newTeam = false;
            this.selectedTourney.teams.push(this.selectedTeam);
        }

        // this.teamService.updateTeam(this.selectedTeam).subscribe(n => this.next(n), e => this.onError(e));

        for(let r of this.selectedTourney.rounds) {
            for(let m of r.meetings) {
                this.tourneyService.updateRoundMeetingDb(m, this.selectedTourney.id, r.id);
            }
        }

        for(let p of this.selectedTourney.playoffs) {
            for(let m of p.round.meetings) {
                this.tourneyService.updatePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
            }
        }


        if(this.tourneyService.newTourney) {
            this.tourneyService.addTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());  
        } else  {
            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
        }
        this.tourneyService.newTourney = false;
    }

    containsPhase(value: string) : boolean{
        let phases = this.tourneyFormGroup.get('phases').value;

        for(let i=0; i<phases.length; i++ ) {
            if(phases[i].toLowerCase().indexOf(value) == 0) {
                return true;
            }
        }
        return false;
    }

    atLeastOnePhase() : boolean{
        let phases = this.tourneyFormGroup.get('phases').value;

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
        let phases = this.tourneyFormGroup.get('phases').value;

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
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newTourney) {
            msgerr = 'Creazione nuovo torneo fallita';
        } else {
            msgerr = 'Modifica torneo fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
        this.tourneyService.newTourney = false;
    }
}
