import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { AbstractListView } from '../../common/abstract-listview';
import { LevelService } from './level-service';

@Component({
    templateUrl: './eliminatory-manuallistview.html'
})
export class EliminatoryManualListView extends AbstractListView {

    constructor(
        protected tourneyService: TourneyService,
        protected levelService: LevelService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(LevelService.manualRedirectDV, tourneyService,   router, location);
    }

    ngOnInit() {
        this.levelService.ngOnInit();
        this.levelService.prepareGui();
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
        console.log(event);

        this.tourneyService.selectedEliminatory = event.data.eliminatory;
        this.levelService.eliminatorySelectedRow = event.data;

        this.router.navigate([LevelService.manualRedirectDV]);
    }
}

