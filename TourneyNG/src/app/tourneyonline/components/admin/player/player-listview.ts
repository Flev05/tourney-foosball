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

        this.playerService.loadAllPlayers( () => this.onComplete() );
    }

    private onComplete(): any {
        console.log("Entering onComplete()");
        this.playerService.playerPool = [];

        for( let pvo of this.playerService.playerPoolVO ) {
            let ppo: Player = JSON.parse(pvo.json);
            ppo.id = pvo.id;
            ppo.country = pvo.country;
            ppo.clientVO = pvo.clientVO;
            ppo.playerName = pvo.playerName;

            this.playerService.playerPool.push(ppo);
        }

        this.rows = this.players = this.playerService.playerPool;    
    }

    create() {
        this.selectedPlayer={id:null, playerName: ""};
        this.playerService.selectedPlayer = this.selectedPlayer;
        this.playerService.newPlayer = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.playerService.selectedPlayer = this.selectedRow;
        this.playerService.newPlayer = false;
        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }

    doDelete(player: Player) {
        console.log(player);
        let popup = 'Sicuro di voler rimuovere il giocatore: ' + player.playerName;

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

