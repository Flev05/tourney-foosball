import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {SelectItem} from 'primeng/api';

import { CountryService } from 'app/tourneyonline/service/countryservice';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { Message } from 'app/components/common/api';
import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';

const classificationLabel = "° Classificata";

@Component({
    templateUrl: './playoff-config-detailview.html',
})
export class PlayoffConfigDetailView extends AbstractDetailView {
    playoffConfiFormGroup: FormGroup;
    msgs: Message[] = [];

    selectedPlayoff: Playoff;
    selectedPlayoffConfig: PlayoffConfig;
    
    position: string;
    roundName: string;

    positions: SelectItem[];
    rounds: SelectItem[];

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("PlayoffConfigDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.selectedPlayoffConfig = this.selectedPlayoff.selectedPlayoffConfig;

        this.rounds = [];
        for(let r of this.tourneyService.selectedTourney.rounds) {
            this.rounds.push({"label": r.name, "value": r.name});
        }

        this.positions = [];

        let maxPosition = this.tourneyService.selectedTourney.teams.length / this.tourneyService.selectedTourney.rounds.length;
        if(this.tourneyService.selectedTourney.teams.length % this.tourneyService.selectedTourney.rounds.length > 0) {
            maxPosition++;
        }

        for(let p=1; p<=maxPosition; p++ ) {
            let vv: string = '' + p;
            vv = vv + classificationLabel;
            this.positions.push({"label": vv, "value": p});
        }
        
        if(this.tourneyService.newPlayoffConfig) {
            this.position = this.positions[0].label;
            this.roundName = this.rounds[0].label;
        } else {
            this.position = this.selectedPlayoffConfig.position.label;
            this.roundName = this.selectedPlayoffConfig.roundName.label;
        }

        this.playoffConfiFormGroup = this.fb.group({
            'position': new FormControl(this.position + classificationLabel),
            'roundName': new FormControl(this.roundName),
        });
    }

    onSubmit(value: string) {

        this.position = this.playoffConfiFormGroup.get('position').value;
        this.roundName = this.playoffConfiFormGroup.get('roundName').value;

        if(this.tourneyService.newPlayoffConfig) {

            let pc: PlayoffConfig={};
            
            pc.id = this.tourneyService.getSequenceNumber(); ;
            pc.name = "";
            pc.position = {label:this.position, value: this.position};

            pc.roundName = {label: this.roundName, value: this.roundName};

            this.selectedPlayoff.playoffConfigs.push(pc);
            this.tourneyService.newPlayoffConfig = false;
        } else {
            this.selectedPlayoffConfig.position = {label: this.position, value: this.position};
            this.selectedPlayoffConfig.roundName = {label: this.roundName, value: this.roundName};
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
    
    doDelete() {
        this.position = this.playoffConfiFormGroup.get('position').value;
        this.roundName = this.playoffConfiFormGroup.get('roundName').value;

        let name = this.position + " - " + this.roundName;

        console.log("doDelete(): " + name);
        let popup = 'Sicuro di voler rimuovere il playoff config: ' + name;

        if(confirm(popup + name + "?")) {
            
            let pc = {"position": this.selectedPlayoffConfig.position, "roundName": this.selectedPlayoffConfig.roundName};

            let index: number = this.selectedPlayoff.playoffConfigs.indexOf(pc);
            if(index > -1) {
                this.selectedPlayoff.playoffConfigs.splice(index, 1);
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
        }
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
