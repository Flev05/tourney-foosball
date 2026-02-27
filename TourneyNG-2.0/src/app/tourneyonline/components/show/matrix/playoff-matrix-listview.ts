import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingPlayoffService } from 'app/tourneyonline/components/admin/playoff/meeting-playoff-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { AbstractPlayoffResultListView } from 'app/tourneyonline/components/common/abstract-playoff-result-listview';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { MatrixService } from './matrix-service';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';

@Component({
    templateUrl: './playoff-matrix-listview.html',
    styleUrls: ['./matrix-view.css','../classification/classification-view.css']
})
export class PlayoffMatrixListView extends AbstractPlayoffResultListView {
    roundName: string = "";
    onewayMatrix: Matrix = new Matrix();
    roundtripMatrix: Matrix = new Matrix();
    legendCols: any[] = [];
    legendRows: any[] = [];
    meetingsNoMsg: string = "";

    constructor( public override tourneyService: TourneyService
        , protected override meetingPlayoffService: MeetingPlayoffService
        , protected override meetingService: MeetingService
        , protected override router: Router
        , protected override location: Location
        , protected override dfp: DateFormatPipe
        , protected override levelService: LevelService
        , private matrixService: MatrixService
    ) {
        super(""
            , tourneyService
            , meetingPlayoffService
            , meetingService
            , router
            , location
            , dfp
            , levelService
            );
    }

    override ngOnInit() {
        super.ngOnInit();
        this.classificationCols = this.tourneyService.classificationReducedCols;

        this.matrixService.ngOnInit(this.selectedTourney, this.selectedPlayoff.round);

        this.roundName = this.matrixService.roundName;
        this.onewayMatrix = this.matrixService.onewayMatrix;
        this.roundtripMatrix = this.matrixService.roundtripMatrix;

        this.cols =  this.matrixService.cols;
        this.legendCols = this.matrixService.legendCols;
        this.legendRows = this.matrixService.legendRows;
        this.meetingsNoMsg = "" + this.selectedPlayoff.round.onewayMeetings.length;
     }
 
    onOnewayPointChange(cb: CellCombobox) {
        console.log( cb );
        this.matrixService.onOnewayPlayoffPointChange(cb, this.selectedPlayoff.id);
    }

    onRoundtripPointChange(cb: CellCombobox) {
        console.log( cb );
        this.matrixService.onRoundtripPlayoffPointChange(cb, this.selectedPlayoff.id);
    }
}

