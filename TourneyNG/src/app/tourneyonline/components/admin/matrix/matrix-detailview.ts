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


@Component({
    templateUrl: './matrix-detailview.html',
    styles: [`
        .style0 {
            disabled: true !important;
        }
        .diagonalStyle {
            background-color: black !important;
            disabled: true !important;
        }
        .totalStyle {
            background-color: black !important;
            disabled: false !important;
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
    matrix: Matrix[];

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

        this.cols = [];
        let col = { field: 'teamName', header: 'Squadre' };
        this.cols.push(col);
        col = { field: 'littleName', header: '+' };
        this.cols.push(col);

        var letter: String = "A";
        for(let i=0; i<this.selectedRound.teams.length; i++) {
            let t = this.selectedRound.teams[i];
            let col = {field: 'points' + i, header: letter, style: 'style'};
            this.cols.push(col);
            letter = this.getNextLetter(letter);
        }
        
        // Create matrix
        if(this.matrix == undefined || this.matrix == []) {
            this.matrix = [];

            var letter: String = "A";
            let r = 0;
            let sum: number = 0;
            for(let i=0; i<this.selectedRound.teams.length; i++ ) {
                let t = this.selectedRound.teams[i];
                let currentStyle: string = null;
                if(i>=0 && i<=1) {
                    currentStyle = 'style0';
                } else if(i==r) {
                    currentStyle = 'diagonalStyle';
                }
                let m : Matrix = {
                      id: this.tourneyService.getSequenceNumber()
                    , littleName: letter.toString()
                    , teamName: t.teamName
                    , style: currentStyle
                };
                this.matrix.push(m);
                letter = this.getNextLetter(letter);
                r++;                
            }
        }
    }

    getNextLetter(char: String): String {
        var code: number = char.charCodeAt(0);
        code++;
        return String.fromCharCode(code);
    }

    save() {
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
