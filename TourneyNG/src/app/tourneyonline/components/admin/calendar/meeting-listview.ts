import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { Meeting } from 'app/tourneyonline/domain/meeting';

const redirect: string = "admincalendar/lv/meetingLv/dv";

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    selectedRound: Round;

    selectedMeeting: Meeting;
    meetings: Meeting [];

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedRound = this.tourneyService.selectedRound;

        this.meetings = this.selectedRound.meetings;
    }
 
    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedMeeting = this.selectedMeeting;

        this.gotoDetailView();
    }

}

