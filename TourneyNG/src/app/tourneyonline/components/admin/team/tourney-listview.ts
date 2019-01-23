import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';

const redirect = '/adminteam/lv';

@Component({
    templateUrl: './tourney-listview.html'  
})
export class TeamTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , protected playerService : PlayerService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, playerService, router, loc, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
    }
    
    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
