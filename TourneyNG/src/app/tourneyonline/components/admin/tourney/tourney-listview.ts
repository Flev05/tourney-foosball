import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';

const REDIRECT = 'admintourney/dv';
@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView extends AbstractTourneyListView {

    constructor(protected tourneyService: TourneyService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(REDIRECT, tourneyService, router, loc, dfp);
    }

    create() {
        this.tourneyService.selectedTourney = this.selectedTourney;

        let dt = this.dfp.transform(new Date());
        this.selectedRow = {t:this.selectedTourney, rowNumber: 1, tourneyName: "", datetime: dt};

        this.tourneyService.newTourney = true;
        this.gotoDetailView();
    }

    doDelete(tourney: any) {
        console.log("doDelete(): " + tourney.tourneyName);
        let popup = 'Sicuro di voler rimuovere il torneo: ' + tourney.tourneyName + "?";

        if(confirm(popup)) {
            this.tourneyService.deleteTourney(tourney.t).subscribe(n => this.next(n), e => this.onError(e));
            let index: number = this.tourneys.indexOf(tourney.t);
            if(index > -1) {
                this.tourneys.splice(index, 1);
                this.rows.splice(index, 1);
            }
        }
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
