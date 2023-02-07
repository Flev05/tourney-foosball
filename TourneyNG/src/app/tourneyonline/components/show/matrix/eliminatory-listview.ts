import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { AbstractResultEliminatoryListView } from 'app/tourneyonline/components/common/abstract-result-eliminatory-listview';
import { MatrixService } from './matrix-service';

const matrixDvRedirect: string = "matrix/lv/dv";
@Component({
    templateUrl: './eliminatory-listview.html',
    styleUrls: ['../classification/classification-view.css']
})
export class EliminatoryListView extends AbstractResultEliminatoryListView {

    constructor(
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected levelService: LevelService,
        protected router: Router,
        protected location: Location,
        public dfp: DateFormatPipe 
    ) {
        super(matrixDvRedirect, tourneyService, meetingService, levelService, router, location, dfp)
    } 
    
    ngOnInit() {
        super.ngOnInit();
        this.levelService.loadAllEliminatoryMeetingByIdList(this.selectedTourney.eliminatoryLevels, () => this.onEliminatoryLoadComplete(), e => this.serverUnreachableHandler(e));
    }

    private onEliminatoryLoadComplete(): void {
        super.onLoadComplete(this.selectedTourney.eliminatoryLevels, this.tourneyService.selectedEliminatoryLevelIndex);
        this.prepareEliminatoryGui();
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols.concat(this.tourneyService.classificationReducedCols);
    }
    
    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.meetingService.selectedMeeting = this.selectedRow;
        
        if( this.selectedRow.isSkiping ) {
            return;
        }
        this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedRow.containerId;

        this.eliminatorySelectedRow =  this.eliminatoryRows.find( e => e.eliminatory.id == this.selectedRow.containerId );
        this.tourneyService.selectedRound = this.eliminatorySelectedRow.eliminatory.round;

        this.gotoDetailView();
    }
}

