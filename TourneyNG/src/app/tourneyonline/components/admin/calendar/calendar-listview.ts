import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';
import { Eliminatory } from '../../../domain/eliminatory';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';

const meetingLvRedirect: string = "admincalendar/lv/meetingLv";

@Component({
    templateUrl: './calendar-listview.html'
})
export class CalendarListView extends AbstractListView {

    selectedPlayoff: Playoff;
    selectedRound: Round;
    selectedEliminatory: Eliminatory;
    selectedEliminatoryLevel: EliminatoryLevel;

    rounds: Round[];
    playoffs: Playoff[];

    isOnewayRound: string;
    isOnewayPlayoff: string;

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
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
    
        this.rounds = this.selectedTourney.rounds;
        this.playoffs = this.selectedTourney.playoffs;

        this.selectedRound = this.tourneyService.selectedRound;
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;

        this.isOnewayRound = this.selectedTourney.isOnewayRound? "true" : "false";
        this.isOnewayPlayoff = this.selectedTourney.isOnewayPlayoff? "true" : "false";
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

        this.tourneyService.selectedRound = this.selectedPlayoff.round;

        this.gotoMeetingListView();
    }

    onEliminatorySelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedEliminatory.round;

        this.gotoMeetingListView();
    }
    
    private gotoMeetingListView() {
        this.router.navigate([meetingLvRedirect]);
    }

    goBack(): void {
        this.location.back();
    }
}

