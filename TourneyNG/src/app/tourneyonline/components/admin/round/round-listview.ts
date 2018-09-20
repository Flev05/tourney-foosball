import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Round } from '../../../domain/round';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect: string = "adminround/lv/dv";

@Component({
    templateUrl: './round-listview.html'
})
export class RoundListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        private location: Location,
    ) {
        super(redirect, tourneyService, router);
    }

    selectedTourney: Tourney;
    selectedRound: Round;

    rounds: [Round];

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.rounds = this.tourneyService.selectedTourney.rounds;
        this.tourneyService.newRound = false;
    }

    create() {
        this.selectedRound={};
        this.tourneyService.selectedRound = this.selectedRound;
        this.tourneyService.newRound = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        let sp = this.cloneObject(event.data);

        for(let i=0; i<this.selectedTourney.rounds.length; i++ ) {
            if(this.selectedTourney.rounds[i].id == sp.id) {
                this.selectedRound = this.selectedTourney.rounds[i];
                this.tourneyService.selectedRound = this.selectedRound;
                break;
            }
        }

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

