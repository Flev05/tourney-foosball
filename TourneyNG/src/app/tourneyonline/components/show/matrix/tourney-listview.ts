import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';

const redirect = '/matrix/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class MatrixTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public location: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return this.purgeEliminatory(tourneys);
    }
}
