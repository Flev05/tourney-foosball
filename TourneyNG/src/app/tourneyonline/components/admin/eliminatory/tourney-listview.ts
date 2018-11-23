import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { PhaseType } from '../../../domain/enumerations';

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
