import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Message } from 'app/components/common/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

@Component({
    templateUrl: './rule-detailview.html'
})
export class RuleDetailView extends AbstractDetailView {
    playoffConfigFormGroup: FormGroup;

    msgs: Message[] = [];

    positions: Combobox[];
    rounds: Combobox[];

    playoffRules: PlayoffRule[];

    selectedPlayoff: Playoff;
    selectedPlayoffConfig: PlayoffRule; 
 
    constructor(
        private fb: FormBuilder,
        protected tourneyService: TourneyService,
        protected location: Location,
    ) {
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffRules = this.selectedPlayoff.playoffRules;

        if(this.tourneyService.newRule) {
            this.tourneyService.selectedPlayoffConfig = this.newPlayoffConfig();
        }
        this.selectedPlayoffConfig = this.tourneyService.selectedPlayoffConfig;

        this.playoffConfigFormGroup = this.fb.group({
            'position':  new FormControl(this.selectedPlayoffConfig.fromRound.position),
            'round':     new FormControl(this.selectedPlayoffConfig.fromRound.round),
        });
    }

    private newPlayoffConfig(): PlayoffRule {
        return {
            id: this.tourneyService.getSequenceNumber(),
            fromRound: {
                id: this.tourneyService.getSequenceNumber(),
                position: { label: 1 + "°", value: 1 },
                round: { label: "", value: 0 }
            }
        };
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

