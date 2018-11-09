import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Round } from 'app/tourneyonline/domain/round';
import { Playoff } from 'app/tourneyonline/domain/playoff';


@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminmeeting/lv/meetingLv/dv";
    selectedPlayoff: Playoff;
    selectedMeeting: Meeting;
    meetings: Meeting [];
    atLeast2teams: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;

        this.meetings = this.selectedPlayoff.round.meetings;

        this.atLeast2teams = this.meetings.length > 0 ? true : false;
    }
 
    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedMeeting = this.selectedMeeting;

        this.gotoDetailView();
    }

}

