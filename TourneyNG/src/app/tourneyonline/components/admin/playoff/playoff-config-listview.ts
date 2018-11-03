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
    templateUrl: './playoff-config-listview.html'
})
export class PlayoffConfigListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRoundLv/dv";
    msgs: Message[] = [];
    position: number;
    roundName: string;

    positions: Combobox[];
    rounds: Combobox[];
    playoffConfigs: PlayoffConfig[];

    selectedPlayoff: Playoff;

    teamNoCombobox: number;
    teamsCombobox: Combobox[];
    nameIsMandatory: boolean;
    selectedPlayoffConfig: PlayoffConfig; 

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(PlayoffConfigListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        this.teamNoCombobox = this.selectedTourney.teams.length;

        this.teamsCombobox = [];
        for(let i=2; i<=this.teamNoCombobox; i++ ) {
            let item = { label: "" + i, value: i };
            this.teamsCombobox.push(item);
        }

        this.teamNoCombobox = 0;

        if(this.tourneyService.newPlayoff) {
            this.selectedPlayoff = {
                  id:this.tourneyService.getSequenceNumber()
                , round:{id: this.tourneyService.getSequenceNumber(), name: "", type: RoundType.P}
                , playoffConfigs: [this.newPlaoffConfig()]};

            this.selectedTourney.playoffs.push(this.selectedPlayoff);
        } else {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
            this.playoffConfigs = this.selectedPlayoff.playoffConfigs;
        }
    }
    
    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.selectedTourney.isOnewayPlayoff=true;
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.selectedTourney.isOnewayPlayoff=false;
    }

    onChange(event) {
        console.log(event);

        this.playoffConfigs = [];
        for(let i=1; i<=this.teamNoCombobox; i++ ) {
            let pc: PlayoffConfig = this.newPlaoffConfig();
    
            this.playoffConfigs.push(pc);
        }
        this.selectedPlayoff.playoffConfigs = this.playoffConfigs;
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

    onRowSelect(event) {

        this.tourneyService.playoffsConfigs = this.playoffConfigs;

        this.tourneyService.selectedPlayoffConfig = this.selectedPlayoffConfig;
        this.router.navigate([PlayoffConfigListView.redirect]);
    }

}

