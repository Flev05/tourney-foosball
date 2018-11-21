import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Round } from 'app/tourneyonline/domain/round';
import { Cell } from 'app/tourneyonline/domain/cell';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Team } from 'app/tourneyonline/domain/team';

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

    msgs: Message[] = [];

    selectedRound: Round;
    
    fullAddress: string;

    roundName: string;

    cols: any[];
    matrix: Matrix = null;

    points: Combobox[];

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
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

        this.points=[];
        for(let i=0; i<=this.selectedTourney.matchWinnerScores; i++) {
            let cb: Combobox = {label: "" + i, value: i};
            this.points.push(cb);
        }
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
                let c : Cell = this.newCell(null, null, c1.team.teamName, 'style0', false, false);
                cells.push(c);

                c = this.newCell(null, null, letter.toString(), 'style1', false, false);
                cells.push(c);
                letter = this.getNextLetter(letter);                            

                for(let j=0; j<this.selectedRound.classification.length; j++ ) {
                    let c2 = this.selectedRound.classification[j];

                    if(i==j) { 
                        c = this.newCell(null, null, "", 'diagonalStyle', false, false);
                      } else {
                        c = this.newCell(c1.team, c2.team, "", 'style0', true, false);
                    }    
                    cells.push(c);
                }          

                c = this.newCell(null, null, "", 'totalStyle', false, true);     
                cells.push(c);
            }            
        }
    }

    private newCell(t1: Team, t2: Team, field: string, style: string, isEditable: boolean, isTotal: boolean): Cell {
        return {
              id: this.tourneyService.getSequenceNumber()
            , field: field
            , style: style
            , points: { label: "", value: 0 }
            , isEditable: isEditable
            , isTotal: isTotal
            , team1Id: t1 == null? 0: t1.id
            , team2Id: t2 == null? 0: t2.id
        };
    }

    getNextLetter(char: String): String {
        var code: number = char.charCodeAt(0);
        code++;
        return String.fromCharCode(code);
    }

    onEditComplete(event) {
        console.log("Entering onEditComplete(" + JSON.stringify(event) + ")");
    }

    save() {
        for(let i=0; i<this.matrix.rows.length; i++) {
            let r = this.matrix.rows[i];
            let sum: number = 0;
            for(let i=2; i<r.cells.length-1; i++) {
                let c: Cell = r.cells[i];
                sum += c.points.value;
                if(c.points.label!="") {
                    c.style = 'totalStyle';
                }

                this.updateMeeting(c);
            }
            r.cells[r.cells.length-1].points = {label: "" + sum, value: sum};
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
