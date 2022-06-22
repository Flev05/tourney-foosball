import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { Round } from 'app/tourneyonline/domain/round';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class ClassificationEliminatoryListView extends AbstractEliminatoryListView {
    static autoRedirect: string = 'classification/lv/dv';
    
    constructor(
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(ClassificationEliminatoryListView.autoRedirect, tourneyService, meetingService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
        this.tourneyService.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
        this.prepareClassificationGui();
    }
    
    private prepareClassificationGui(): void {
        let allRounds: Array<Round> = new Array<Round>();
        let el = this.tourneyService.selectedEliminatoryLevel;
        for(let e of el.eliminatories) {
            allRounds.push(e.round);
        }
    }
}

