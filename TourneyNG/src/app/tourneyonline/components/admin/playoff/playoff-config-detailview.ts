import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
    templateUrl: './playoff-config-detailview.html'
})
export class PlayoffConfigDetailView extends AbstractListView {
    playoffConfigFormGroup: FormGroup;

    msgs: Message[] = [];

    positions: Combobox[];
    rounds: Combobox[];

    playoffConfigs: PlayoffConfig[];

    selectedPlayoff: Playoff;
    selectedPlayoffConfig: PlayoffConfig; 
    selectedIndex: number;
 
    constructor(
        private fb: FormBuilder,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.selectedPlayoffConfig = this.tourneyService.selectedPlayoffConfig;
        this.selectedIndex = this.tourneyService.selectedIndex + 1;

        this.playoffConfigs = this.tourneyService.playoffsConfigs;

        this.playoffConfigFormGroup = this.fb.group({

            'position':  new FormControl(this.selectedPlayoffConfig.fromRound.position),
            'round':  new FormControl(this.selectedPlayoffConfig.fromRound.round),
     
        });
    }

    onSubmit(value: string) {

        this.playoffConfigs.push(this.selectedPlayoffConfig);

        let position = this.playoffConfigFormGroup.get('position').value;
        this.selectedPlayoffConfig.fromRound.position = position;

        this.selectedPlayoffConfig.fromRound.round = this.playoffConfigFormGroup.get('round').value;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedIndex);
        let popup = 'Sicuro di voler rimuovere la regola: ';

        if(confirm(popup + this.selectedIndex + "?")) {

            this.playoffConfigs.splice(this.selectedIndex-1, 1);
            this.selectedPlayoff.playoffConfigs = this.playoffConfigs;

            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
        }
    }
    
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

