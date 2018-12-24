import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from '../../../service/tourneyservice';
import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';

const redirect: string = '/admintourney/dv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView extends AbstractTourneyListView {

    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, loc, dfp);
    }

    create() {
        this.tourneyService.selectedTourney = this.selectedTourney;

        let dt = this.dfp.transform(new Date());
        this.selectedRow = {t:this.selectedTourney, rowNumber: 1, tourneyName: "", datetime: dt};

        this.tourneyService.newTourney = true;
        this.gotoDetailView();
    }
}
