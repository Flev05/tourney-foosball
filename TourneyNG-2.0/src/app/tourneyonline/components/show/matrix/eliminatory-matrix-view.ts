import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Round } from 'app/tourneyonline/domain/round';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MatrixService } from './matrix-service';

@Component({
    styleUrls: ['./matrix-view.css'],
    templateUrl: './eliminatory-matrix-view.html',
    standalone: false
})
export class MatrixDetailView extends AbstractDetailView {
    selectedRound: Round = new Round();
 
    roundName: string = "";
    cols: any[] = [];
    onewayMatrix: Matrix = new Matrix();
    matrix: Matrix = new Matrix();
    roundtripMatrix: Matrix = new Matrix();
    classificationCols: TableCols[] = [];
    legendCols: any[] = [];
    legendRows: any[] = [];

    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected router: Router,
        private matrixService: MatrixService
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.classificationCols = this.tourneyService.classificationReducedCols;

        this.selectedRound = this.tourneyService.selectedRound;
        this.matrixService.ngOnInit(this.selectedTourney, this.selectedRound);

        this.roundName = this.matrixService.roundName;
        this.onewayMatrix = this.matrixService.onewayMatrix;
        this.roundtripMatrix = this.matrixService.roundtripMatrix;

        if( this.tourneyService.selectedEliminatoryTabIndex == 0 ) {
            this.matrix = this.matrixService.onewayMatrix;
        } else {
            this.matrix = this.matrixService.roundtripMatrix;
        }

        this.cols =  this.matrixService.cols;
        this.legendCols = this.matrixService.legendCols;
        this.legendRows = this.matrixService.legendRows;
    }
 
    onPointChange(cb: CellCombobox) {
        console.log( cb );
        if( this.tourneyService.selectedEliminatoryTabIndex == 0 ) {
            this.matrixService.onOnewayEliminatoryPointChange(cb, this.selectedRound.id);
            this.matrix = this.matrixService.onewayMatrix;
        } else {
            this.matrixService.onRoundtripEliminatoryPointChange(cb, this.selectedRound.id);
            this.matrix = this.matrixService.roundtripMatrix;
        }
    }
}
