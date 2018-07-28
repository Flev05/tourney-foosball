import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Tourney } from '../../../domain/tourney';

import { Player } from '../../../domain/player';

import { CalendarDetailView } from '../calendar/calendar-detailview';

const redirect = '/player/dv';

@Component({
    templateUrl: './player-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class PlayerListView extends CalendarDetailView {
    rows: any[] = [];

    players: [Player];

    ngOnInit() {
        super.ngOnInit();
    }

    protected updateRowGroupMetaData() {
        if(this.selectedTourney.players==undefined) {
            return;
        }
        this.players = this.selectedTourney.players;

        for (let row = 0; row < this.players.length; row++) {
            this.rows.push(this.players[row]);
        }
    }
}

