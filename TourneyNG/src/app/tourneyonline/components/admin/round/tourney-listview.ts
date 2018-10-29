import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';

const redirect = '/adminround/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class RoundTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService, public router: Router, public loc: Location) { 
        super(redirect, tourneyService, router, loc);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onComplete(): any {
        for(let t of this.tourneys) {
            if(!this.containsPhase(PhaseType.R, t.phases)) {
                let index: number = this.tourneys.indexOf(t);
                if(index > -1) {
                    this.tourneys.splice(index, 1);
                }
            }
        }
    }
}
