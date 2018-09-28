import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { Playoff } from '../../../domain/playoff';

const redirect: string = "adminplayoff/lv/dv";

@Component({
    templateUrl: './playoff-listview.html'
})
export class PlayoffListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    selectedTourney: Tourney;
    selectedPlayoff: Playoff;
    playoffs: Playoff[];

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.playoffs = this.tourneyService.selectedTourney.playoffs;
        this.tourneyService.newPlayoff = false;
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

