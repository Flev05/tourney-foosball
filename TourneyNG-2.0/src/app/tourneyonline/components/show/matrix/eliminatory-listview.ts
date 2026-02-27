import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { AbstractResultEliminatoryListView } from 'app/tourneyonline/components/common/abstract-result-eliminatory-listview';
import { ClientService } from 'app/tourneyonline/service/client-service';

const matrixDvRedirect: string = "matrix/lv/dv";
@Component({
    templateUrl: './eliminatory-listview.html',
    styleUrls: ['../classification/classification-view.css']
})
export class EliminatoryListView extends AbstractResultEliminatoryListView {

    constructor(
        public override tourneyService: TourneyService
        , protected override meetingService: MeetingService
        , protected override levelService: LevelService
        , protected override clientService: ClientService
        , protected override router: Router
        , protected override location: Location
        , public override dfp: DateFormatPipe 
    ) {
        super(matrixDvRedirect, tourneyService, meetingService, levelService, clientService, router, location, dfp)
    } 
    
    override ngOnInit() {
        super.ngOnInit();
        this.levelService.loadAllEliminatoryMeetingByIdList(this.selectedTourney.eliminatoryLevels, () => this.onEliminatoryLoadComplete(), e => this.serverUnreachableHandler(e));
    }

    private onEliminatoryLoadComplete(): void {
        super.onLoadComplete(this.selectedTourney.eliminatoryLevels, false);
        this.prepareEliminatoryGui();
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols.concat(this.tourneyService.classificationReducedCols);
    }
    
    override onEliminatoryRowSelect(event : any) {
        console.log("Entering onEliminatoryRowSelect()");
        this.meetingService.selectedMeeting = this.selectedRow;      
        if( this.selectedRow.isSkiping || this.selectedRow.containerId ==null ) {
            return;
        }
        this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedRow.containerId;
        let el =  this.eliminatoryRows.find( e => e.eliminatory.id == this.selectedRow.containerId );
        if( el ) {
            this.eliminatorySelectedRow = el;
        }
        this.tourneyService.selectedRound = this.eliminatorySelectedRow.eliminatory.round;
        this.gotoDetailView();
    }
}

