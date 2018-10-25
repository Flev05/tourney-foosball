import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Round } from '../../../domain/round';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { RoundType } from 'app/tourneyonline/domain/enumerations';

const redirect: string = "adminround/lv/dv";

@Component({
    templateUrl: './round-listview.html'
})
export class RoundListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    selectedTourney: Tourney;
    selectedRound: Round;

    rounds: Round [];

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
        this.selectedRound={id: this.tourneyService.getSequenceNumber(), name: "", type: RoundType.R};
        this.tourneyService.selectedRound = this.selectedRound;
        this.tourneyService.newRound = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

