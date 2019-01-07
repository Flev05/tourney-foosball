import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';

@Component({
    templateUrl: './tourney-listview.html'
})
export class CalendarTourneyListView extends AbstractTourneyListView  {
    static redirect = '/calendar/lv';

    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(CalendarTourneyListView.redirect, tourneyService, router, loc, dfp);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
