import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { DateFormatPipe } from '../../common/DateFormatPipe';

const redirect = '/admineliminatory/levelLv';

@Component({
    templateUrl: './tourney-listview.html'     
})
export class EliminatoryTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public location: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, location, dfp);
    }

    onComplete(): any {
        super.onComplete();

        this.selectPhaseType(PhaseType.E); 
    }
}
