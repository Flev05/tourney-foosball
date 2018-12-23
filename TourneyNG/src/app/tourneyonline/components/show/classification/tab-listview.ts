import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/DateFormatPipe';
import { Round } from 'app/tourneyonline/domain/round';

@Component({
    templateUrl: './tab-listview.html'
})
export class TabListView extends AbstractEliminatoryListView {
    static tabDvRedirect: string = "classification/lv/classification";

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(TabListView.tabDvRedirect, tourneyService, router, location, dfp);
        console.log("Entering TabListView.constructor()");
    }

    ngOnInit() {
        super.ngOnInit();

        if(super.containsRound()) {
            super.loadRounds();
        }

        if(super.containsPlayoff()) {
            super.loadPlayoffs();
        }

        if(super.containsEliminatory()) {
            super.loadEliminatoryMeetings();
        }
    }
    
    protected processEliminationTree(): void {
        super.processEliminationTree();

        let allRounds: Array<Round> = new Array<Round>();

        for(let e of this.eliminatories) {
            allRounds.push(e.round);
        }
        
        this.eliminatoryRows = super.prepareEliminatoryRound(allRounds);
    }

    onChangePlayoff(e) {
        let index=e.index;
        console.log("Entering onChangePlayoff(): tab=" + index);

        if(index!=1) {
            return;
        }

        this.loadPlayoffs();
    }

}

