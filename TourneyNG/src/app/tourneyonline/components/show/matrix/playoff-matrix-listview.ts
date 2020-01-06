import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DateFormatPipe } from '../../common/date-format-pipe';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { AbstractPlayoffResultListView } from '../../common/abstract-playoff-result-listview';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { MatrixService } from './matrix-service';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';

@Component({
    templateUrl: './playoff-matrix-listview.html',
    styleUrls: ['./matrix-view.css','../classification/classification-view.css']
})
export class PlayoffMatrixListView extends AbstractPlayoffResultListView {
    roundName: string;
    cols: any[];
    onewayMatrix: Matrix;
    roundtripMatrix: Matrix;
    legendCols: any[];
    legendRows: any[];

    constructor( public tourneyService: TourneyService
        , protected meetingPlayoffService: MeetingPlayoffService
        , protected meetingService: MeetingService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected levelService: LevelService
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

    ngOnInit() {
        super.ngOnInit();
        this.classificationCols = this.tourneyService.classificationReducedCols;

        this.matrixService.ngOnInit(this.selectedTourney, this.selectedPlayoff.round);

        this.roundName = this.matrixService.roundName;
        this.onewayMatrix = this.matrixService.onewayMatrix;
        this.roundtripMatrix = this.matrixService.roundtripMatrix;

        this.cols =  this.matrixService.cols;
        this.legendCols = this.matrixService.legendCols;
        this.legendRows = this.matrixService.legendRows;
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

