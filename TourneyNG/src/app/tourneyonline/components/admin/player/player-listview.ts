import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractListView } from '../../common/abstract-listview';
import { Player } from 'app/tourneyonline/domain/player';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';

const redirect: string = "adminplayer/dv";

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
        private   playerService: PlayerService
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
      
        this.cols = PlayerService.cols;
        this.playerService.loadAllPlayers().subscribe(t => this.players = t, e => this.onError(e), () => this.onComplete());
    }

    onComplete(): void {
        this.rows = this.players;
    }

    create() {
        this.selectedPlayer={};
        this.playerService.selectedPlayer = this.selectedPlayer;
        this.playerService.newPlayer = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.playerService.selectedPlayer = this.selectedRow;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }

    doDelete(player: any) {
        console.log(player);
        let popup = 'Sicuro di voler rimuovere il giocatore: ' + player.lastname + " " + player.firstname;

        if(confirm(popup + "?")) {
            this.playerService.deletePlayer(player).subscribe(n => this.next(n));

            let index: number = this.players.indexOf(player);
            if(index > -1) {
                this.players.splice(index, 1);
                this.rows.splice(index, 1);
            }
        }
    }
}

