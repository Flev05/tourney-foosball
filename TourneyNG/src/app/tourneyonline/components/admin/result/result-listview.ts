import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';
import { Eliminatory } from '../../../domain/eliminatory';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';

const meetingLvRedirect: string = "adminresult/lv/meetingLv";

@Component({
    templateUrl: './result-listview.html'
})
export class ResultListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(meetingLvRedirect, tourneyService, router, location);
    }

    selectedPlayoff: Playoff;
    selectedRound: Round;
    selectedEliminatory: Eliminatory;
    selectedEliminatoryLevel: EliminatoryLevel;

    rounds: Round[];
    playoffs: Playoff[];
    eliminatories: Eliminatory[];

    ngOnInit() {
        super.ngOnInit();
        this.loadAll();
    }

    private loadAll() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
        
        this.rounds = this.selectedTourney.rounds;
        this.playoffs = this.selectedTourney.playoffs;
    }

    onRoundSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoMeetingListView();
    }

    private gotoMeetingListView() {
        this.router.navigate([meetingLvRedirect]);
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

    goBack(): void {
        this.location.back();
    }
}

