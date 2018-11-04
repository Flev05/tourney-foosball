import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';
import { Eliminatory } from '../../../domain/eliminatory';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const matrixDvRedirect: string = "adminmatrix/lv/dv";

@Component({
    templateUrl: './matrix-listview.html'
})
export class MatrixListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(matrixDvRedirect, tourneyService, router, location);
    }

    selectedPlayoff: Playoff;
    selectedRound: Round;

    rounds: Round[];
    playoffs: Playoff[];

    ngOnInit() {
        super.ngOnInit();
        this.selectedTourney = this.tourneyService.selectedTourney;

        this.rounds = this.selectedTourney.rounds;
        this.playoffs = this.selectedTourney.playoffs;
    }

    onRoundSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoMeetingListView();
    }

    private gotoMeetingListView() {
        this.router.navigate([matrixDvRedirect]);
    }

    onPlayoffSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedPlayoff.round;

        this.gotoMeetingListView();
    }

    goBack(): void {
        this.location.back();
    }
}

