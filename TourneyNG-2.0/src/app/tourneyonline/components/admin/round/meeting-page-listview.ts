import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingRoundService } from './meeting-round-service';

@Component({
    templateUrl: './meeting-page-listview.html',
    standalone: false
})
export class MeetingListView extends AbstractListView {
    @Input() showCurrentPageReport: boolean = true;
    @Input() currentPageReportTemplate: string = '{currentPage} of {totalPages}';

    static redirect: string = "adminround/lv/meetingLv/dv";
    cols: TableCols[] = [];
    
    selectedRow: Meeting = new Meeting();

    selectedRound: Round = new Round();
    atLeast2teams: boolean = false;
 
    isRoundTrip: boolean = false;
    pageSize: number = 10;
    allDaysNo: number = 0; 
 
    onewayMeetings: Meeting[] = [];
    roundtripMeetings: Meeting[] = [];

    constructor(
        protected override tourneyService: TourneyService,
        public meetingRoundService: MeetingRoundService,
        protected override router: Router,
        protected override location: Location
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.onCompleteLoad();
        this.cols = [
            { field: 'datetime',    header: 'Data/Ora' },
            { field: 'teamName1',   header: 'In casa' },
            { field: 'teamName2',   header: 'Trasferta' }
        ];
        
        this.atLeast2teams = this.selectedRound.teamNames.length >= 2 ? true : false;
        if(!this.atLeast2teams) {
            return;
        }

        this.isRoundTrip = true;
        if (this.selectedTourney.isOnewayRound == "true") {
            this.isRoundTrip = false;
        }
    }

    override onTabChange(e : any) {
        let index=e;
        console.log("Entering onTabChange(): tab=" + index);
        this.meetingRoundService.selectedTabIndex = index; 
    }

    private onCompleteLoad( ): void {
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.pageSize = this.selectedRound.pageSize;
        this.allDaysNo = this.selectedRound.daysNo;
        this.onewayMeetings = this.selectedRound.onewayMeetings;
        this.roundtripMeetings = this.selectedRound.roundtripMeetings;
        console.log("[Meetings " + this.onewayMeetings.length + "]");
        console.log("[Days     " + this.allDaysNo + "]");
        console.log("[PageSize " + this.pageSize + "]");
    }
  
    onRowSelect(event : any) {
        console.log(event.data);
        this.meetingRoundService.selectedMeeting = this.selectedRow;
        this.gotoDetailView();
    }
}

