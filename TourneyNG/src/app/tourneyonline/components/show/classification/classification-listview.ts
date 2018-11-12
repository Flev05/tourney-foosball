import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Round } from '../../../domain/round';
import { Classification } from '../../../domain/classification';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';

@Component({
    templateUrl: './classification-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
        .ui-table .ui-table-thead > tr > th, .ui-table .ui-table-tbody > tr > td, .ui-table .ui-table-tfoot > tr > td {
            padding: .25em .5em;
            text-align: center;
        }
  `]
})
export class ClassificationListView extends AbstractListView {

    selectedRound: Round;
    classification: Classification[] = [];
    isEmpty: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.classification = this.selectedRound.classification;

        if(this.classification.length==0) {
            for(let t of this.selectedRound.teams) {
                let c = this.newClassification(t, 0);
                this.classification.push(c);
            }
        }

        if(this.classification.length==0) {
            this.isEmpty = true;
        } else {
            this.isEmpty = false;
        }
    }

}
