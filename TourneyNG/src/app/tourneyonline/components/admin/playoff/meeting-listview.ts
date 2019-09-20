import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { AbstractRuleListView } from '../../common/abstract-rule-listview';
import { MeetingPlayoffService } from './meeting-playoff-service';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractRuleListView {
    static redirect: string = "adminplayoff/lv/meetingLv/playoffRuledv";
    meetingsCols: TableCols[] ;
    selectedRow: Meeting;

    msgs: Message[] = [];

    selectedPlayoff: Playoff;
    isRoundTrip: boolean;
    mdbList: MeetingDb[];

    pageSize: number = 10;
    
    constructor(
        protected tourneyService: TourneyService,
        public meetingPlayoffService: MeetingPlayoffService,
        protected router: Router,
        protected location: Location
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        

        this.meetingsCols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'ruleName1',    header: 'In Casa' },
            { field: 'ruleName2',    header: 'Trasferta' }
        ];

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
    
        this.isRoundTrip = false;
        if(this.selectedTourney.isOnewayPlayoff == "true") {
            this.isRoundTrip = true;
        }

        const subsbr = this.meetingPlayoffService.loadPlayoffMeeting(this.selectedTourney.id, this.selectedPlayoff.id);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onCompleteLoad());
    }
   
    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.selectedPlayoff.selectedTabIndex = index; 
    }
    
    private onCompleteLoad(): void {
        this.meetingPlayoffService.selectedTourney = this.selectedTourney;
        this.meetingPlayoffService.onCompleteLoad(this.selectedPlayoff, this.mdbList);
        this.pageSize = this.meetingPlayoffService.onewayDays.length;
         
    }

    onRowSelect(event) {
        console.log(event.data);

        this.meetingPlayoffService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }
}

