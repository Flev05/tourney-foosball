import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';

const redirect: string = '/admintourney/dv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView extends AbstractTourneyListView {

    constructor(protected tourneyService: TourneyService, public router: Router, public loc: Location) { 
        super(redirect, tourneyService, router, loc);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    create() {
        this.tourneyService.selectedTourney = this.selectedTourney;
        this.tourneyService.newTourney = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneObject(event.data);
        this.tourneyService.newTourney = false;

        this.gotoDetailView();
    }
}
