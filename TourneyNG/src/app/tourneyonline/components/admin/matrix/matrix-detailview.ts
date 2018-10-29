import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Matrix } from '../../../domain/matrix';
import { Round } from 'app/tourneyonline/domain/round';
import { Team } from 'app/tourneyonline/domain/team';
import { Cell } from 'app/tourneyonline/domain/cell';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Combobox } from '../../../domain/tourney-combobox';


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
        private fb: FormBuilder,
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
                    id: this.tourneyService.getSequenceNumber()
                    , cells: cells
                }
                this.matrix.rows.push(row);
                
                let cl = this.selectedRound.classification[i];
                let c : Cell = this.newCell(cl.team.teamName, 'style0', false, false);
                cells.push(c);

                c = this.newCell(letter.toString(), 'style1', false, false);
                cells.push(c);
                letter = this.getNextLetter(letter);                            

                for(let j=0; j<this.selectedRound.classification.length; j++ ) {
                    if(i==j) { 
                        c = this.newCell("", 'diagonalStyle', false, false);
                      } else {
                        c = this.newCell("", 'style0', true, false);
                    }    
                    cells.push(c);
                }          

                c = this.newCell("", 'totalStyle', false, true);     
                cells.push(c);
            }            
        }
    }

    private newCell(field: string, style: string, isEditable: boolean, isTotal: boolean): Cell {
        return {
        id: this.tourneyService.getSequenceNumber()
            , field: field
            , style: style
            , points: { label: "", value: 0 }
            , isEditable: isEditable
            , isTotal: isTotal
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
        for(let r of this.matrix.rows) {
            let sum: number = 0;
            for(let i=2; i<r.cells.length-1; i++) {
                let c: Cell = r.cells[i];
                sum += c.points.value;
                if(c.points.label!="") {
                    c.style = 'totalStyle';
                }
            }
            r.cells[r.cells.length-1].points = {label: "" + sum, value: sum};
        }

        this.selectedRound.matrix = this.matrix;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica matrix fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
