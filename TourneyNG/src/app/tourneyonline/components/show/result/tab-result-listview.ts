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
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Team } from 'app/tourneyonline/domain/team';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

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

    constructor(
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
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

        this.roundCount = 0;
        if(super.containsRound()) {
            this.roundRows = this.selectedTourney.rounds;
            this.roundCount = this.roundRows.length;
        }

        this.playoffCount = 0;
        if(super.containsPlayoff()) {
            this.playoffRows = this.selectedTourney.playoffs;
            this.playoffCount = this.playoffRows.length;
        }
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
        
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
    }

    goBack(): void {        
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }
}

