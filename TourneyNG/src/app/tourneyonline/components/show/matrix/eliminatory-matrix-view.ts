import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Round } from 'app/tourneyonline/domain/round';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Router } from '@angular/router';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MatrixService } from './matrix-service';

@Component({
    templateUrl: './eliminatory-matrix-view.html',
    styleUrls: ['./matrix-view.css']
})
export class MatrixDetailView extends AbstractDetailView {
    selectedRound: Round;
 
    roundName: string;
    cols: any[];
    onewayMatrix: Matrix;
    matrix: Matrix;
    roundtripMatrix: Matrix;
    classificationCols: TableCols[];

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected router: Router,
        private matrixService: MatrixService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
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

    // ngOnInit() {
    //     console.log("MatrixDetailView.ngOnInit() ");

    //     super.ngOnInit();

    //     this.selectedRound = this.tourneyService.selectedRound;
    //     this.roundName = this.selectedRound.name;

        // if(this.selectedRound.classification.length==0) {
        //     for(let t of this.selectedRound.teamNames) {
        //         let cl: Classification = this.tourneyService.newClassification(t, 0);
        //         this.selectedRound.classification.push(cl);
        //     }        
        // }
        // this.classificationRows = this.prepareClassificationGui();

    //     this.cols = this.prepareCols(this.cols);
        
    //     // Create onewayMatrix
    //     if(this.onewayMatrix == null ) {
    //         this.prepareMatrix();            
    //     }
    // }

    // private prepareCols([]): any[]  {
    //     let cols = [];
    //     let col = { field: 'teamName', header: 'Squadre', style: 'style0' };
    //     cols.push(col);
    //     col = { field: 'littleName', header: '+', style: 'style1' };
    //     cols.push(col);

    //     var letter: String = "A";
    //     for (let i = 0; i < this.selectedRound.teamNames.length; i++) {
    //         let col = { field: 'points', header: letter, style: 'style0' };
    //         cols.push(col);
    //         letter = this.getNextLetter(letter);
    //     }
    //     col = { field: 'total', header: 'Tot', style: 'style1' };
    //     cols.push(col);
        
    //     return cols;
    // }

    // private prepareMatrix() {
    //     this.onewayMatrix = {
    //         id: null, // this.tourneyService.getSequenceNumber(),
    //         rows: []
    //     };

    //     let letter: String = "A";
    //     for (let i = 0; i < this.selectedRound.teamNames.length; i++) {
    //         let cells = new Array<Cell>();
    //         let row = {
    //             id: i,
    //             cells: cells
    //         };
    //         this.onewayMatrix.rows.push(row);
    //         let c1 = this.selectedRound.teamNames[i];
    //         let c: Cell = this.newCell(null, null, c1, 'style0', false, false, 0, 0);
    //         cells.push(c);
    //         c = this.newCell(null, null, letter.toString(), 'style1', false, false, 0, 0);
    //         cells.push(c);
    //         letter = this.getNextLetter(letter);
    //         for (let j = 0; j < this.selectedRound.teamNames.length; j++) {
    //             let c2 = this.selectedRound.teamNames[j];
    //             if (i == j) {
    //                 c = this.newCell(null, null, "", 'diagonalStyle', false, false, 0, 0);
    //             }
    //             else {
    //                 c = this.newCell(c1, c2, "", 'style0', true, false, i, j);
    //             }
    //             cells.push(c);
    //         }
    //         c = this.newCell(null, null, "", 'totalStyle', false, true, 0, 0);
    //         cells.push(c);
    //     }         
    // }

    // onPointChange(cb: CellCombobox) {
    //     console.log( cb );

    //     this.alignSimmetricCell(cb);

    //     this.save();
    // }

    // private alignSimmetricCell(cb: CellCombobox){
        
    //     let c = cb.row + 2;
    //     let r = cb.col;

    //     if(!this.onewayMatrix.rows[r].cells[c].isVisited) {
    //         this.selectedRound.classification[cb.row].played++;
    //         this.selectedRound.classification[cb.col].played++;
    //     }

    //     if(cb.value == this.selectedTourney.matchWinnerScores) {
    //         this.onewayMatrix.rows[r].cells[c].points.value = 0;
    //         this.onewayMatrix.rows[r].cells[c].points.label = "0";
    //     }
    //     if(cb.value == 0) {
    //         this.onewayMatrix.rows[r].cells[c].points.value = this.selectedTourney.matchWinnerScores;
    //         this.onewayMatrix.rows[r].cells[c].points.label = "" + this.selectedTourney.matchWinnerScores;
    //     }

    //     if(cb.value == this.selectedTourney.pointsGoldenGoalTieBreakWin) {
    //         this.onewayMatrix.rows[r].cells[c].points.value = this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
    //         this.onewayMatrix.rows[r].cells[c].points.label = "" + this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
    //     }
    //     if(cb.value == this.selectedTourney.pointsGoldenGoalTieBreakDefeat) {
    //         this.onewayMatrix.rows[r].cells[c].points.label = "" + this.selectedTourney.pointsGoldenGoalTieBreakWin;
    //         this.onewayMatrix.rows[r].cells[c].points.value = this.selectedTourney.pointsGoldenGoalTieBreakWin;
    //     }

