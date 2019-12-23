import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DateFormatPipe } from '../../common/date-format-pipe';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { AbstractPlayoffResultListView } from '../../common/abstract-playoff-result-listview';
import { MatrixDetailView } from './matrix-detailview';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { MatrixService } from './matrix-service';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';

@Component({
    templateUrl: './playoff-matrix-listview.html',
    styles: [`
        .style0 {
            width: auto;
        }
        .style1 {
            width: 10mm;
            font-weight: 700;
            color: #333333;
        }
        .totalStyle {
            width: 10mm;
            font-weight: 700;
            background-color: yellow !important;
            color: black;
        }
        .diagonalStyle {
            background-color: black !important;
            disabled;
        }
        .lastStyle {
            background-color: black !important;
            disabled: false !important;
        }
    `
    ]    
})
export class PlayoffMatrixListView extends AbstractPlayoffResultListView {
    roundName: string;
    cols: any[];
    onewayMatrix: Matrix;
    roundtripMatrix: Matrix;
    
    constructor( public tourneyService: TourneyService
        , protected meetingPlayoffService: MeetingPlayoffService
        , protected meetingService: MeetingService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected levelService: LevelService
        , private matrixService: MatrixService
    ) {
        super(MatrixDetailView.matrixDvRedirect
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

        this.roundName = this.matrixService.round.name;
        this.onewayMatrix = this.matrixService.round.onewayMatrix;
        this.roundtripMatrix = this.matrixService.round.roundtripMatrix;

        this.cols =  this.matrixService.cols;
        
        this.onewayMatrix = this.matrixService.onewayMatrix;            
        this.roundtripMatrix = this.matrixService.roundtripMatrix;  
     }
 
    onOnewayPointChange(cb: CellCombobox) {
        console.log( cb );
        this.matrixService.onOnewayPointChange(cb);
    }

    onRoundtripPointChange(cb: CellCombobox) {
        console.log( cb );
        this.matrixService.onRoundtripPointChange(cb);
    }

}

