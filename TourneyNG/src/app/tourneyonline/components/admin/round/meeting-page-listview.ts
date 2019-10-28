import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

@Component({
    templateUrl: './meeting-page-listview.html'
})
export class MeetingListView extends AbstractListView {
    @Input() showCurrentPageReport: boolean = true;
    @Input() currentPageReportTemplate: string = '{currentPage} of {totalPages}';

    static redirect: string = "adminround/lv/meetingLv/dv";
    cols: TableCols[] ;
    
    selectedRow: Meeting;

    selectedRound: Round;
    atLeast2teams: boolean;
 
    isRoundTrip: boolean;
    mdbList: MeetingDb[];
    pageSize: number = 10;
    allDaysNo: number;
    onewayMeetings: Meeting[];
    roundtripMeetings: Meeting[];

    constructor(
        protected tourneyService: TourneyService,
        public meetingRoundService: MeetingRoundService,
        protected router: Router,
        protected location: Location
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        const subsbr = this.meetingRoundService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onCompleteLoad());

        this.cols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'teamName1',   header: 'In casa' },
            { field: 'teamName2',   header: 'Trasferta' }
        ];
        
        this.atLeast2teams = this.selectedRound.teams.length >= 2 ? true : false;
        if(!this.atLeast2teams) {
            return;
        }

        this.isRoundTrip = true;
        if (this.selectedTourney.isOnewayRound == "true") {
            this.isRoundTrip = false;
        }
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.selectedRound.selectedTabIndex = index; 
    }

    private onCompleteLoad(): void {
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.meetingRoundService.onCompleteLoad(this.selectedRound, this.mdbList);

        this.pageSize = this.selectedRound.pageSize;
        this.allDaysNo = this.selectedRound.daysNo;
        this.onewayMeetings = this.selectedRound.onewayMeetings;
        this.roundtripMeetings = this.selectedRound.roundtripMeetings;

        console.log("[Meetings " + this.onewayMeetings.length + "]");
        console.log("[Days     " + this.allDaysNo + "]");
        console.log("[PageSize " + this.pageSize + "]");
    }
  
    onRowSelect(event) {
        console.log(event.data);

        this.meetingRoundService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }
}

