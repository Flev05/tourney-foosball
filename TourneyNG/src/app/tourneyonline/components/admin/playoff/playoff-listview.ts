import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {SelectItem} from 'primeng/api';

import { Tourney } from '../../../domain/tourney';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { Playoff } from '../../../domain/playoff';
import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';

const redirect: string = "adminplayoff/lv/dv";
const classificationLabel = "° Classificata";

@Component({
    templateUrl: './playoff-listview.html'
})
export class PlayoffListView extends AbstractListView {
    rounds: SelectItem[];

    selectedTourney: Tourney;
    selectedPlayoff: Playoff;

    playoffs: Playoff[];
    positions: SelectItem[];

    position: string;
    roundName: string;

    selectedPlayoffConfig: PlayoffConfig;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        private location: Location,
    ) {
        super(redirect, tourneyService, router);
    }    

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.playoffs = this.tourneyService.selectedTourney.playoffs;
        this.tourneyService.newPlayoff = false;
        this.tourneyService.newPlayoffConfig = true;

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
    }

    create() {
        this.tourneyService.selectedPlayoff = {};
        this.tourneyService.selectedPlayoff.playoffConfigs = [];
        this.tourneyService.newPlayoff = true;
        // this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        // this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

