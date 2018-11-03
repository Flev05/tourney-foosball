import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Round } from 'app/tourneyonline/domain/round';

const redirect: string = "adminmeeting/lv/meetingLv/dv";

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    selectedRound: Round;
    selectedMeeting: Meeting;
    meetings: Meeting [];
    atLeast2teams: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;

        this.meetings = this.selectedRound.meetings;

        this.atLeast2teams = this.meetings.length > 0 ? true : false;
    }
 
    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedMeeting = this.selectedMeeting;

        this.gotoDetailView();
    }

}

