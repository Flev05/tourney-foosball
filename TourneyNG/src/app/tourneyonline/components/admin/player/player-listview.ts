import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Player } from '../../../domain/player';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect: string = "adminplayer/dv";

@Component({
    templateUrl: './player-listview.html'
})
export class PlayerListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        private location: Location,
    ) {
        super(redirect, tourneyService, router);
    }

    selectedTourney: Tourney;
    selectedPlayer: Player;
    rows: any[] = [];

    players: [Player];

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.players = this.tourneyService.selectedTourney.players;

        for (let row = 0; row < this.players.length; row++) {
            this.rows.push(this.players[row]);
        }
    }

    create() {
        this.selectedPlayer={id: 0, firstname: "", lastname: "", address: ""};
        this.tourneyService.selectedPlayer = this.selectedPlayer;
        this.tourneyService.newTourney = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedPlayer = this.cloneObject(event.data);

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

