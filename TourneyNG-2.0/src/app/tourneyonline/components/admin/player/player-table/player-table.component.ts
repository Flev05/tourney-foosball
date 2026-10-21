import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Observable, of } from 'rxjs';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { Player } from 'app/tourneyonline/domain/player';
import { Team } from 'app/tourneyonline/domain/team';
import { Table } from 'primeng/table';
import { LoginService } from 'app/tourneyonline/service/login-service';

const redirect: string = "adminplayer/dv";

@Component({
    selector: 'app-player-table',
    templateUrl: './player-table.component.html',
    styleUrls: ['./player-table.component.css'],
    standalone: false
})
export class PlayerTableComponent extends AbstractListView {
    @Input() addPlayerEnabled: boolean | undefined;
    @Input() tourneyTeams: boolean | undefined;    
    @Input() selectedTeam: Team | undefined;

    // 1. Reference the table normally
    @ViewChild('table') table!: Table; // This gives us access to the #table from HTML
    
    cols: any[] = [];
    rows: any[] = [];
    selectedRow: any;

    selectedPlayer: Player = new Player();
    players: Player[] = [];
    onDeletePlayerError: boolean = false;
    deletePlayer: Player = new Player();

    constructor(
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location,
        public    playerService: PlayerService,
        private   teamService: TeamService,
        protected loginService: LoginService
    ) {
        super(redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.cols = PlayerService.cols;
        this.onDeletePlayerError = false;
        this.addPlayerEnabled = this.loginService.isUserAllowed();
        this.playerService.loadAllPlayers( () => this.onComplete() );
    }

    private onComplete(): any {
        console.log("Entering onComplete(tourneyTeams=" + this.tourneyTeams + ")");
        this.playerService.playerPool = this.playerService.playerPool.sort((p1,p2) => {
            if(p1.playerName < p2.playerName) {
                return -1;
            }
            if(p1.playerName > p2.playerName) {
                return 1;
            }
            return 0;
        });

        this.playerService.selectedPlayers = [];
        this.players = this.playerService.playerPool;    
        if( this.selectedTeam && this.selectedTeam.players ) {
            this.selectedTeam.players = [...this.selectedTeam.players.filter(p => p.id !== null)];
            this.playerService.selectedPlayers = this.selectedTeam.players;
            // 1. Create a Set of IDs for much faster lookup
            const selectedIds = new Set(this.playerService.selectedPlayers.map(p => p.id));

            // 2. Sort the array: selected players go to the top
            this.players.sort((a, b) => {
                const aSelected = selectedIds.has(a.id) ? 1 : 0;
                const bSelected = selectedIds.has(b.id) ? 1 : 0;
                
                // Subtracting b from a puts the "1"s (selected) at the start
                return bSelected - aSelected; 
            });

            // 3. Important: If using change detection, trigger a refresh
            if( this.addPlayerEnabled ) {
                this.players = [...this.players];
            } else {
                this.players = [...this.selectedTeam.players];
            }
        }
        setTimeout(() => {
            if (this.table) {
                this.table.filter(this.playerService.storedPlayerFilter, 'playerName', 'contains');
            }
        }, 5);
    }

    // 2. Save the filter as the user types
    onFilterChange(value: string, table: Table) {
        this.playerService.storedPlayerFilter = value;
        table.filter(value, 'playerName', 'contains');
    }
 
    isInitialMember(player: any): boolean {
        if (!this.playerService.selectedPlayers || !player) {
            return false;
        }
        // Check if the player ID is already in our selection array
        return this.playerService.selectedPlayers.some(p => p.id === player.id);
    }

    create() {
        this.selectedPlayer = new Player();
        this.playerService.selectedPlayer = this.selectedPlayer;
        this.playerService.newPlayer = true;
        this.playerService.readOnly = false;
        this.gotoDetailView();
    }

    public gotoListView() {
        this.router.navigate([this.redirect], { 
            queryParams: { tourneyTeams: this.tourneyTeams }
        });
    }

    doUpdate(player: Player) {
        console.log(player.playerName);
        this.selectedRow = player;
        this.playerService.selectedPlayer = this.selectedRow;
        this.playerService.newPlayer = false;
        this.gotoDetailView();
    }

    onRowUnselect(event: any) {
        console.log('Player removed:', event.data.playerName);
        // You can use this to update a counter or validation message
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

    protected override subscribeErrorHandler<T> (operation = 'operation', result?: T) {
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
            this.players = [...this.players.filter(p => p.id !== this.deletePlayer.id)];
            this.playerService.playerPool = [...this.playerService.playerPool.filter(p => p.id !== this.deletePlayer.id)];
            if( this.teamService.selectedTeam ) {
                this.teamService.selectedTeam.players = [...this.teamService.selectedTeam.players.filter(p => p.id !== this.deletePlayer.id)];
                this.teamService.updateExistingTeam(this.teamService.selectedTeam
                    , () => this.onSaveTeamComplete());
            }
        }
    }
       
    private onSaveTeamComplete(): void {
        console.log("Entering onSaveTeamComplete()");
    }
}
