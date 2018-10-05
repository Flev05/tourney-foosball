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
})
export class MatrixDetailView extends AbstractDetailView {

    msgs: Message[] = [];

    selectedRound: Round;
    selectedMatrix: Matrix[][];
    
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

        this.selectedMatrix = this.tourneyService.selectedMatrix;

        this.cols = [
            { field: 'teamName', header: 'A' },
            { field: 'points',   header: 'B' },
            { field: 'points',   header: 'C' },
            { field: 'points',   header: 'D' }
        ];

        let headerValue = 'A';
        this.cols = [];
        this.matrix = [];
        for(let i=0; i<=this.selectedRound.teams.length; i++) {
            let t = this.selectedRound.teams[i-1];
            let cell = "";
            if( i==0 ){
                cell = t.teamName + " " + headerValue;
                headerValue = "Squadre";
            } else {
                cell = headerValue + i;
            }
            let col = {field: cell, header: headerValue}
            this.cols.push(col);
        }
    }

    save() {

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica matrix fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
