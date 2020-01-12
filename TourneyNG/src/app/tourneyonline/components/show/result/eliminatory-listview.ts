import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { ResultEliminatoryListView } from '../../common/abstract-result-eliminatory-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Classification } from 'app/tourneyonline/domain/classification';
import { ClassificationDetailView } from '../classification/classification-detailview';

@Component({
    templateUrl: './eliminatory-listview.html',
    styleUrls: ['../classification/classification-view.css']
    
})
export class EliminatoryListView extends ResultEliminatoryListView {
    selectedClassificationRow: Classification;

    constructor(
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected levelService: LevelService,
        protected router: Router,
        protected location: Location,
        public dfp: DateFormatPipe
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, meetingService, levelService, router, location, dfp)
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.levelService.loadAllEliminatoryMeetingByIdList(this.selectedTourney.eliminatoryLevels, () => this.onEliminatoryLoadComplete());
    }

    private onEliminatoryLoadComplete(): void {
        super.onLoadComplete();
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols.concat(this.tourneyService.classificationCols);
    }

    onClassifcationRowSelect(event) {
        console.log(event.data);
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.tourneyService.selectedEliminatoryLevel.name);

        this.router.navigate([ClassificationDetailView.redirect]);
    }
}