    //     this.onewayMatrix.rows[r].cells[c].isVisited = true;
    //     this.onewayMatrix.rows[c-2].cells[r+2].isVisited = true;
    // }
    
    // private newCell(teamName1: string, teamName2: string, field: string, style: string, isEditable: boolean, isTotal: boolean, row: number, col: number): Cell {

    //     let options: CellCombobox[] = [];
    //     if(teamName1 != null && teamName2 != null) {            
    //         for(let i=0; i<=this.selectedTourney.matchWinnerScores; i++) {
    //             let cb: CellCombobox = {label: "" + i, value: i, row: row, col: col};
    //             options.push(cb);
    //         }
    //     }

    //     let cell: Cell = {
    //           id: null // this.tourneyService.getSequenceNumber()
    //         , field: field
    //         , style: style
    //         , points: { label: "", value: 0, row: row, col: col }
    //         , isEditable: isEditable
    //         , isTotal: isTotal
    //         , isVisited: false
    //         , teamName1: teamName1 == null ? "" : teamName1
    //         , teamName2: teamName2 == null ? "" : teamName2
    //         , options: options
    //     };

    //     return cell;
    // }

    // getNextLetter(char: String): String {
    //     var code: number = char.charCodeAt(0);
    //     code++;
    //     return String.fromCharCode(code);
    // }
 
    // private save() {
    //     for(let i=0; i<this.onewayMatrix.rows.length; i++) {
    //         let r = this.onewayMatrix.rows[i];
    //         let sum: number = 0;
    //         let sumWon: number = 0;
    //         let sumLost: number = 0;
    //         for(let j=2; j<r.cells.length-1; j++) {
    //             let c: Cell = r.cells[j];
    //             sum += c.points.value;
    //             if((c.isVisited && c.points.value==0) 
    //                 || c.points.value == this.selectedTourney.pointsGoldenGoalTieBreakDefeat) 
    //             {
    //                 sumLost++;
    //             }
    //             if(c.points.value==this.selectedTourney.matchWinnerScores || c.points.value == this.selectedTourney.pointsGoldenGoalTieBreakWin) {
    //                 sumWon++;
    //             }
    //             if(c.points.label!="") {
    //                 c.style = 'totalStyle';
    //             }

    //             this.updateMeeting(c);
    //         }
    //         r.cells[r.cells.length-1].points = {label: "" + sum, value: sum, row: 0, col: 0};
    //         this.selectedRound.classification[i].points = sum;
    //         this.selectedRound.classification[i].won = sumWon;
    //         this.selectedRound.classification[i].lost = sumLost;
    //     }

    //     // this.classificationRows = this.prepareClassificationGui();

    //     let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
    //     this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation')).subscribe(n => this.next(n));

    // }

    // private saveTourneyErrorHandler<T> (operation = 'operation', result?: T) {
    //     return (res: any): Observable<T> => {
    //         console.log("Entering saveTourneyErrorHandler()");
    //         console.log(`${operation} failed!`);
    //         console.error(res); // log to console instead
            
    //         return of(result as T);
    //     };
    // }
    
    // private prepareClassificationGui(): any[] {
    //     this.classificationCols = [
    //         { field: 'rowNumber',   header: 'N°'},
    //         { field: 'teamName',    header: 'Team'},
    //         { field: 'points',      header: 'Pt.'},
    //         { field: 'played',      header: 'G'},
    //         { field: 'won',         header: 'V'},
    //         { field: 'lost',        header: 'P'},
    //         { field: 'balanced',    header: 'N'},
    //     ];

    //     let sortedClassification = [...this.selectedRound.classification];

    //     sortedClassification.sort((c1, c2) => {

    //         if (c1.points > c2.points) {
    //             return -1;
    //         }
    //         if (c1.points < c2.points) {
    //             return 1;
    //         }

    //         return 0;
    //     });

    //     let row : number = 0;
    //     let rows: any[] = [];

    //     let r = 0;
    //     for (let c of sortedClassification) {
            
    //         rows.push(c);
    //         rows[row].rowNumber = ++r;    
    //         rows[row].roundName = this.selectedRound.name;    
    //         rows[row].teamName = c.teamName;    
    //         rows[row].points = c.points;    
    //         rows[row].played = c.played;    
    //         rows[row].won = c.won;    
    //         rows[row].lost = c.lost;    
    //         rows[row].balanced = c.balanced;    

    //         row++;                
    //     }

    //     return rows;
    // }

    // private updateMeeting(c: Cell): any {
    //     for(let m of this.selectedRound.onewayMeetings) {
    //         if(m.teamName1  == c.teamName1) {
    //             m.points1 = c.points.value;
    //         }
    //         if(m.teamName2 == c.teamName2) {
    //             m.points2 = c.points.value;
    //         }
    //     }
    // }
 
    // onError(n:any) {
    //     console.log('Modifica matrix fallita');
    // }
}
