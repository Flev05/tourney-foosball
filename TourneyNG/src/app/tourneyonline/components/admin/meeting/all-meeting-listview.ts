import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractListView } from '../../common/abstract-listview';

const meetingLvRedirect: string = "adminmeeting/lv/meetingLv";

@Component({
    templateUrl: './all-meeting-listview.html'
})
export class AllMeetingListView extends AbstractListView {

    selectedPlayoff: Playoff;
    selectedRound: Round;

    rounds: Round[];
    playoffs: Playoff[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(meetingLvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.rounds = this.selectedTourney.rounds;
        this.playoffs = this.selectedTourney.playoffs;

        this.selectedRound = this.tourneyService.selectedRound;
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
    }

    onOnewayRoundClick() {
        this.selectedTourney.isOnewayRound = true;
    }
    onRoundtripRoundClick() {
        this.selectedTourney.isOnewayRound = false;
    }

    onOnewayPlayoffClick() {
        this.selectedTourney.isOnewayPlayoff = true;
    }
    onRoundtripPlayoffClick() {
        this.selectedTourney.isOnewayPlayoff = false;
    }

    onRoundSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoMeetingListView();
    }

    onPlayoffSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedPlayoff = this.selectedPlayoff;

        this.gotoMeetingListView();
    }
    
    private gotoMeetingListView() {
        this.router.navigate([meetingLvRedirect]);
    }

    goBack(): void {
        this.location.back();
    }
}

