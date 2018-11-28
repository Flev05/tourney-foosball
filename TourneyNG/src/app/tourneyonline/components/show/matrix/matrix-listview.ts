import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Round } from 'app/tourneyonline/domain/round';
import { AbstractListView } from '../../common/abstract-listview';
import { MatrixDetailView } from './matrix-detailview';


@Component({
    templateUrl: './matrix-listview.html'
})
export class MatrixListView extends AbstractListView {
    
    selectedPlayoff: Playoff;
    selectedRound: Round;

    rounds: Round[];
    playoffs: Playoff[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MatrixDetailView.matrixDvRedirect, tourneyService, router, location);
    }

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
        this.router.navigate([MatrixDetailView.matrixDvRedirect]);
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

