import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Observable, of } from 'rxjs';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { Player } from 'app/tourneyonline/domain/player';

const redirect: string = "adminplayer/dv";

@Component({
    selector: 'app-player-table',
    templateUrl: './player-table.component.html',
    styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent extends AbstractListView {
    @Input() playerLv: boolean | undefined;
    @Input() addPlayerEnabled: boolean | undefined;
  
    cols: any[];
    rows: any[];
    selectedRow: any;

    selectedPlayer: Player;
    players: Player[];
    onDeletePlayerError: boolean;
    deletePlayer: Player;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected playerService: PlayerService,
        private   teamService: TeamService
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.cols = PlayerService.cols;
        this.onDeletePlayerError = false;
        this.addPlayerEnabled = !this.teamService.readOnly;
        this.playerService.loadAllPlayers( () => this.onComplete() );
    }

    private onComplete(): any {
        console.log("Entering onComplete()");
        this.playerService.playerPool = this.playerService.playerPool.sort((p1,p2) => {
            if(p1.playerName < p2.playerName) {
                return -1;
            }
            if(p1.playerName > p2.playerName) {
                return 1;
            }
            return 0;
        });

        this.rows = this.players = this.playerService.playerPool;    
        if( this.playerLv ) {
            this.rows = this.teamService.selectedTeam.players;
        }
    }

    create() {
        this.selectedPlayer={id:null, playerName: ""};
        this.playerService.selectedPlayer = this.selectedPlayer;
        this.playerService.newPlayer = true;
        this.playerService.readOnly = false;
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
            this.deletePlayer = player;
            const observer = this.playerService.deletePlayer(player, this.deletePlayerErrorHandler("Delete player operation"));

            observer.subscribe(n => super.next(n), e => this.subscribeErrorHandler(e), () => this.onDeleteComplete());
        }
    }

    private deletePlayerErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering deletePlayerErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            this.onDeletePlayerError = true;
            return of(result as T);
        };
    }

    protected subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onDeletePlayerError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    private onDeleteComplete() {
        console.log("Entering onDeleteComplete()");
        if( !this.onDeletePlayerError ) {
            let index: number = this.players.indexOf(this.deletePlayer);
            if(index > -1) {
                this.players.splice(index, 1);
                this.rows.splice(index, 1);
            }
            index = this.teamService.selectedTeam.players.indexOf(this.deletePlayer);
            if(index > -1) {
                this.teamService.selectedTeam.players.splice(index, 1);
            }
        }
    }
}
