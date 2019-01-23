import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from '../../common/abstract-listview';

const redirect = '/adminplayer/lv';

@Component({
    templateUrl: './tourney-listview.html'
      
})
export class PlayerTourneyListView extends AbstractListView {
    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location) 
    { 
        super(redirect, tourneyService, router, loc);
    }
    
    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
