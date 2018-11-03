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
    playoffFormGroup: FormGroup;

    msgs: Message[] = [];

    positions: Combobox[];
    rounds: Combobox[];

    playoffConfigs: PlayoffConfig[];

    selectedPlayoff: Playoff;
    selectedPlayoffConfig: PlayoffConfig; 
 
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

        this.playoffFormGroup = this.fb.group({

            'position':  new FormControl(this.selectedPlayoffConfig.fromRound.position),
            'round':  new FormControl(this.selectedPlayoffConfig.fromRound.round),
     
        });
    }

    onSubmit(value: string) {

        this.selectedPlayoffConfig.fromRound.position = this.playoffFormGroup.get('position').value;
        this.selectedPlayoffConfig.fromRound.round = this.playoffFormGroup.get('round').value;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
            
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

