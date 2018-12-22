import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/DateFormatPipe';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';

@Component({
    templateUrl: './eliminatory-manuallistview.html'
})
export class EliminatoryManualListView extends AbstractEliminatoryListView {
    static manualRedirect: string = '/admineliminatory/levelLv/eliminatoryLv/manualdv';


    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(EliminatoryManualListView.manualRedirect, tourneyService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();

        if(this.isStandalone) {
            this.prepareStandaloneGui();
        } else {
            this.prepareNotStandaloneGui();
        }
    }

    getPosition1(e: Eliminatory): string {
        let position1 = e.rule1.fromRound.position.value > 0 ? e.rule1.fromRound.position.label : e.rule1.fromPlayoff.position.label;
        return position1;
    }

    getPosition2(e: Eliminatory): string {
        let position2 = e.rule2.fromRound.position.value > 0 ? e.rule2.fromRound.position.label : e.rule2.fromPlayoff.position.label;
        return position2;
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedRow.e;
        this.router.navigate([EliminatoryManualListView.manualRedirect]);
    }
}

