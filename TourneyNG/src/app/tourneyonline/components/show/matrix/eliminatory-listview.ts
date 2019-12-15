import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { MatrixDetailView } from './matrix-detailview';
import { ResultEliminatoryListView } from '../../common/result-eliminatory-listview';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends ResultEliminatoryListView {
    constructor(
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected levelService: LevelService,
        protected router: Router,
        protected location: Location,
        public dfp: DateFormatPipe
    ) {
        super(MatrixDetailView.matrixDvRedirect, tourneyService, meetingService, levelService, router, location, dfp)
    } 
    
    ngOnInit() {
        super.ngOnInit();
        this.prepareEliminatoryGui();
        this.classificationCols = this.tourneyService.classificationReducedCols;
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

