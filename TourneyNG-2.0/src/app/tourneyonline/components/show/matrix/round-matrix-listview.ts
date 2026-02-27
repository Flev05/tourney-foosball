import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { AbstractRoundResultListView } from 'app/tourneyonline/components/common/abstract-round-result-listview';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { MatrixService } from './matrix-service';

@Component({
    templateUrl: './round-matrix-listview.html',
    styleUrls: ['./matrix-view.css','../classification/classification-view.css']
})
export class RoundMatrixListView extends AbstractRoundResultListView {
    roundName: string;
    cols: any[];
    onewayMatrix: Matrix;
    roundtripMatrix: Matrix;

    legendCols: any[];
    legendRows: any[];
    meetingsNoMsg: string;

    constructor( public tourneyService: TourneyService
        , protected meetingRoundService: MeetingRoundService
        , public meetingService: MeetingService
        , protected router: Router 
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected teamService: TeamService
        , private matrixService: MatrixService
    ) {
        super(""
            , tourneyService
            , meetingRoundService
            , meetingService
            , router
            , location
            , dfp
            , teamService
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.classificationCols = this.tourneyService.classificationReducedCols;

        this.matrixService.ngOnInit(this.selectedTourney, this.selectedRound);

        this.roundName = this.matrixService.roundName;
        this.onewayMatrix = this.matrixService.onewayMatrix;
        this.roundtripMatrix = this.matrixService.roundtripMatrix;

        this.cols =  this.matrixService.cols;

        this.legendCols = this.matrixService.legendCols;
        this.legendRows = this.matrixService.legendRows;

        this.meetingsNoMsg = "" + this.selectedRound.onewayMeetings.length;
    }
 
    onOnewayPointChange(cb: CellCombobox) {
        console.log( cb );
        this.matrixService.onOnewayRoundPointChange(cb, this.selectedRound.id);
    }

    onRoundtripPointChange(cb: CellCombobox) {
        console.log( cb );
        this.matrixService.onRoundtripRoundPointChange(cb, this.selectedRound.id);
    }
}

