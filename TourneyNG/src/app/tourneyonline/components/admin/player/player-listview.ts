import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractListView } from '../../common/abstract-listview';
import { Player } from 'app/tourneyonline/domain/player';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { PlayerService } from 'app/tourneyonline/service/playerService';

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
      
        this.cols = [
            { field: 'rowNumber',   header: 'N°' },
            { field: 'firstname',   header: 'Nome' },
            { field: 'lastname',    header: 'Cognome' },
            { field: 'phoneNumber', header: 'Telefono' },
            { field: 'email',       header: 'Email' }
        ];

        this.playerService.loadAllPlayers().subscribe(p => this.players = p, e => this.onError(e), () => this.onComplete());
    }

    private onComplete(): void {
        this.rows = [];
        for(let i=0;i<this.players.length; i++) {
            let p = this.players[i];
            this.rows.push({p:p, rowNumber: i+1, firstname: p.firstname, lastname: p.lastname, phoneNumber: p.phoneNumber, email: p.email});
        }
    }

    create() {
        this.selectedPlayer={};
        this.playerService.selectedPlayer = this.selectedPlayer;
        this.playerService.newPlayer = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.playerService.selectedPlayer = this.selectedRow.p;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }

    doDelete(player: any) {
        console.log(player);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + player.lastname + " " + player.firstname;

        if(confirm(popup + "?")) {
            this.playerService.deletePlayer(player.p).subscribe(n => this.next(n));

            let index: number = this.players.indexOf(player.p);
            if(index > -1) {
                this.players.splice(index, 1);
            }
            this.onComplete();
        }
    }

}

