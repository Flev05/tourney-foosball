import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Round } from 'app/tourneyonline/domain/round';
import { Cell } from 'app/tourneyonline/domain/cell';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { Team } from 'app/tourneyonline/domain/team';
import { Router } from '@angular/router';

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
    matrix: Matrix = null;

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
                let cl: Classification = this.newClassification(t, 0);
                this.selectedRound.classification.push(cl);
            }        
        }

        this.cols = [];
        let col = { field: 'teamName', header: 'Squadre', style: 'style0' };
        this.cols.push(col);
        col = { field: 'littleName', header: '+', style: 'style1' };
        this.cols.push(col);

        var letter: String = "A";
        for(let i=0; i<this.selectedRound.classification.length; i++) {
            let t = this.selectedRound.classification[i];
            let col = {field: 'points', header: letter, style: 'style0'};
            this.cols.push(col);
            letter = this.getNextLetter(letter);
        }
        col = { field: 'total', header: 'Tot', style: 'style1' };
        this.cols.push(col);
        
        // Create matrix
        if(this.matrix == null ) {
            this.matrix = {
                  id:this.tourneyService.getSequenceNumber()
                , rows:[]
            };

            var letter: String = "A";
            for(let i=0; i<this.selectedRound.classification.length; i++ ) {
                
                let cells = new Array<Cell>();
                
                let row = {
                      id: i
                    , cells: cells
                }
                this.matrix.rows.push(row);
                
                let c1 = this.selectedRound.classification[i];
                let c : Cell = this.newCell(null, null, c1.team.teamName, 'style0', false, false, 0, 0);
                cells.push(c);

                c = this.newCell(null, null, letter.toString(), 'style1', false, false, 0, 0);
                cells.push(c);
                letter = this.getNextLetter(letter);                            

                for(let j=0; j<this.selectedRound.classification.length; j++ ) {
                    let c2 = this.selectedRound.classification[j];

                    if(i==j) { 
                        c = this.newCell(null, null, "", 'diagonalStyle', false, false, 0, 0);
                      } else {
                        c = this.newCell(c1.team, c2.team, "", 'style0', true, false, i, j);
                    }    
                    cells.push(c);
                }          

                c = this.newCell(null, null, "", 'totalStyle', false, true, 0, 0);     
                cells.push(c);
            }            
        }
    }

    onPointChange(cb: CellCombobox) {
        console.log( cb );

        let r = cb.row;
        let c = cb.col;

        // this.alignSimmetricCell(cb, c, r);
        // this.router.navigate([MatrixDetailView.matrixDvRedirect]);
    }

    private alignSimmetricCell(cb: CellCombobox, i: number, j: number){
        
        let r = cb.row;
        let c = cb.col;

        if(cb.value == this.selectedTourney.matchWinnerScores) {
            this.matrix.rows[c].cells[r].points.value = 0;
            this.matrix.rows[c].cells[r].points.label = "0";
        }
        if(cb.value == 0) {
            this.matrix.rows[c].cells[r].points.value = this.selectedTourney.matchWinnerScores;
            this.matrix.rows[c].cells[r].points.label = "" + this.selectedTourney.matchWinnerScores;
        }

        if(cb.value == this.selectedTourney.pointsGoldenGoalTieBreakWin) {
            this.matrix.rows[c].cells[r].points.value = this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
            this.matrix.rows[c].cells[r].points.label = "" + this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
        }
        if(cb.value == this.selectedTourney.pointsGoldenGoalTieBreakDefeat) {
            this.matrix.rows[c].cells[r].points.label = "" + this.selectedTourney.pointsGoldenGoalTieBreakWin;
        }
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
            for(let j=2; j<r.cells.length-1; j++) {
                let c: Cell = r.cells[j];
                sum += c.points.value;
                if(c.points.label!="") {
                    c.style = 'totalStyle';
                }

                this.updateMeeting(c);
            }
            r.cells[r.cells.length-1].points = {label: "" + sum, value: sum, row: 0, col: 0};
            this.selectedRound.classification[i].points = sum;
        }

        this.selectedRound.matrix = this.matrix;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    private updateMeeting(c: Cell): any {
        

        for(let m of this.selectedRound.meetings) {
            if(m.team1.id == c.team1Id) {
                m.points1 = c.points.value;
            }
            if(m.team2.id == c.team2Id) {
                m.points2 = c.points.value;
            }
            this.tourneyService.sendMessage(m);
        }
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica matrix fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
