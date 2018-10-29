import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractListView {
    static autoRedirect: string = 'adminresult/lv/meetingLv/dv';

    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;

    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(EliminatoryListView.autoRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedEliminatory = this.tourneyService.selectedEliminatory;
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
    }
    
    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.tourneyService.selectedRound = this.selectedEliminatory.round;

        this.router.navigate([EliminatoryListView.autoRedirect]);
    }
}

