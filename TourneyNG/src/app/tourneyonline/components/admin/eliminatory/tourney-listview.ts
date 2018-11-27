import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';

const redirect = '/admineliminatory/levelLv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class EliminatoryTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService, public router: Router, public location: Location) { 
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onComplete(): any {
        super.onComplete();

        this.selectPhaseType(PhaseType.E); 
    }
}
