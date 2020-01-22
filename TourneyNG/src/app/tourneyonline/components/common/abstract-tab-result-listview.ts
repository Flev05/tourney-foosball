import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { AbstractListView } from './abstract-listview';
import { MeetingRoundService } from '../admin/round/meeting-round-service';
import { MeetingPlayoffService } from '../admin/playoff/meeting-playoff-service';
import { DateFormatPipe } from './date-format-pipe';
import { LevelService } from '../admin/eliminatory/level-service';

export abstract class AbstractTabResultListView extends AbstractListView {
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
    selctedEliminatoryLevel: EliminatoryLevelVO;

    constructor(
        protected redirect: string,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe,
        protected levelService: LevelService
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.tourneyService.selectedEliminatoryLevelIndex = -1;
        this.tourneyService.selectedEliminatoryIndex = -1;

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.meetingPlayoffService.selectedTourney = this.selectedTourney;

        this.roundCount = 0;
        if(super.containsRound()) {
            this.roundRows = this.selectedTourney.rounds;
            this.roundCount = this.roundRows.length;

            let roundIds: number[] = [];
            for(let round of this.selectedTourney.rounds) {
                roundIds.push(round.id);
            }
            const subsbr = this.meetingRoundService.loadRoundMeetings(this.selectedTourney.id, roundIds);
            subsbr.subscribe(t => this.onRoundCompleteLoad(t), e => this.onError(e) );            
        } else {
            this.prepareEliminatoryLevels();
        }
    }
    
    private onRoundCompleteLoad(t: MeetingDb[]): void {
        this.mdbList = t;
        for(let round of this.selectedTourney.rounds) { 
            this.meetingRoundService.extractRoundMeetings(round, this.mdbList);
            let allMeetings = round.onewayMeetings.concat(round.roundtripMeetings);
            round.classification = this.tourneyService.createClassification(round, allMeetings);
        }

        this.playoffCount = 0;
        this.mdbList = [];
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
        this.levelService.prepareEliminatoryLevelsGui();
        this.eliminatoryLevelCols = this.levelService.eliminatoryLevelCols;
        this.eliminatoryLevelRows = this.levelService.eliminatoryLevelRows;
        this.eliminatoryCount = this.eliminatoryLevelRows.length;
    }

    private onPlayoffCompleteLoad() {
        for(let playoff of this.selectedTourney.playoffs) { 
            this.meetingPlayoffService.extractPlayoffMeetings(playoff, this.mdbList);
    
            if( this.selectedTourney.isPlayoffAutoGen == "true") {
                this.meetingPlayoffService.resolveAutomaticTeams(playoff);
                this.meetingPlayoffService.resolveAutomaticMeetings(playoff, this.selectedTourney.rounds);
            } else {
                this.meetingPlayoffService.resolveManualTeams(playoff);
                this.meetingPlayoffService.resolveManualMeetings(playoff, this.selectedTourney.rounds);
            }
    
            let allMeetings = playoff.round.onewayMeetings.concat(playoff.round.roundtripMeetings);
            playoff.round.classification = this.tourneyService.createClassification(playoff.round, allMeetings);
        }
        this.prepareEliminatoryLevels();
    }

    onChangeTab(e) {
        let index=e.index;
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
            rows[row].teamName1 = m.teamName1;
            rows[row].teamName2 = m.teamName2;
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
}

