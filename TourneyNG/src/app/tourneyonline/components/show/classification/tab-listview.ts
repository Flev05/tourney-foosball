import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { PhaseType } from '../../../domain/enumerations';

@Component({
    templateUrl: './tab-listview.html'
})
export class TabListView extends AbstractListView {
    static tabDvRedirect: string = "classification/lv/classification";
    selectedPlayoff: Playoff;
    selectedRound: Round;

    rounds: Round[];
    playoffs: Playoff[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(TabListView.tabDvRedirect, tourneyService, router, location);
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

        this.gotoClassificationListView();
    }

    private gotoClassificationListView() {
        this.router.navigate([TabListView.tabDvRedirect]);
    }

    onPlayoffSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedPlayoff.round;

        this.gotoClassificationListView();
    }

    goBack(): void {
        this.location.back();
    }
}

