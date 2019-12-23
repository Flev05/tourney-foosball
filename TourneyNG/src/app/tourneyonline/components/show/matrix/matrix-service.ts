import {  Injectable } from '@angular/core';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { Cell } from 'app/tourneyonline/domain/cell';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Observable, of } from 'rxjs';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Tourney } from 'app/tourneyonline/domain/tourney';

@Injectable()
export class MatrixService   {
    roundName: string;
    cols: any[];
    onewayMatrix: Matrix;
    roundtripMatrix: Matrix;
    round: Round;
    tourney: Tourney;

    constructor( public tourneyService: TourneyService, private clientService: ClientService) 
    {}

    ngOnInit(tourney:Tourney, round: Round) {

        this.tourney = tourney;
        this.round = round;

        this.roundName = this.round.name;
        this.onewayMatrix = this.round.onewayMatrix;
        this.roundtripMatrix = this.round.roundtripMatrix;

        this.cols = this.prepareCols(this.cols);
        
        // Create onewayMatrix
        if(this.onewayMatrix == null ) {
            this.onewayMatrix = this.prepareMatrix(this.onewayMatrix);            
            this.roundtripMatrix = this.prepareMatrix(this.roundtripMatrix);            
        }
    }

    private prepareCols([]): any[]  {
        let cols = [];
        let col = { field: 'teamName', header: 'Squadre', style: 'style0' };
        cols.push(col);
        col = { field: 'littleName', header: '+', style: 'style1' };
        cols.push(col);

        var letter: String = "A";
        for (let i = 0; i < this.round.teamNames.length; i++) {
            let col = { field: 'points', header: letter, style: 'style0' };
            cols.push(col);
            letter = this.getNextLetter(letter);
        }
        col = { field: 'total', header: 'Tot', style: 'style1' };
        cols.push(col);
        
        return cols;
    }

    private prepareMatrix( matrix: Matrix): Matrix {
        matrix = {
            id: null, // this.tourneyService.getSequenceNumber(),
            rows: []
        };

        let letter: String = "A";
        for (let i = 0; i < this.round.teamNames.length; i++) {
            let cells = new Array<Cell>();
            let row = {
                id: i,
                cells: cells
            };
            matrix.rows.push(row);
            let c1 = this.round.teamNames[i];
            let c: Cell = this.newCell(null, null, c1, 'style0', false, false, 0, 0);
            cells.push(c);
            c = this.newCell(null, null, letter.toString(), 'style1', false, false, 0, 0);
            cells.push(c);
            letter = this.getNextLetter(letter);
            for (let j = 0; j < this.round.teamNames.length; j++) {
                let c2 = this.round.teamNames[j];
                if (i == j) {
                    c = this.newCell(null, null, "", 'diagonalStyle', false, false, 0, 0);
                }
                else {
                    c = this.newCell(c1, c2, "", 'style0', true, false, i, j);
                }
                cells.push(c);
            }
            c = this.newCell(null, null, "", 'totalStyle', false, true, 0, 0);
            cells.push(c);
        }    
        return matrix;     
    }

    onOnewayPointChange(cb: CellCombobox) {
        console.log( cb );

        this.alignSimmetricCell(cb, this.onewayMatrix);

        this.save(this.onewayMatrix);
    }

    onRoundtripPointChange(cb: CellCombobox) {
        console.log( cb );

        this.alignSimmetricCell(cb, this.roundtripMatrix);

        this.save(this.roundtripMatrix);
    }

    private alignSimmetricCell(cb: CellCombobox, matrix: Matrix){
        
        let c = cb.row + 2;
        let r = cb.col;

        if(!matrix.rows[r].cells[c].isVisited) {
            this.round.classification[cb.row].played++;
            this.round.classification[cb.col].played++;
        }

        if(cb.value == this.tourney.matchWinnerScores) {
            matrix.rows[r].cells[c].points.value = 0;
            matrix.rows[r].cells[c].points.label = "0";
        }
        if(cb.value == 0) {
            matrix.rows[r].cells[c].points.value = this.tourney.matchWinnerScores;
            matrix.rows[r].cells[c].points.label = "" + this.tourney.matchWinnerScores;
        }

        if(cb.value == this.tourney.pointsGoldenGoalTieBreakWin) {
            matrix.rows[r].cells[c].points.value = this.tourney.pointsGoldenGoalTieBreakDefeat;
            matrix.rows[r].cells[c].points.label = "" + this.tourney.pointsGoldenGoalTieBreakDefeat;
        }
        if(cb.value == this.tourney.pointsGoldenGoalTieBreakDefeat) {
            matrix.rows[r].cells[c].points.label = "" + this.tourney.pointsGoldenGoalTieBreakWin;
            matrix.rows[r].cells[c].points.value = this.tourney.pointsGoldenGoalTieBreakWin;
        }

        matrix.rows[r].cells[c].isVisited = true;
        matrix.rows[c-2].cells[r+2].isVisited = true;
    }
    
    private newCell(teamName1: string, teamName2: string, field: string, style: string, isEditable: boolean, isTotal: boolean, row: number, col: number): Cell {

        let options: CellCombobox[] = [];
        if(teamName1 != null && teamName2 != null) {            
            for(let i=0; i<=this.tourney.matchWinnerScores; i++) {
                let cb: CellCombobox = {label: "" + i, value: i, row: row, col: col};
                options.push(cb);
            }
        }

        let cell: Cell = {
              id: null // this.tourneyService.getSequenceNumber()
            , field: field
            , style: style
            , points: { label: "", value: 0, row: row, col: col }
            , isEditable: isEditable
            , isTotal: isTotal
            , isVisited: false
            , teamName1: teamName1 == null ? "" : teamName1
            , teamName2: teamName2 == null ? "" : teamName2
            , options: options
        };

        return cell;
    }

    private getNextLetter(char: String): String {
        var code: number = char.charCodeAt(0);
        code++;
        return String.fromCharCode(code);
    }
 
    private save(matrix: Matrix) {
        for(let i=0; i<matrix.rows.length; i++) {
            let r = matrix.rows[i];
            let sum: number = 0;
            let sumWon: number = 0;
            let sumLost: number = 0;
            for(let j=2; j<r.cells.length-1; j++) {
                let c: Cell = r.cells[j];
                sum += c.points.value;
                if((c.isVisited && c.points.value==0) 
                    || c.points.value == this.tourney.pointsGoldenGoalTieBreakDefeat) 
                {
                    sumLost++;
                }
                if(c.points.value==this.tourney.matchWinnerScores || c.points.value == this.tourney.pointsGoldenGoalTieBreakWin) {
                    sumWon++;
                }
                if(c.points.label!="") {
                    c.style = 'totalStyle';
                }

                this.updateMeeting(c);
            }
            r.cells[r.cells.length-1].points = {label: "" + sum, value: sum, row: 0, col: 0};
            this.round.classification[i].points = sum;
            this.round.classification[i].won = sumWon;
            this.round.classification[i].lost = sumLost;
        }

        this.round.onewayMatrix = matrix;

        // this.classificationRows = this.prepareClassificationGui();

        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.tourney, this.clientService.selectedClient);
        this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation')).subscribe(n => this.next(n));
    }

    private next(n: any) {
        console.log(n);
    }

    private saveTourneyErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            
            return of(result as T);
        };
    }

    private updateMeeting(c: Cell): any {
        for(let m of this.round.onewayMeetings) {
            if(m.teamName1  == c.teamName1) {
                m.points1 = c.points.value;
            }
            if(m.teamName2 == c.teamName2) {
                m.points2 = c.points.value;
            }
        }
    }
}

