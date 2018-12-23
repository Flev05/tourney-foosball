import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { DateFormatPipe } from '../../common/DateFormatPipe';

const redirect = '/adminplayer/lv';

@Component({
    templateUrl: './tourney-listview.html'
      
})
export class PlayerTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, loc, dfp);
    }
}
