import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { RoundType } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './playoff-detailview.html'
})
export class PlayoffDetailView extends AbstractListView {
    msgs: Message[] = [];
    position: number;
    roundName: string;

    positions: Combobox[];
    rounds: Combobox[];
    playoffConfigs: PlayoffConfig[];
    selectedPlayoffConfig; PlayoffConfig;

    selectedPlayoff: Playoff;

    row: PlayoffConfig;  
    displayDialog: boolean;

    teamNoCombobox: number;
    teamsCombobox: Combobox[];
    isOneway: string;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {
        this.displayDialog = false;

        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        this.teamNoCombobox = this.selectedTourney.teams.length / this.selectedTourney.rounds.length;

        this.teamsCombobox = [];
        for(let i=2; i<=this.teamNoCombobox; i++ ) {
            let item = { label: "" + i, value: i  };
            this.teamsCombobox.push(item);
        }

        this.teamNoCombobox = 0;

        if(this.tourneyService.newPlayoff) {
            this.selectedPlayoff = {
                  id:this.tourneyService.getSequenceNumber()
                , round:{id: this.tourneyService.getSequenceNumber(), name: "", type: RoundType.P, isOneway: true}
                , playoffConfigs: [this.newPlaoffConfig()]};

            this.selectedTourney.playoffs.push(this.selectedPlayoff);
        } else {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
            this.playoffConfigs = this.selectedPlayoff.playoffConfigs;
        }

        this.isOneway = this.selectedPlayoff.round.isOneway ? "true": "false";
    }
    
    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.selectedPlayoff.round.isOneway=true;
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.selectedPlayoff.round.isOneway=false;
    }

    onChange(event) {
        console.log(event);

        this.playoffConfigs = [];
        for(let i=1; i<=this.teamNoCombobox; i++ ) {
            let pc: PlayoffConfig = this.newPlaoffConfig();
    
            this.playoffConfigs.push(pc);
        }
    }

    private newPlaoffConfig(): PlayoffConfig {
        return {
            id: this.tourneyService.getSequenceNumber(),
            fromRound: {
                id: this.tourneyService.getSequenceNumber(),
                position: { label: 1 + "°", value: 1 },
                round: { label: "", value: 0 }
            }
        };
    }

    showDialogToAdd() {
        this.row = {
              id: this.tourneyService.getSequenceNumber()
            , fromRound: {id: this.tourneyService.getSequenceNumber()
                , position:{label: this.selectedPlayoffConfig.label, value: this.selectedPlayoffConfig.value}
                , round: this.selectedPlayoffConfig.round
            }  
        };
        this.displayDialog = true;
    }

    onRowSelect(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialog = true;
    }

    done() {
        this.playoffConfigs[this.playoffConfigs.indexOf(this.selectedPlayoffConfig)] = this.row;

        this.row = null;
        this.displayDialog = false;
    }

    save() {
        this.selectedPlayoff.playoffConfigs = this.playoffConfigs;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
            
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

