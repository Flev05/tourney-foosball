import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { Playoff } from '../../../domain/playoff';

@Component({
    templateUrl: './playoff-listview.html'
})
export class PlayoffListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRoundLv";
    selectedTourney: Tourney;
    selectedPlayoff: Playoff;
    playoffs: Playoff[];

    atLeastOneRound: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(PlayoffListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.playoffs = this.tourneyService.selectedTourney.playoffs;
        this.tourneyService.newPlayoff = false;
   
        this.atLeastOneRound = this.selectedTourney.rounds.length > 0;
    }

    create() {
        this.tourneyService.newPlayoff = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.tourneyService.newPlayoff = false;
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

