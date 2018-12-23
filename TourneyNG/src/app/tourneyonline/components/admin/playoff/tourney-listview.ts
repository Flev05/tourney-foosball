import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { PhaseType } from '../../../domain/enumerations';
import { DateFormatPipe } from '../../common/DateFormatPipe';

@Component({
    templateUrl: './tourney-listview.html'       
})
export class PlayoffTourneyListView extends AbstractTourneyListView {
    static redirect = '/adminplayoff/lv';

    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(PlayoffTourneyListView.redirect, tourneyService, router, loc, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onComplete(): any {
        super.onComplete();

        this.selectPhaseType(PhaseType.P);

        if(this.tourneyService.selectedTourney != null) {
            // this.router.navigate([PlayoffListView.redirect]);
        }
    }
}
