import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Message } from 'app/components/common/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

@Component({
    templateUrl: './rule-detailview.html'
})
export class RuleDetailView extends AbstractDetailView {
    playoffConfigFormGroup: FormGroup;

    msgs: Message[] = [];

    positions: Combobox[];
    rounds: Combobox[];

    playoffConfigs: PlayoffRule[];

    selectedPlayoff: Playoff;
    selectedPlayoffConfig: PlayoffRule; 
 
    constructor(
        private fb: FormBuilder,
        protected tourneyService: TourneyService,
        protected location: Location,
        protected countryService: CountryService
    ) {
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffConfigs = this.selectedPlayoff.playoffRules;

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

    onSubmit(value: string) {

        let position = this.playoffConfigFormGroup.get('position').value;
        this.selectedPlayoffConfig.fromRound.position = position;

        let round = this.playoffConfigFormGroup.get('round').value;
        this.selectedPlayoffConfig.fromRound.round = round;

        if( this.tourneyService.newRule ) {
            this.tourneyService.newRule = false;

            if(this.playoffConfigs == null) {
                this.playoffConfigs = [];
            }

            if(this.playoffConfigs.length >= 1) {
                for(let pc of this.playoffConfigs) {
                    let m: MeetingDb = this.createMeeting(null, null, pc, this.selectedPlayoffConfig, Direction.OneWay);
                    this.selectedPlayoff.round.meetings.push(m);
                    
                    this.tourneyService.savePlayoffMeetingDb(m, this.selectedTourney.id, this.selectedPlayoff.id);
    
                    if(this.selectedTourney.isOnewayPlayoff != "true") {
                        m = this.createMeeting(null, null, this.selectedPlayoffConfig, pc, Direction.RoundTrip);
                        this.selectedPlayoff.round.meetings.push(m);
                        this.tourneyService.savePlayoffMeetingDb(m, this.selectedTourney.id, this.selectedPlayoff.id);
                    }        
                }
            }

            this.playoffConfigs.push(this.selectedPlayoffConfig);
        } else {
            for(let m of this.selectedPlayoff.round.meetings) {
                if(m.rule1==undefined) {
                    m.rule1 = this.selectedPlayoffConfig;
                }
                if(this.selectedPlayoffConfig.id == m.rule1.id) {
                    m.rule1 = this.selectedPlayoffConfig;
                }

                if(m.rule2==undefined) {
                    m.rule2 = this.selectedPlayoffConfig;
                }
                if(this.selectedPlayoffConfig.id == m.rule2.id) {
                    m.rule2 = this.selectedPlayoffConfig;
                }
                
                this.tourneyService.completePlayoffMeetingDb(m, this.selectedTourney.id, this.selectedPlayoff.id);
            }
        }
        this.selectedPlayoff.playoffRules = this.playoffConfigs;
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

