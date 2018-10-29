import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminresult/lv/meetingLv/dv";
    
    msgs: Message[] = [];
    selectedRound: Round;

    selectedMeeting: Meeting;
    meetings: Meeting [];
    
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }
 
    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;    
        this.meetings = this.selectedRound.meetings;
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");

        this.tourneyService.selectedMeeting = this.selectedMeeting;

        this.router.navigate([MeetingListView.redirect]);
    }
}

