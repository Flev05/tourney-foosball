import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MessageService } from 'primeng/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

@Component({
    templateUrl: './rule-detailview.html',
    standalone: false
})
export class RuleDetailView extends AbstractDetailView {
    playoffConfigFormGroup: FormGroup;

    positions: Combobox[] = [];
    rounds: Combobox[] = [];

    playoffRules: PlayoffRule[] = [];

    selectedPlayoff: Playoff = new Playoff();
    selectedPlayoffConfig: PlayoffRule = new PlayoffRule(); 
 
    constructor(
        private fb: FormBuilder,
        protected override tourneyService: TourneyService,
        protected override location: Location
        ,private messageService: MessageService
    ) {
        super(tourneyService, location);
        this.playoffConfigFormGroup = this.fb.group({
            username: [''],
            password: ['']
        });
    }

    override ngOnInit() {
        super.ngOnInit();

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        if(this.tourneyService.selectedPlayoff != null ) {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        } else {
            if(this.tourneyService.selectedPlayout != null ) {
                this.selectedPlayoff = this.tourneyService.selectedPlayout;
            }
        }
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
            id:  this.tourneyService.getSequenceNumber()
            , ruleName:""
            , isDummy: false
            , fromRound: {
                id: this.tourneyService.getSequenceNumber()
                ,position: { label: 1 + "°", value: 1 }
                ,round: { label: "", value: 0 }
                , bandPosition: 0
                ,isDummy: false
            }
        };
    }

    override onError(n:any) {
        let msgerr : string;
        msgerr = 'Modifica configurazione playoff fallita';
        this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: msgerr
        });        
    }
}

