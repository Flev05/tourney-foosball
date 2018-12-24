import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { DateFormatPipe } from '../../common/date-format-pipe';

const redirect = '/result/lv';

@Component({
      templateUrl: './tourney-listview.html'   
})
export class ResultTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public location: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, location,dfp);
    }
}
