import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { MeetingDetailView } from './meeting-detailview';

@Component({
    templateUrl: './result-listview.html'
})
export class ResultListView extends AbstractEliminatoryListView {
    static eliminatoryRedirect: string = 'result/lv/eliminatoryLv/dv';

    selectedMeetingRow: any;
    indexTab: number;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        // this.indexTab = this.tourneyService.selectedTabIndex;

        super.ngOnInit();

        if(super.containsRound()) {
            super.loadRounds();
        }

        if(super.containsPlayoff()) {
            super.loadPlayoffs();
        }

        if(super.containsEliminatory()) {
            super.loadEliminatoryMeetings();
        }
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.indexTab = index;

        if(index==1 && super.containsPlayoff()) {
            // super.loadPlayoffs();
        }
        if(index==2 && super.containsEliminatory()) {
            this.incompleteConfiguration = this.eliminatoryLevels.length > 0 ? false : true;

            // super.loadEliminatoryMeetings();
        }
    }

    protected prepareRoundsGui(rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            row = this.prepareMeetingGui(null, round, rows, row, classificationMap);
        }

        return rows;
    }

    protected preparePlayoffGui(playoffs: Playoff[]): any[] {
        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let p of playoffs) {
            row = this.prepareMeetingGui(p, p.round, rows, row, classificationMap);
        }

        return rows;
    }

    private prepareMeetingGui(p: Playoff, round: Round, rows: any[], row: number, classificationMap: Map<string, Classification>) {
        
        let roundNo : number=0;

        for (let m of round.meetings) {
            rows.push(m);

            roundNo++;
            rows[row].id = m.id;
            rows[row].roundNo = roundNo;
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

            let currentKey = round.name;
            if (!classificationMap.has(currentKey)) {
                let len = round.meetings.length;
                classificationMap.set(currentKey, m);
                rows[row].rowspanSize = len;
            } else {
                rows[row].rowspanSize = undefined;
            }
            row++;
        }
        return row;
    }

    onRoundSelect(event) {
        console.log(event.data);

        let r = this.getRoundBy(this.selectedMeetingRow.roundId, this.selectedTourney.rounds);
        let m: Meeting = this.getMeetingBy(this.selectedMeetingRow.id, r);

        let mdb: MeetingDb = this.tourneyService.prepareMdb(m
            , this.selectedTourney.id
            , r.id
            , 0
            , 0
        );
        this.tourneyService.selectedMeetingDb = mdb;

        this.gotoMeetingDetailView();
    }
    
    onPlayoffSelect(event) {
        console.log(event.data);

        let playoffRounds: Round[] = this.makePlayoffRounds(this.selectedTourney.playoffs);

        let r = this.getRoundBy(this.selectedMeetingRow.roundId,  playoffRounds);
        let m: Meeting = this.getMeetingBy(this.selectedMeetingRow.id, r);

        let mdb: MeetingDb = this.tourneyService.prepareMdb(m
            , this.selectedTourney.id
            , 1
            , this.selectedMeetingRow.playoffId
            , 0
        );

        this.tourneyService.selectedMeetingDb = mdb;

        this.gotoMeetingDetailView();
    }
    
    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");
      
        this.tourneyService.selectedEliminatoryLevel = this.selectedEliminatoryLevel;

        this.router.navigate([ResultListView.eliminatoryRedirect]);
    }

    private getRoundBy(roundId: number, rounds: Round[]): Round {
        for(let r of rounds) {
            if(r.id == roundId) {
                return r;
            }
        }    
        return null;
    }

    private getMeetingBy(id: any, round: Round):  Meeting {
        for(let m of round.meetings) {
            if(m.id == id) {
                return m;
            }
        }    
        return null;
    }
    
    private gotoMeetingDetailView() {
        this.tourneyService.selectedTabIndex = this.indexTab;
        this.router.navigate([MeetingDetailView.meetingDvRedirect]);
    }

    goBack(): void {
        this.location.back();
    }
}

