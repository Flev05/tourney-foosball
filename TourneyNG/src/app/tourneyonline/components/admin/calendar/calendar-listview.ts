import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';
import { Eliminatory } from '../../../domain/eliminatory';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect: string = "admincalendar/lv/dv";
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
        super(redirect, tourneyService, router, location);
    }

    selectedTourney: Tourney;

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

        let sp = this.cloneObject(event.data);

        for(let i=0; i<this.selectedTourney.rounds.length; i++ ) {
            if(this.selectedTourney.rounds[i].id == sp.id) {
                this.selectedRound = this.selectedTourney.rounds[i];
                this.tourneyService.selectedRound = this.selectedRound;
                break;
            }
        }

        this.gotoRoundDetailView();
    }

    protected gotoRoundDetailView() {
        this.router.navigate([this.redirect]);
    }

    goBack(): void {
        this.location.back();
    }
}

