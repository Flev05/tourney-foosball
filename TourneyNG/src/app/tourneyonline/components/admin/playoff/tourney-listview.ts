import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { PlayoffListView } from './playoff-listview';

@Component({
    templateUrl: './tourney-listview.html'
})
export class PlayoffTourneyListView extends AbstractTourneyListView {
    static redirect = '/adminplayoff/lv';

    constructor(protected tourneyService: TourneyService, public router: Router, public loc: Location) { 
        super(PlayoffTourneyListView.redirect, tourneyService, router, loc);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onComplete(): any {
        for(let t of this.tourneys) {
            if(!this.containsPhase('playoff', t.phases)) {
                let index: number = this.tourneys.indexOf(t);
                if(index > -1) {
                    this.tourneys.splice(index, 1);
                }
            }
        }

        if(this.tourneyService.selectedTourney != null) {
            // this.router.navigate([PlayoffListView.redirect]);
        }
    }
}
