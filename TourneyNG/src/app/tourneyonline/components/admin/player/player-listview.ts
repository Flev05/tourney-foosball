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
    cols: any[];
    rows: any[];
    selectedRow: any;

    selectedPlayer: Player;
    players: Player[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
      
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.players = this.selectedTourney.players;

        this.cols = [
            { field: 'rowNumber',   header: 'N°' },
            { field: 'firstname',   header: 'Nome' },
            { field: 'lastname',    header: 'Cognome' },
            { field: 'phoneNumber', header: 'Telefono' },
            { field: 'email',       header: 'Email' }
        ];

        this.rows = [];
        for(let i=0;i<this.players.length; i++) {
            let p = this.players[i];
            this.rows.push({p:p, rowNumber: i+1, firstname: p.firstname, lastname: p.lastname, phoneNumber: p.phoneNumber, email: p.email});
        }
    }

    create() {
        this.selectedPlayer={};
        this.tourneyService.selectedPlayer = this.selectedPlayer;
        this.tourneyService.newPlayer = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.tourneyService.selectedPlayer = this.selectedRow.p;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

