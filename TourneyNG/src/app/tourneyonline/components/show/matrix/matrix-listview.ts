import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Round } from 'app/tourneyonline/domain/round';
import { AbstractListView } from '../../common/abstract-listview';


const matrixDvRedirect: string = "matrix/lv/dv";

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

