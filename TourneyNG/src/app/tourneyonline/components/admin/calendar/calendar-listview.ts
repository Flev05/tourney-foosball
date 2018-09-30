import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';
import { Eliminatory } from '../../../domain/eliminatory';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const roundRedirect: string = "admincalendar/lv/dv";
const playoffRedirect: string = "admincalendar/lv/dv";
const eliminatoryRedirect: string = "admincalendar/lv/dv";

@Component({
    templateUrl: './calendar-listview.html'
})
export class CalendarListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(roundRedirect, tourneyService, router, location);
    }

    selectedPlayoff: Playoff;
    selectedRound: Round;
    selectedEliminatory: Eliminatory;

    rounds: Round[];
    playoffs: Playoff[];
    eliminatories: Eliminatory[];

    ngOnInit() {
        super.ngOnInit();
        this.loadAll();
    }

    private loadAll() {

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.rounds = this.selectedTourney.rounds;
        this.playoffs = this.selectedTourney.playoffs;
        this.eliminatories = this.selectedTourney.eliminatories;
    }

    onRoundSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoRoundDetailView();
    }

    private gotoRoundDetailView() {
        this.router.navigate([roundRedirect]);
    }

    onPlayoffSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedPlayoff = this.selectedPlayoff;

        this.gotoPlayoffDetailView();
    }

    private gotoPlayoffDetailView() {
        this.router.navigate([playoffRedirect]);
    }

    onEliminatorySelect(event) {
        console.log(event.data);

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;

        this.gotoEliminatoryDetailView();
    }

    private gotoEliminatoryDetailView() {
        this.router.navigate([eliminatoryRedirect]);
    }


    goBack(): void {
        this.location.back();
    }
}

