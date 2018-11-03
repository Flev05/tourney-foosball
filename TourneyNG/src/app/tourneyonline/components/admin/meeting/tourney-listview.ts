import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { Tourney } from 'app/tourneyonline/domain/tourney';

const redirect = '/adminmeeting/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class CalendarTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService, public router: Router, public location: Location) { 
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onComplete(): any {
        let tempTourneys = new Array<Tourney>();
        
        for(let t of this.tourneys) {
            
            if(this.containsPhase(PhaseType.R, t.phases) || this.containsPhase(PhaseType.P, t.phases)) {
                tempTourneys.push(t);
            }
        }

        this.tourneys = tempTourneys;
    }
}
