import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect = '/admincalendar/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class CalendarTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService, public router: Router) { 
        super(redirect, tourneyService, router);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
