import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './tourney-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
    `]
})
export class ClassificationTourneyListView extends AbstractTourneyListView  {
    static redirect = '/classification/lv';

    constructor(protected tourneyService: TourneyService, public router: Router, public loc: Location) { 
        super(ClassificationTourneyListView.redirect, tourneyService, router, loc);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onComplete(): any {
        super.purgeEliminatory();
    }
}
