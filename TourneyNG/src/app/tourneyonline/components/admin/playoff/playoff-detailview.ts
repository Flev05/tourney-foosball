import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';
import { RoundType } from '../../../domain/roundType';
import { Team } from '../../../domain/team';
import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Router } from '@angular/router';

const redirect: string = "adminplayoff/lv/dv/config";

@Component({
    templateUrl: './playoff-detailview.html',
})
export class PlayoffDetailView extends AbstractDetailView {
    playoffFormGroup: FormGroup;

    selectedPlayoff: Playoff;
    selectedPlayoffConfig: PlayoffConfig;

    msgs: Message[] = [];

    playoffConfigs: PlayoffConfig[];

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        protected router: Router
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("PlayoffDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffConfigs = this.selectedPlayoff.playoffConfigs;

        if(this.tourneyService.newPlayoff) {
            this.playoffConfigs = [];
            this.selectedPlayoff.name = "";
            this.selectedPlayoff.id = this.tourneyService.getSequenceNumber();             
        }

        this.tourneyService.newPlayoffConfig = false;

        this.playoffFormGroup = this.fb.group({
            'name': new FormControl(this.selectedPlayoff.name, Validators.compose([Validators.required])),
        });
    }
    
    addRule() {
        this.tourneyService.newPlayoffConfig = true;
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.selectedPlayoff.selectedPlayoffConfig = {};
        
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.selectedPlayoff.selectedPlayoffConfig = this.selectedPlayoffConfig;
        
        this.gotoDetailView();
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedPlayoff.name);
        let popup = 'Sicuro di voler rimuovere il playoff: ';

        if(confirm(popup + this.selectedPlayoff.name + "?")) {
            let index: number = this.selectedTourney.playoffs.indexOf(this.selectedPlayoff);
            if(index > -1) {
                this.selectedTourney.playoffs.splice(index, 1);
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
        }
    }

    onSubmit(value: string) {

        this.selectedPlayoff.name = this.playoffFormGroup.get('name').value;

        if(this.tourneyService.newPlayoff) {
            this.selectedTourney.playoffs.push(this.selectedPlayoff);
            this.selectedTourney.playoffNo = this.selectedTourney.playoffs.length;
            this.tourneyService.newPlayoff = false;
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
    
    private gotoDetailView() {
        this.router.navigate([redirect]);
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newPlayoff) {
            msgerr = 'Creazione nuova configurazione playoff fallita';
        } else {
            msgerr = 'Modifica configurazione playoff fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
