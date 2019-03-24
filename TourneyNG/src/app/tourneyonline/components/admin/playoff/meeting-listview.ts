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

    constructor(
        protected tourneyService: TourneyService,
        public meetingService: MeetingPlayoffService,
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

        this.meetingService.createPlayoffMeeting(this.selectedTourney, this.selectedPlayoff);
    }
  
    onRowSelect(event) {
        console.log(event.data);

        this.meetingService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }
}

