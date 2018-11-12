import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Player } from '../../../domain/player';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect: string = "adminplayer/lv/dv";

@Component({
    templateUrl: './player-listview.html'
})
export class PlayerListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    selectedTourney: Tourney;
    selectedPlayer: Player;
    players: Player[];

    ngOnInit() {
        super.ngOnInit();
      
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.players = this.selectedTourney.players;
    }

    create() {
        this.selectedPlayer={};
        this.tourneyService.selectedPlayer = this.selectedPlayer;
        this.tourneyService.newPlayer = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.tourneyService.selectedPlayer = this.selectedPlayer;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

