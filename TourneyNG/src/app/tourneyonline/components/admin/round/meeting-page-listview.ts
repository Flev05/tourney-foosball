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

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.meetingRoundService.selectedTabIndex = index; 
    }

    private onCompleteLoad( ): void {
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.pageSize = this.selectedRound.pageSize;
        this.allDaysNo = this.selectedRound.daysNo;

        // let  tempList : Meeting[] = [];
        // let  i : number = 0;
        // for( let m of this.selectedRound.onewayMeetings) {
        //     let curPage = i % this.pageSize;
        //     if( curPage == 0) {
        //         let separator: Meeting = { datetime: m.datetime, teamName1: "Giornata " + (i / this.pageSize + 1) + "/" + this.allDaysNo, teamName2: " ----------- " };
        //         tempList.push(separator);
        //     }
        //     tempList.push(m);
        //     i++;
        // }
        // this.onewayMeetings = tempList;
        this.onewayMeetings = this.selectedRound.onewayMeetings;
        this.onewayMeetings.sort((m1, m2) => this.meetingRoundService.sortMeeting(m1, m2));

        // tempList = [];
        // i = 0;
        // for( let m of this.selectedRound.roundtripMeetings) {
        //     let curPage = i % this.pageSize;
        //     if( curPage == 0) {
        //         let separator: Meeting = {  teamName1: "Giornata " + (i / this.pageSize + 1) + "/" + this.allDaysNo, teamName2: " ----------- " };
        //         tempList.push(separator);
        //     }
        //     tempList.push(m);
        //     i++;
        // }
        // this.roundtripMeetings = tempList;
        this.roundtripMeetings = this.selectedRound.roundtripMeetings;
        this.roundtripMeetings.sort((m1, m2) => this.meetingRoundService.sortMeeting(m1, m2));

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

