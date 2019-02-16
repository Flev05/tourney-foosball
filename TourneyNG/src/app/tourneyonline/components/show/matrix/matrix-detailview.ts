import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Round } from 'app/tourneyonline/domain/round';
import { Cell } from 'app/tourneyonline/domain/cell';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Team } from 'app/tourneyonline/domain/team';
import { Router } from '@angular/router';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './matrix-detailview.html',
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
export class MatrixDetailView extends AbstractDetailView {
    static matrixDvRedirect: string = "matrix/lv/dv";
    
    msgs: Message[] = [];

    selectedRound: Round;
    
    fullAddress: string;

    roundName: string;

    cols: any[];
    matrix: Matrix;
    classificationRows: any[];
    classificationCols: TableCols[];

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("MatrixDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.roundName = this.selectedRound.name;
        this.matrix = this.selectedRound.matrix;

        if(this.selectedRound.classification.length==0) {
            for(let t of this.selectedRound.teams) {
                let cl: Classification = this.tourneyService.newClassification(t, 0);
                this.selectedRound.classification.push(cl);
            }        
        }
        this.classificationRows = this.prepareClassificationGui();

        this.cols = this.prepareCols(this.cols);
        
        // Create matrix
        if(this.matrix == null ) {
            this.prepareMatrix();            
        }
    }

    private prepareCols([]): any[]  {
        let cols = [];
        let col = { field: 'teamName', header: 'Squadre', style: 'style0' };
        cols.push(col);
        col = { field: 'littleName', header: '+', style: 'style1' };
        cols.push(col);

        var letter: String = "A";
        for (let i = 0; i < this.selectedRound.teams.length; i++) {
            let col = { field: 'points', header: letter, style: 'style0' };
            cols.push(col);
            letter = this.getNextLetter(letter);
        }
        col = { field: 'total', header: 'Tot', style: 'style1' };
        cols.push(col);
        
        return cols;
    }

