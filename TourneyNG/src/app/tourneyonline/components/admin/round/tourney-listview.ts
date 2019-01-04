import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';

const redirect = '/adminround/lv';

@Component({
    templateUrl: './tourney-listview.html'    
})
export class RoundTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, loc, dfp);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return this.selectPhaseType(tourneys, PhaseType.R);
    }
}
