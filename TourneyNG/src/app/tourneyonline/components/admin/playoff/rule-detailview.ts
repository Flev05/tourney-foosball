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
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Direction, RoundType } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './rule-detailview.html'
})
export class RuleDetailView extends AbstractListView {
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
        this.playoffConfigs = this.selectedPlayoff.playoffConfigs;

        this.selectedIndex = this.tourneyService.selectedIndex + 1;

        if(this.tourneyService.newRule) {
            this.tourneyService.selectedPlayoffConfig = this.newPlayoffConfig();
        }
        this.selectedPlayoffConfig = this.tourneyService.selectedPlayoffConfig;

        this.playoffConfigFormGroup = this.fb.group({
            'position':  new FormControl(this.selectedPlayoffConfig.fromRound.position),
            'round':  new FormControl(this.selectedPlayoffConfig.fromRound.round),
        });
    }

    private newPlayoffConfig(): PlayoffConfig {
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
                    let m: Meeting = this.createMeeting(pc, this.selectedPlayoffConfig, Direction.OneWay);
                    this.selectedPlayoff.round.meetings.push(m);
    
                    if(!this.selectedTourney.isOnewayPlayoff) {
                        m = this.createMeeting( this.selectedPlayoffConfig, pc, Direction.RoundTrip);
                        this.selectedPlayoff.round.meetings.push(m);
                    }        
                }
            }

            this.playoffConfigs.push(this.selectedPlayoffConfig);
        } else {
            for(let m of this.selectedPlayoff.round.meetings) {
                if(m.playoffConfig1==undefined) {
                    m.playoffConfig1 = this.selectedPlayoffConfig;
                }
                if(this.selectedPlayoffConfig.id == m.playoffConfig1.id) {
                    m.playoffConfig1 = this.selectedPlayoffConfig;
                }

                if(m.playoffConfig2==undefined) {
                    m.playoffConfig2 = this.selectedPlayoffConfig;
                }
                if(this.selectedPlayoffConfig.id == m.playoffConfig2.id) {
                    m.playoffConfig2 = this.selectedPlayoffConfig;
                }
            }
        }
        this.selectedPlayoff.playoffConfigs = this.playoffConfigs;
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    private createMeeting(pc1: PlayoffConfig, pc2: PlayoffConfig, d: Direction): Meeting {
        let m : Meeting = {
            id: this.tourneyService.getSequenceNumber(),
            name: "",
            datetime: this.selectedTourney.datetime,
            address: this.selectedTourney.address,
            country: this.selectedTourney.country,
            team1: null,
            team2: null,
            playoffConfig1: pc1,
            playoffConfig2: pc2,
            direction: d
        };

        return m;
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedIndex);
        let popup = 'Sicuro di voler rimuovere la regola: ';

        if(confirm(popup + this.selectedIndex + "?")) {

            let rm: PlayoffConfig[] = this.playoffConfigs.splice(this.selectedIndex-1, 1);
            this.selectedPlayoff.playoffConfigs = this.playoffConfigs;

            let tmpMeetings: Array<Meeting> = new Array<Meeting>();
            for( let m of this.selectedPlayoff.round.meetings) {
                if(m.playoffConfig1.id != rm[0].id && m.playoffConfig2.id != rm[0].id) {
                    tmpMeetings.push(m);
                }
            }
            this.selectedPlayoff.round.meetings = tmpMeetings;
            
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

