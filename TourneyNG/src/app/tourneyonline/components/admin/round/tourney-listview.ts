import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourney-service';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PlayerService } from 'app/tourneyonline/service/player-service';

const redirect = '/adminround/lv';

@Component({
    templateUrl: './tourney-listview.html'    
})
export class RoundTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , protected playerService : PlayerService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, playerService, router, loc, dfp);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return this.selectPhaseType(tourneys, PhaseType.R);
    }
}
