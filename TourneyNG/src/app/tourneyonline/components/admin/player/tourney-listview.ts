import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AbstractTourneyListView } from '../../common/tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect = '/adminplayer/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class PlayerTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService, public router: Router) { 
        super(redirect, tourneyService, router);
    }
}
