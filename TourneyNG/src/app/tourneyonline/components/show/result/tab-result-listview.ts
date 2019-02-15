import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

const REDIRECT_ROUND_DV     = 'result/lv/round';
const REDIRECT_PLAYOFF_DV   = 'result/lv/playoff';
const REDIRECT_ELIMINATORY  = 'result/lv/eliminatoryLv/dv';

@Component({
    templateUrl: './tab-result-listview.html'
})
export class TabResultListView extends AbstractEliminatoryListView {

    selectedMeetingRow: any;
    activeIndex: number;

    roundCols: TableCols[] = TourneyService.roundCols;
    roundRows: Round[];
    selectedRound: Round;

    playoffCols: TableCols[] = TourneyService.playoffCols;
    playoffRows: Playoff[];
    selectedPlayoff: Playoff;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, router, location, dfp);
    }

    ngOnInit() {
        this.activeIndex = this.tourneyService.selectedTabIndex;

        super.ngOnInit();

        this.tourneyService.selectedEliminatoryLevelIndex = -1;
        this.tourneyService.selectedEliminatoryIndex = -1;

        if(super.containsRound()) {
            this.roundRows = this.selectedTourney.rounds;
        }

        if(super.containsPlayoff()) {
            this.playoffRows = this.selectedTourney.playoffs;
            for(let p of this.playoffRows) {
                p.playoffName = p.round.name;
            }
        }

        if(super.containsEliminatory()) {
            super.loadEliminatoryLevels();
        }
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.activeIndex = index;
        this.tourneyService.selectedTabIndex = this.activeIndex;

        if(index==1 && super.containsPlayoff()) {
        }

        if(index==2 && super.containsEliminatory()) {
            this.incompleteConfiguration = this.eliminatoryLevels.length > 0 ? false : true;
        }
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
        
        this.cols = this.prepareResultRoundPlayoffColums();

        let rowNumber : number=0;

        for (let m of round.onewayMeetings) {
            rows.push(m);

            rowNumber++;
            rows[row].id = m.id;
            rows[row].dateAndTime = this.dfp.transform(m.datetime);
            rows[row].rowNumber = rowNumber;
            rows[row].roundtrip = m.direction == Direction.OneWay ? "A" : "R";
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

        this.tourneyService.selectedMeetingDb = {id: null
            , tourneyId: this.selectedTourney.id
            , roundId: this.selectedRound.id
            , playoffId: null
            , eliminatoryId: null
        };     
        this.router.navigate([REDIRECT_ROUND_DV]);
    }

    onPlayoffRowSelect(event) {
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.tourneyService.selectedMeetingDb = {id: null
            , tourneyId: this.selectedTourney.id
            , roundId: null
            , playoffId: this.selectedPlayoff.id
            , eliminatoryId: null
        };     
        this.router.navigate([REDIRECT_PLAYOFF_DV]);
    }

    // onRoundSelect(event) {
    //     console.log(event.data);

    //     let r = this.getRoundBy(this.selectedMeetingRow.roundId, this.selectedTourney.rounds);
    //     let m: Meeting = this.getMeetingBy(this.selectedMeetingRow.id, r);

    //     let mdb = this.tourneyService.completeRoundMeetingDb(m
    //         , this.selectedTourney.id
    //         , r.id
    //     );

    //     this.tourneyService.selectedMeetingDb = mdb;

    //     this.gotoMeetingDetailView();
    // }
    
    // onPlayoffSelect(event) {
    //     console.log(event.data);

    //     let playoffRounds: Round[] = this.makePlayoffRounds(this.selectedTourney.playoffs);

    //     let r = this.getRoundBy(this.selectedMeetingRow.roundId,  playoffRounds);
    //     let m: Meeting = this.getMeetingBy(this.selectedMeetingRow.id, r);

    //     let mdb = this.tourneyService.completePlayoffMeetingDb(m
    //         , this.selectedTourney.id
    //         , this.selectedMeetingRow.playoffId
    //     );

    //     this.tourneyService.selectedMeetingDb = mdb;

    //     this.gotoMeetingDetailView();
    // }
    
    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");
      
        this.selectedEliminatoryLevel = this.selectedRow.e;
        this.tourneyService.selectedEliminatoryLevel = this.selectedEliminatoryLevel;
        
        for(let l=0; l<this.selectedTourney.eliminatoryLevels.length; l++) {
            let el = this.selectedTourney.eliminatoryLevels[l];
            if(el.id == this.selectedEliminatoryLevel.id) {
                this.tourneyService.selectedEliminatoryLevelIndex = l;
                this.tourneyService.selectedEliminatoryIndex = -1;
                break;
            }
        }

        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.tourneyService.selectedMeetingDb = {id: null
            , tourneyId: this.selectedTourney.id
            , roundId: null
            , playoffId: null
            , eliminatoryId: this.selectedEliminatoryLevel.id
        };     
        this.router.navigate([REDIRECT_PLAYOFF_DV]);


        this.router.navigate([REDIRECT_ELIMINATORY]);
    }

    // private getRoundBy(roundId: number, rounds: Round[]): Round {
    //     for(let r of rounds) {
    //         if(r.id == roundId) {
    //             return r;
    //         }
    //     }    
    //     return null;
    // }

    // private getMeetingBy(id: any, round: Round):  Meeting {
    //     for(let m of round.onewayMeetings) {
    //         if(m.id == id) {
    //             return m;
    //         }
    //     }    
    //     return null;
    // }
    
    // private gotoMeetingDetailView() {
    //     this.tourneyService.selectedTabIndex = this.activeIndex;
    //     this.router.navigate([MeetingDetailView.meetingDvRedirect]);
    // }

    goBack(): void {
        this.location.back();
    }
}

