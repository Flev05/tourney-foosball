import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PlayerService } from 'app/tourneyonline/service/player-service';

const redirect = '/admineliminatory/levelLv';

@Component({
    templateUrl: './tourney-listview.html'     
})
export class EliminatoryTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , protected playerService: PlayerService
        , public router: Router
        , public location: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, playerService, router, location, dfp);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return this.selectPhaseType(tourneys, PhaseType.E);
    }
}