    private prepareMatrix() {
        this.matrix = {
            id: this.tourneyService.getSequenceNumber(),
            rows: []
        };

        let letter: String = "A";
        for (let i = 0; i < this.selectedRound.teams.length; i++) {
            let cells = new Array<Cell>();
            let row = {
                id: i,
                cells: cells
            };
            this.matrix.rows.push(row);
            let c1 = this.selectedRound.teams[i];
            let c: Cell = this.newCell(null, null, c1.teamName, 'style0', false, false, 0, 0);
            cells.push(c);
            c = this.newCell(null, null, letter.toString(), 'style1', false, false, 0, 0);
            cells.push(c);
            letter = this.getNextLetter(letter);
            for (let j = 0; j < this.selectedRound.teams.length; j++) {
                let c2 = this.selectedRound.teams[j];
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
    }

    onPointChange(cb: CellCombobox) {
        console.log( cb );

        this.alignSimmetricCell(cb);

        this.save();
    }

    private alignSimmetricCell(cb: CellCombobox){
        
        let c = cb.row + 2;
        let r = cb.col;

        if(!this.matrix.rows[r].cells[c].isVisited) {
            this.selectedRound.classification[cb.row].played++;
            this.selectedRound.classification[cb.col].played++;
        }

        if(cb.value == this.selectedTourney.matchWinnerScores) {
            this.matrix.rows[r].cells[c].points.value = 0;
            this.matrix.rows[r].cells[c].points.label = "0";
        }
        if(cb.value == 0) {
            this.matrix.rows[r].cells[c].points.value = this.selectedTourney.matchWinnerScores;
            this.matrix.rows[r].cells[c].points.label = "" + this.selectedTourney.matchWinnerScores;
        }

        if(cb.value == this.selectedTourney.pointsGoldenGoalTieBreakWin) {
            this.matrix.rows[r].cells[c].points.value = this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
            this.matrix.rows[r].cells[c].points.label = "" + this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
        }
        if(cb.value == this.selectedTourney.pointsGoldenGoalTieBreakDefeat) {
            this.matrix.rows[r].cells[c].points.label = "" + this.selectedTourney.pointsGoldenGoalTieBreakWin;
            this.matrix.rows[r].cells[c].points.value = this.selectedTourney.pointsGoldenGoalTieBreakWin;
        }

        this.matrix.rows[r].cells[c].isVisited = true;
        this.matrix.rows[c-2].cells[r+2].isVisited = true;
    }
    
    private newCell(t1: Team, t2: Team, field: string, style: string, isEditable: boolean, isTotal: boolean, row: number, col: number): Cell {

        let options: CellCombobox[] = [];
        if(t1 != null && t2 != null) {            
            for(let i=0; i<=this.selectedTourney.matchWinnerScores; i++) {
                let cb: CellCombobox = {label: "" + i, value: i, row: row, col: col};
                options.push(cb);
            }
        }

        let cell: Cell = {
              id: this.tourneyService.getSequenceNumber()
            , field: field
            , style: style
            , points: { label: "", value: 0, row: row, col: col }
            , isEditable: isEditable
            , isTotal: isTotal
            , isVisited: false
            , team1Id: t1 == null? 0: t1.id
            , team2Id: t2 == null? 0: t2.id
            , options: options
        };

        return cell;
    }

    getNextLetter(char: String): String {
        var code: number = char.charCodeAt(0);
        code++;
        return String.fromCharCode(code);
    }
 
    save() {
        for(let i=0; i<this.matrix.rows.length; i++) {
            let r = this.matrix.rows[i];
            let sum: number = 0;
            let sumWon: number = 0;
            let sumLost: number = 0;
            for(let j=2; j<r.cells.length-1; j++) {
                let c: Cell = r.cells[j];
                sum += c.points.value;
                if((c.isVisited && c.points.value==0) 
                    || c.points.value == this.selectedTourney.pointsGoldenGoalTieBreakDefeat) 
                {
                    sumLost++;
                }
                if(c.points.value==this.selectedTourney.matchWinnerScores || c.points.value == this.selectedTourney.pointsGoldenGoalTieBreakWin) {
                    sumWon++;
                }
                if(c.points.label!="") {
                    c.style = 'totalStyle';
                }

                this.updateMeeting(c);
            }
            r.cells[r.cells.length-1].points = {label: "" + sum, value: sum, row: 0, col: 0};
            this.selectedRound.classification[i].points = sum;
            this.selectedRound.classification[i].won = sumWon;
            this.selectedRound.classification[i].lost = sumLost;
        }

        this.selectedRound.matrix = this.matrix;

        this.classificationRows = this.prepareClassificationGui();

        this.tourneyService.saveTourney(this.selectedTourney).subscribe(n => this.next(n));
    }

    private prepareClassificationGui(): any[] {
        this.classificationCols = [
            { field: 'rowNumber',   header: 'N°'},
            { field: 'teamName',    header: 'Team'},
            { field: 'points',      header: 'Pt.'},
            { field: 'played',      header: 'G'},
            { field: 'won',         header: 'V'},
            { field: 'lost',        header: 'P'},
            { field: 'balanced',    header: 'N'},
        ];

        let sortedClassification = [...this.selectedRound.classification];

        sortedClassification.sort((c1, c2) => {

            if (c1.points > c2.points) {
                return -1;
            }
            if (c1.points < c2.points) {
                return 1;
            }

            return 0;
        });

        let row : number = 0;
        let rows: any[] = [];

        let r = 0;
        for (let c of sortedClassification) {
            
            rows.push(c);
            rows[row].rowNumber = ++r;    
            rows[row].roundName = this.selectedRound.name;    
            rows[row].teamName = c.team.teamName;    
            rows[row].points = c.points;    
            rows[row].played = c.played;    
            rows[row].won = c.won;    
            rows[row].lost = c.lost;    
            rows[row].balanced = c.balanced;    

            row++;                
        }

        return rows;
    }

    private updateMeeting(c: Cell): any {
        for(let m of this.selectedRound.onewayMeetings) {
            if(m.team1.id == c.team1Id) {
                m.points1 = c.points.value;
            }
            if(m.team2.id == c.team2Id) {
                m.points2 = c.points.value;
            }
        }
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica matrix fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
