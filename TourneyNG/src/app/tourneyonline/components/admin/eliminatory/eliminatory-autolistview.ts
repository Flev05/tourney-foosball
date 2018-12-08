import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractEliminatoryListView } from './abstract-eliminatory-listview';

@Component({
    templateUrl: './eliminatory-autolistview.html'
})
export class EliminatoryAutoListView extends AbstractEliminatoryListView {
    static autoRedirect:   string = '/admineliminatory/levelLv/eliminatoryLv/autodv';

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(EliminatoryAutoListView.autoRedirect, tourneyService, router, location);
    }

    onAutoEliminatoryRowSelect(event) {
        console.log("Entering onAutoEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
        this.router.navigate([EliminatoryAutoListView.autoRedirect]);
    }
}

