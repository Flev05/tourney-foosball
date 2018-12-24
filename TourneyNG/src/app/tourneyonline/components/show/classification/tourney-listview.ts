import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { DateFormatPipe } from '../../common/date-format-pipe';

@Component({
    templateUrl: './tourney-listview.html'
})
export class ClassificationTourneyListView extends AbstractTourneyListView  {
    static redirect = '/classification/lv';

    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(ClassificationTourneyListView.redirect, tourneyService, router, loc, dfp);
    }
}
