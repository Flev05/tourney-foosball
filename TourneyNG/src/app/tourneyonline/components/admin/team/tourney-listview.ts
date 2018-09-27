import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect = '/adminteam/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TeamTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService, public router: Router, public loc: Location) { 
        super(redirect, tourneyService, router, loc);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
