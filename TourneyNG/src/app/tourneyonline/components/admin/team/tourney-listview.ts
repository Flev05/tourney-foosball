import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';

const redirect = '/adminteam/lv';

@Component({
    templateUrl: './tourney-listview.html'  
})
export class TeamTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, loc, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
    }
    
    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
