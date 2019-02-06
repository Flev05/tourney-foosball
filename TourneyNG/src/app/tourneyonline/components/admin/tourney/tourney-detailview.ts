import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { PhaseType, EliminatoryMode, AccessMode, TourneyType, TeamSortType, Direction, RoundType } from '../../../domain/enumerations';
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
    incompleteConfiguration: boolean;

    meetingDaysMap: Map<number, Meeting[]>;

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

        this.tourneyService.loadDisciplines().subscribe(t => {
            this.disciplines = t;
        });

        if(this.tourneyService.newTourney) {
            this.initTourney();
        }

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.selectedTourney.datetime = new Date(this.selectedTourney.datetime);

        this.atLeastTwoTeams = this.selectedTourney.teams.length >= 2 ? true : false;
        this.teamCols = TeamService.cols;

        this.prepareRounds();

        this.preparePlayoffs();

        this.prepareEliminatory();

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
        
        this.roundsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.roundsCombobox.push(firstRow);

        let R: number = Math.floor(this.selectedTourney.teams.length/2);
        for (let r=1; r<=R; r++ ) {
            let cb: Combobox = { label: "" + r, value: r };
            this.roundsCombobox.push(cb);
        } 

        if(this.tourneyService.selectedTeams4RoundsCB == undefined) {
            if(this.selectedTourney.rounds.length > 0) {
                N = 0;
                for(let r of this.selectedTourney.rounds) {
                    N += r.teams.length;
                }
            }
            let cb: Combobox = { label: "" + N, value: N };
            this.tourneyService.selectedTeams4RoundsCB = cb;
        }

        if(this.tourneyService.selectedRoundsNumCB == undefined) {
            if(this.selectedTourney.rounds.length > 0) {
                R = this.selectedTourney.rounds.length;
            }

            let cb: Combobox = { label: "" + R, value: R };
            this.tourneyService.selectedRoundsNumCB = cb;
        }

        this.roundRows = this.selectedTourney.rounds;
        this.atLeastOneRound = this.selectedTourney.rounds.length >= 1 ? true : false;
    }

    private preparePlayoffs(): void {
        console.log("Entering preparePlayoffs()");

        if( !this.atLeastOneRound) {
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

        if(this.tourneyService.selectedTeams4PlayoffsCB == undefined) {
            N = 0;
            if(this.selectedTourney.rounds.length > 0) {
                N = this.selectedTourney.rounds[0].teams.length;
            }
            let cb: Combobox = { label: "" + N, value: N };
            this.tourneyService.selectedTeams4PlayoffsCB = cb;        
        }

        if(this.tourneyService.selectedPlayoffsCB == undefined) {
            R = 0;
            if(this.selectedTourney.playoffs.length > 0) {
                R = this.selectedTourney.playoffs.length;
            }

            let cb: Combobox = { label: "" + R, value: R };
            this.tourneyService.selectedPlayoffsCB = cb;
        }

        this.playoffRows = this.selectedTourney.playoffs;
        for(let p of this.playoffRows) {
            p.playoffName = p.round.name;
        }
    }

    private prepareEliminatory() {
        this.levelService.ngOnInit();
        this.eliminatoryCols = this.levelService.cols;
        this.eliminatoryRows = this.levelService.rows;
        this.teamsCombobox = this.levelService.teamsCombobox;
        this.incompleteConfiguration = this.levelService.incompleteConfiguration;
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
    
    onTeamEliminatoryNumChange(event) {
        console.log(event);

        this.levelService.selectedTeamsNumCombobox = event;
        this.levelService.onTeamEliminatoryNumChange(event);
        this.eliminatoryRows = this.levelService.rows;
    }

    onTeam4roundNumChange(cb: Combobox) {
        console.log(cb);
        this.tourneyService.selectedTeams4RoundsCB = cb;

        let T: number = this.tourneyService.selectedTeams4RoundsCB.value;

        this.roundsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.roundsCombobox.push(firstRow);

        let R = Math.floor(T / 2);       
        for (let r=1; r<=R; r++ ) {
            let ccb: Combobox = { label: "" + r, value: r };
            this.roundsCombobox.push(ccb);
        } 

        this.tourneyService.selectedRoundsNumCB = firstRow;
        this.resetRounds();
    }

    onRoundNumChange(cb: Combobox) {
        console.log(cb);

        this.tourneyService.selectedRoundsNumCB = cb;

        this.resetRounds();
       
        let T = this.tourneyService.selectedTeams4RoundsCB.value;
        let R: number = this.tourneyService.selectedRoundsNumCB.value;

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
            let teams: Team[] = this.prepareRandomTeams(randomTeams, start, 1);
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
        let meetings: Meeting[] = this.prepareRoundMeetings(teams);
        
        let meetingDaysMap = this.prepareMeetingDays(teams.length, meetings);

        meetings = [];
        for( let key of meetingDaysMap.keys() ) {
            let ms: Meeting[] = meetingDaysMap.get(key);
            for( let m of ms) {
                m.day = key;
                meetings.push(m);

                let rtm = this.cloneObject(m);
                rtm.team1 = m.team2;
                rtm.team2 = m.team1;
                rtm.direction = Direction.RoundTrip;
                meetings.push(rtm);
            }
        }

        let classifications: Classification[] = this.prepareClassification(teams);
        let r: Round = {
            id: roundId,
            name: "Girone." + (1 + i),
            type: RoundType.R,
            teams: teams,
            meetings: meetings,
            classification: classifications,
            matrix: null,
        };
        return r;
    }


    private prepareRoundMeetings(teamSlice: Team[]): Meeting[] {
        let meetings: Meeting[] = [];

        for(let i=0; i<teamSlice.length; i++) {
            let t1 = teamSlice[i];
            for(let j=i+1; j<teamSlice.length; j++) {
                let t2 = teamSlice[j];
                let m: Meeting = this.addTeamToMeetings(t1, t2, Direction.OneWay);
                meetings.push(m);
            }
        }

        return meetings;
    }

    private prepareRandomTeams(teamSlice: Team[], start: number, size: number): Team[] {
        let teams: Team[] = [];

        for(let i=start; i<start+size; i++) {
            teams.push(teamSlice[i]);
        }

        return teams;
    }

    private addTeamToMeetings(t1: Team, t2: Team, d: Direction): Meeting {
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
        this.tourneyService.selectedTeams4PlayoffsCB = cb;

        let T: number = this.tourneyService.selectedTeams4PlayoffsCB.value;

        this.playoffsCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.playoffsCombobox.push(firstRow);

        let P = Math.floor( T * this.selectedTourney.rounds.length / 2 );

        if( P >= this.tourneyService.selectedPlayoffsCB.value ) {
            for (let r=1; r <= P; r++ ) {
                let cb: Combobox = { label: "" + r, value: r };
                this.playoffsCombobox.push(cb);
            }         
        }
 
        this.resetPlayoff();
        this.tourneyService.selectedPlayoffsCB = firstRow;
    }

    onPlayoffNumChange(cb: Combobox) {
        console.log(cb);

        this.preparePlayoffRules(cb);

        this.preparePlayoffMeetings();
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
        this.tourneyService.selectedPlayoffsCB = cb;
        let N = this.selectedTourney.rounds.length * this.tourneyService.selectedTeams4PlayoffsCB.value;

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

        let P: number = this.tourneyService.selectedPlayoffsCB.value;
        let coupleNo = 2 * P;
        let chunksInteger = Math.floor(N / coupleNo);
        let chunksNo = Math.floor(chunksInteger * coupleNo);
        
        let r = 0;

        let poCounter = 0;
        for (r = 0; r < chunksNo; r += 2) {
            let rule = playoffRules[r];

            if(this.selectedTourney.playoffs.length <= poCounter) {
                let p: Playoff = this.createPlayoff(1);
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
                let p: Playoff = this.createPlayoff(1);
                this.selectedTourney.playoffs.push(p);    
            }
            this.selectedTourney.playoffs[poCounter].playoffRules.push(rule);
            poCounter = (poCounter + 1) % P;
        }
    }

    private preparePlayoffMeetings() {
        for (let p of this.selectedTourney.playoffs) {
            for (let i = 0; i < p.playoffRules.length; i++) {
                for (let j = i + 1; j < p.playoffRules.length; j++) {
                    let r1 = p.playoffRules[i];
                    let r2 = p.playoffRules[j];
                    let m: Meeting = this.createMeeting(null, null, r1, r2, Direction.OneWay);
                    p.round.meetings.push(m);
                }
            }
        }
        this.playoffRows = this.selectedTourney.playoffs;
        for (let p of this.playoffRows) {
            let r: Round = p.round;
            p.playoffName = r.name;

            let meetingDaysMap = this.prepareMeetingDays(p.playoffRules.length, r.meetings);
            r.meetings = [];

            for( let key of meetingDaysMap.keys() ) {
                let ms: Meeting[] = meetingDaysMap.get(key);
                for( let m of ms) {
                    m.day = key;
                    r.meetings.push(m);

                    let rtm = this.cloneObject(m);
                    rtm.rule1 = m.rule2;
                    rtm.rule2 = m.rule1;
                    rtm.direction = Direction.RoundTrip;
                    r.meetings.push(rtm);
                }
            }
        }
    }

    private prepareMeetingDays(teamsNo : number, meetings: Meeting[]): Map<number, Meeting[]> {
        let meetingDaysMap = new  Map<number, Meeting[]>();

        let meetingsToProcess: Meeting[] = [];
        for(let m of meetings) {
            if( m.direction == Direction.OneWay ) {
                meetingsToProcess.push(m);
            }
        }

        for(let md=1; md < teamsNo; md++) {

            let teamSet: string[] = [];
            let meetingsToRemove: Meeting[] = [];

            for(let m of meetingsToProcess) {
                let t1: string = teamSet.find(x => x == m.team1.teamName);
                let t2: string = teamSet.find(x => x == m.team2.teamName);
                if( t1 == undefined && t2 == undefined ) {
                    if( !meetingDaysMap.has(md) )  {
                        let emptyArray: Meeting[] = [];
                        meetingDaysMap.set(md, emptyArray);
                    }
                    let meetingsDays: Meeting[] = meetingDaysMap.get(md);
                    meetingsDays.push(m);
                    meetingsToRemove.push(m);

                    teamSet.push(m.team1.teamName);
                    teamSet.push(m.team2.teamName);
                }
            }

            for(let m of meetingsToRemove) {
                let index = meetingsToProcess.indexOf(m);
                meetingsToProcess.splice(index, 1);
            }
        }

        return meetingDaysMap;
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

    onSubmit() {
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

        this.tourneyService.saveTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => super.goBack());
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


