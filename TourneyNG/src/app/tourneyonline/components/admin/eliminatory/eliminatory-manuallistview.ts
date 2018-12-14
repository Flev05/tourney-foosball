import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';

@Component({
    templateUrl: './eliminatory-manuallistview.html'
})
export class EliminatoryManualListView extends AbstractEliminatoryListView {
    static manualRedirect: string = '/admineliminatory/levelLv/eliminatoryLv/manualdv';
 
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(EliminatoryManualListView.manualRedirect, tourneyService, router, location);
    }

    onManualEliminatoryRowSelect(event) {
        console.log("Entering onManualEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
        this.router.navigate([EliminatoryManualListView.manualRedirect]);
    }
}

