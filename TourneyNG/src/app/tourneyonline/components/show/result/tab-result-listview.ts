import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { MeetingDetailView } from './meeting-detailview';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { AbstractListView } from '../../common/abstract-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Team } from 'app/tourneyonline/domain/team';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';

const REDIRECT_TOURNEY_LV        = 'showtourney/';
const REDIRECT_ROUND_RESULT_LV   = 'result/lv/round';
const REDIRECT_PLAYOFF_RESULT_LV = 'result/lv/playoff';
const REDIRECT_ELIMINATORY       = 'result/lv/eliminatoryLv/dv';

@Component({
    templateUrl: './tab-result-listview.html'
})
export class TabResultListView extends AbstractListView {
    cols: TableCols[] ;

    roundCols: TableCols[] = TourneyService.roundCols;
    roundRows: Round[];
    roundCount: number;
    selectedRound: Round;

    playoffCols: TableCols[] = TourneyService.playoffCols;
    playoffRows: Playoff[];
    playoffCount: number;
    selectedPlayoff: Playoff;
    mdbList: MeetingDb[];
    selectedTabIndex: number = 0;
    eliminatoryCount: number;

    eliminatoryLevelCols: TableCols[];
    eliminatoryLevelRows: EliminatoryLevelVO[];

    constructor(
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
        private meetingRoundService: MeetingRoundService,
        private meetingPlayoffService: MeetingPlayoffService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe,
        private levelService: LevelService
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.tourneyService.selectedEliminatoryLevelIndex = -1;
        this.tourneyService.selectedEliminatoryIndex = -1;

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.roundCount = 0;
        if(super.containsRound()) {
            this.roundRows = this.selectedTourney.rounds;
            this.roundCount = this.roundRows.length;

            let roundIds: number[] = [];
            for(let round of this.selectedTourney.rounds) {
                roundIds.push(round.id);
            }
            const subsbr = this.meetingRoundService.loadRoundMeetings(this.selectedTourney.id, roundIds);
            subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onRoundCompleteLoad());            
        }
    }
    
    private onRoundCompleteLoad(): void {
        for(let round of this.selectedTourney.rounds) { 
            this.meetingRoundService.extractRoundMeetings(round, this.mdbList);
            let allMeetings = round.onewayMeetings.concat(round.roundtripMeetings);
            round.classification = this.tourneyService.createClassification(allMeetings);
        }

        this.playoffCount = 0;
        if(super.containsPlayoff()) {
            this.playoffRows = this.selectedTourney.playoffs;
            this.playoffCount = this.playoffRows.length;

            let playoffIds: number[] = [];
            for(let p of this.selectedTourney.playoffs) {
                playoffIds.push(p.id);
            }
            
            const subsbr = this.meetingPlayoffService.loadPlayoffMeetings(this.selectedTourney.id, playoffIds);
            subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onPlayoffCompleteLoad());
        } else {
            this.prepareEliminatoryLevels();
        }
    }

    private prepareEliminatoryLevels() {
        if( !this.containsEliminatory() ) {
            return;
        }
            
        this.levelService.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
        this.levelService.ngOnInit();
        this.levelService.prepareEliminatoryLevelsGui();
        this.eliminatoryLevelCols = this.levelService.eliminatoryLevelCols;
        this.eliminatoryLevelRows = this.levelService.eliminatoryLevelRows;
        this.eliminatoryCount = this.eliminatoryLevelRows.length;
    }

    private onPlayoffCompleteLoad() {
        for(let playoff of this.selectedTourney.playoffs) { 
            this.meetingPlayoffService.extractPlayoffMeetings(playoff, this.mdbList);
    
            if( this.selectedTourney.isPlayoffAutoGen == "true") {
                this.resolveAutomaticTeams(playoff);
                this.resolveAutomaticMeetings(playoff, this.selectedTourney.rounds);
            } else {
                this.resolveManualTeams(playoff);
                this.resolveManualMeetings(playoff, this.selectedTourney.rounds);
            }
    
            let allMeetings = playoff.round.onewayMeetings.concat(playoff.round.roundtripMeetings);
            playoff.round.classification = this.tourneyService.createClassification(allMeetings);
        }
        this.prepareEliminatoryLevels();
    }
 
    /**
     * Called every time at meeting reload in the automatic mode configuration,
     * resolves the playoff rules to their corresponding 
     * qualified teams from the tourney rounds
     */
    private resolveAutomaticTeams(playoff: Playoff) {
        let roundMatrix: Array<Array<Classification>> = this.tourneyService.createRoundMatrix(this.selectedTourney.rounds);
        playoff.round.teams = [];

        for(let r=0; r<playoff.playoffRules.length; r++) {
            const pr: PlayoffRule = playoff.playoffRules[r];
            if( pr.isDummy ) {
                continue;
            }
            let row  = pr.fromRound.bandPosition;
            let col  = pr.fromRound.position.value;
            let team = roundMatrix[row-1][col-1].team;

            playoff.round.teams.push(team);
        }
    }

    /**
     * Called every time at meeting reload in the automatic mode configuration,
     * resolves the team names in the both oneway and rountrip meeting list applying
     * the corresponding rule present in the meeting
     */
    private resolveAutomaticMeetings(playoff: Playoff, rounds: Round[]) {
        for( let m of playoff.round.onewayMeetings ) {
            this.resolveAutomaticRules( m, rounds);
        }

        for( let m of playoff.round.roundtripMeetings ) {
            this.resolveAutomaticRules( m, rounds);
        }
    }

    /**
     * Resolves, for the automatic playoff mode, the team names of the received meeting and round list applying the rule in the same meeting
     * 
     * @param m the meeting the name to resolve with
     * @param rounds the list of the rounds from which take the round names
     */
    private resolveAutomaticRules( m: Meeting, rounds: Round[]): void {
        m.dateAndTime = this.dfp.transform(m.datetime, false);
        let roundMatrix: Array<Array<Classification>> = this.tourneyService.createRoundMatrix(this.selectedTourney.rounds);

        let t1: Team = null;
        if( m.isDummy ) {
            t1 = {id: this.tourneyService.getSequenceNumber(), teamName: m.rule1.fromRound.round.label, isDummy:true, ruleName: m.rule1.ruleName };
        } else {
            let row  = m.rule1.fromRound.bandPosition;
            let col  = m.rule1.fromRound.position.value;
            t1 = roundMatrix[row-1][col-1].team;
        }
        m.team1 = t1;
        m.teamName1 = m.team1.teamName;
        m.ruleName1 = m.rule1.ruleName;

        let t2: Team = null;
        if( m.isDummy ) {
            t2 = {id: this.tourneyService.getSequenceNumber(), teamName: m.rule2.fromRound.round.label, isDummy:true, ruleName: m.rule2.ruleName };
        } else {
            let row  = m.rule2.fromRound.bandPosition;
            let col  = m.rule2.fromRound.position.value;
            t2 = roundMatrix[row-1][col-1].team;
        }
        m.team2 = t2;
        m.teamName2 = m.team2.teamName;
        m.ruleName2 = m.rule2.ruleName;
    }

    /**
     * Called every time at meeting reload, it resolves the playoff rules to their corresponding 
     * qualified teams from the tourney rounds
     */
    private resolveManualTeams(playoff : Playoff): void {
        playoff.round.teams = [];

        for( let rule of playoff.playoffRules ) {
            let position:  number = rule.fromRound.position.value;
            let roundName: string = rule.fromRound.round.label;

            let round = this.selectedTourney.rounds.find( r => r.name == roundName );
            if( round != undefined ) {
                if( round.classification.length > 0 ) {
                    let c: Classification = round.classification[position-1];
    
                    let team = c.team;
                    team.ruleName = rule.fromRound.position.label + " " + roundName;
                    playoff.round.teams.push(team);
                }
            }
        }
    }

    /**
     * Resolves the team names in the both oneway and rountrip meeting list applying
     * the the corresponding rule present in the meeting
     */
    private resolveManualMeetings(playoff : Playoff, rounds: Round[]): void {
        for( let m of playoff.round.onewayMeetings ) {
            this.resolveManualRules( m, rounds);
        }

        for( let m of playoff.round.roundtripMeetings ) {
            this.resolveManualRules( m, rounds);
        }
    }
    
    /**
     * Resolves the team names of the received meeting and round list applying the rule in the same meeting
     * 
     * @param m the meeting the name to resolve with
     * @param rounds the list of the rounds from which take the round names
     */
    private resolveManualRules( m: Meeting, rounds: Round[]): void {
        m.dateAndTime = this.dfp.transform(m.datetime, false);

        let t1: Team = null;
        if( m.isDummy ) {
            t1 = {id: this.tourneyService.getSequenceNumber(), teamName:m.rule1.fromRound.round.label, isDummy:true, ruleName: m.rule1.ruleName };
        } else {
            t1 = this.findTeam(m.rule1, rounds);
        }
        m.team1 = t1;
        m.teamName1 = m.team1.teamName;
        m.ruleName1 = m.rule1.ruleName;

        let t2: Team = null;
        if( m.isDummy ) {
            t2 = {id: this.tourneyService.getSequenceNumber(), teamName:m.rule2.fromRound.round.label, isDummy:true, ruleName: m.rule2.ruleName };
        } else {
            t2 = this.findTeam(m.rule2, rounds);
        }
        m.team2 = t2;
        m.teamName2 = m.team2.teamName;
        m.ruleName2 = m.rule2.ruleName;
    }

    /**
     * Finds the team corresponding to the received rule
     * 
     * @param rule the playoff rule to associate to the qualified team
     */
    private findTeam(rule: PlayoffRule, rounds: Round[]): Team {

        let position:  number = rule.fromRound.position.value;
        let roundName: string = rule.fromRound.round.label;

        let round = rounds.find( r => r.name == roundName );
        if( round != undefined ) {
            if( round.classification.length > 0 ) {
                let c: Classification = round.classification[position-1];
                let team = c.team;
                console.log("Resolved Team is " + team);
                return team;
            }
        }        
        return null;
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);

        this.selectedTourney.selectedResultTabIndex = index;
    }

    protected prepareRoundsGui(rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            row = this.prepareRoundPlayoffMeetingGui(null, round, rows, row, classificationMap);
        }

        return rows;
    }

    protected preparePlayoffGui(playoffs: Playoff[]): any[] {
        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let p of playoffs) {
            row = this.prepareRoundPlayoffMeetingGui(p, p.round, rows, row, classificationMap);
        }

        return rows;
    }

    /**
        <th>N°</th>
        <th>Squadra 1</th>
        <th>Squadra 2</th>
        <th>Pt.1</th>
        <th>Pt.2</th>

        <td>{{rowData.roundNo}}</td>                
        <td>{{rowData.teamName1}}</td>
        <td>{{rowData.teamName2}}</td>
        <td>{{rowData.points1}}</td>
        <td>{{rowData.points2}}</td>        
     * @param rounds 
     */
    private prepareRoundPlayoffMeetingGui(p: Playoff, round: Round, rows: any[], row: number, classificationMap: Map<string, Classification>) {
        
        this.cols = this.levelService.prepareResultRoundPlayoffColums();

        let rowNumber : number=0;

        for (let m of round.onewayMeetings) {
            rows.push(m);

            rowNumber++;
            rows[row].id = m.id;
            rows[row].dateAndTime = this.dfp.transform(m.datetime);
            rows[row].rowNumber = rowNumber;
            rows[row].roundtrip = round.direction == Direction.OneWay ? "A" : "R";
            rows[row].roundId = round.id;
            rows[row].eliminatoryId = 0;    
            rows[row].playoffId = 0;
            if(p!=null) {
                rows[row].playoffId = p.id;
            }
            rows[row].roundName = round.name;
            rows[row].teamName1 = m.team1.teamName;
            rows[row].teamName2 = m.team2.teamName;
            rows[row].points1 = m.points1;
            rows[row].points2 = m.points2;

            rows[row].goals1 = 0;
            rows[row].goals2 = 0;
            for(let ma of m.matches) {
                rows[row].goals1 += ma.score1;
                rows[row].goals2 += ma.score2;
            }

            let currentKey = round.name;
            if (!classificationMap.has(currentKey)) {
                let len = round.onewayMeetings.length;
                classificationMap.set(currentKey, m);
                rows[row].rowspanSize = len;
            } else {
                rows[row].rowspanSize = undefined;
            }
            row++;
        }
        return row;
    }

    onRoundRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.meetingService.selectedMeetingDb = {id: null
            , tourneyId: this.selectedTourney.id
            , roundId: this.selectedRound.id
            , playoffId: null
            , eliminatoryId: null
        };     
        this.router.navigate([REDIRECT_ROUND_RESULT_LV]);
    }

    onPlayoffRowSelect(event) {
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.meetingService.selectedMeetingDb = {
              id: null
            , tourneyId: this.selectedTourney.id
            , roundId: null
            , playoffId: this.selectedPlayoff.id
            , eliminatoryId: null
        };     
        this.router.navigate([REDIRECT_PLAYOFF_RESULT_LV]);
    }
    
    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.levelService.onEliminatoryLevelRowSelect(event, REDIRECT_ELIMINATORY);
    }

    goBack(): void {        
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }
}

