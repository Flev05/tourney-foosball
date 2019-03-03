import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

@Component({
    templateUrl: './eliminatory-autolistview.html'
})
export class EliminatoryAutoListView extends AbstractEliminatoryListView {
    static autoRedirect:   string = '/admineliminatory/levelLv/eliminatoryLv/autodv';
    static autoRedirectLV: string = '/admineliminatory/levelLv/eliminatoryAutoLv';

    selectedRow: any;

    constructor(
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(EliminatoryAutoListView.autoRedirect, tourneyService, meetingService, router, location, dfp);
    }
 
    ngOnInit() {
        super.ngOnInit();

        this.prepareGui();
    }
    
    getPosition1(e: Eliminatory): string {
        let position1 = e.rule1.fromRound.position.label;
        return position1;
    }

    getPosition2(e: Eliminatory): string {
        let position2 = e.rule2.fromRound.position.label;
        return position2;
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedRow.e;
        this.router.navigate([EliminatoryAutoListView.autoRedirect]);
    }
}

