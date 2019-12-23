import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';
import { AbstractRoundResultListView } from '../../common/abstract-round-result-listview';
import { MatrixDetailView } from './matrix-detailview';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { Cell } from 'app/tourneyonline/domain/cell';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Observable, of } from 'rxjs';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { MatrixService } from './matrix-service';

@Component({
    templateUrl: './round-matrix-listview.html',    
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
export class RoundMatrixListView extends AbstractRoundResultListView {
    roundName: string;
    cols: any[];
    onewayMatrix: Matrix;
    roundtripMatrix: Matrix;

    constructor( public tourneyService: TourneyService
        , protected meetingRoundService: MeetingRoundService
        , protected meetingService: MeetingService
        , protected router: Router 
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected teamService: TeamService
        , private matrixService: MatrixService
    ) {
        super(MatrixDetailView.matrixDvRedirect
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

