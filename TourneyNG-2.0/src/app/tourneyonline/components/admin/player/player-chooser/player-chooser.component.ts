import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { Player } from 'app/tourneyonline/domain/player';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { PlayerVO } from 'app/tourneyonline/domain/player-vo';
import { Observable, of } from 'rxjs';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-player-chooser',
    templateUrl: './player-chooser.component.html',
    styleUrls: ['./player-chooser.component.css'],
    standalone: false
})
export class PlayerChooserComponent extends AbstractDetailView {
    @ViewChild('table') table!: Table; // This gives us access to the #table from HTML

    defenderPlayers: Player[] = [];
    offenderPlayers: Player[] = [];
    jollyPlayers: Player[] = [];

    allPlayers: Player[] = [];

    selectedDefenderToAdd?: Player;
    selectedJollyToAdd?: Player; 
    selectedOffenderToAdd?: Player;   

    filteredDefenderPlayers: Player[] = [];
    filteredJollyPlayers: Player[] = [];
    filteredOffenderPlayers: Player[] = [];

    playerToAdd: Player  | null = null;
    editingPlayer: Player | null = null;
    previousPlayer: Player | null = null;

    constructor(protected override location: Location
        , private playerService: PlayerService
        , protected override tourneyService: TourneyService
        , protected clientService: ClientService
    ) {
         super(tourneyService, location);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if( this.playerService.playerPool.length == 0 ) {
            this.playerService.loadAllPlayers( () => this.onComplete() );
        } else {
            this.onComplete();
        }        
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
        this.allPlayers = [...this.playerService.playerPool];
        this.defenderPlayers = this.selectedTourney.defenderPlayers == undefined ? [] : this.selectedTourney.defenderPlayers;
        this.defenderPlayers = [...this.defenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.jollyPlayers = this.selectedTourney.jollyPlayers == undefined ? [] : this.selectedTourney.jollyPlayers;
        this.jollyPlayers = [...this.jollyPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.offenderPlayers = this.selectedTourney.offenderPlayers == undefined ? [] :  this.selectedTourney.offenderPlayers;
        this.offenderPlayers = [...this.offenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
    }

    private updateTourney(): void {
        this.selectedTourney.defenderPlayers  = this.defenderPlayers;
        this.selectedTourney.jollyPlayers = this.jollyPlayers;
        this.selectedTourney.offenderPlayers  = this.offenderPlayers;

        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Save Tourney operation'));
        subscriber.subscribe(cs => {}, e => this.subscribeErrorHandler(e), () => {});
    }

    filterDefenderPlayers(event: any) {
        const query = event.query.toLowerCase();
        this.filteredDefenderPlayers = this.getAvailablePlayers().filter(player =>
            player.playerName.toLowerCase().includes(query)
        );
    }

    filterJollyPlayers(event: any) {
        const query = event.query.toLowerCase();
        this.filteredJollyPlayers = this.getAvailablePlayers().filter(player =>
            player.playerName.toLowerCase().includes(query)
        );
    }

    filterOffenderPlayers(event: any) {
        const query = event.query.toLowerCase();
        this.filteredOffenderPlayers = this.getAvailablePlayers().filter(player =>
            player.playerName.toLowerCase().includes(query)
        );
    }

    // -----------------------------
    // Utilities
    // -----------------------------

    isPlayerUsed(player: Player): boolean {
        return (
            this.defenderPlayers.some(p => player.id != null && p.id === player.id ) ||
            this.offenderPlayers.some(p => player.id != null && p.id === player.id) ||
            this.jollyPlayers.some(p => player.id != null && p.id === player.id)
        );
    }

    getAvailablePlayers(): Player[] {
        const used = this.getUsedIds();
        return this.allPlayers.filter(p => !used.has(p.id));
    }

    private getUsedIds(): Set<number | null> {
        return new Set([
            ...this.defenderPlayers.map(p => p.id),
            ...this.offenderPlayers.map(p => p.id),
            ...this.jollyPlayers.map(p => p.id)
        ]);
    }

    // -----------------------------
    // Add Players
    // -----------------------------
    addDefender() {
        if (!this.selectedDefenderToAdd) {
            return;
        }
        this.playerToAdd = null;
        // CASE 1: User selected an existing Player object
        if (typeof this.selectedDefenderToAdd === 'object') {
            this.playerToAdd = this.selectedDefenderToAdd;
        } else { // CASE 2: User typed a new name (string)
            const typedName = (this.selectedDefenderToAdd as string).trim();
            if (!typedName) {
                return;
            }

            // Check if already exists (case insensitive)
            const existing = this.allPlayers.find(p =>
                p.playerName?.toLowerCase() === typedName.toLowerCase()
            );

            if (existing) {
                this.playerToAdd = existing;
            } else {
                // Create new Player
                this.playerToAdd = new Player();
                this.playerToAdd.playerName = typedName;
                this.allPlayers.push(this.playerToAdd);
                this.doSavePlayer(this.playerToAdd);
            }
        }

        // Avoid duplicates across lists
        if (this.isPlayerUsed(this.playerToAdd)) {
            return;
        }

        this.defenderPlayers.push(this.playerToAdd);
        this.updateTourney();
        this.selectedDefenderToAdd = undefined;
        this.filteredDefenderPlayers = [];
        this.defenderPlayers = [...this.defenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    addJolly() {
        if (!this.selectedJollyToAdd) {
            return;
        }
        this.playerToAdd = null;
        // CASE 1: User selected an existing Player object
        if (typeof this.selectedJollyToAdd === 'object') {
            this.playerToAdd = this.selectedJollyToAdd;
        } else { // CASE 2: User typed a new name (string)
            const typedName = (this.selectedJollyToAdd as string).trim();
            if (!typedName) {
                return;
            }
            // Check if already exists (case insensitive)
            const existing = this.allPlayers.find(p =>
                p.playerName?.toLowerCase() === typedName.toLowerCase()
            );
            if (existing) {
                this.playerToAdd = existing;
            } else {
                // Create new Player
                this.playerToAdd = new Player();
                this.playerToAdd.playerName = typedName;
                this.allPlayers.push(this.playerToAdd);
                this.doSavePlayer(this.playerToAdd);
            }
        }
        // Avoid duplicates across lists
        if (this.isPlayerUsed(this.playerToAdd)) {
            return;
        }
        this.jollyPlayers.push(this.playerToAdd);
        this.updateTourney();
        this.selectedJollyToAdd = undefined;
        this.filteredJollyPlayers = [];
        this.jollyPlayers = [...this.jollyPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    addOffender() {
        if (!this.selectedOffenderToAdd) {
            return;
        }
        this.playerToAdd = new Player();
        // CASE 1: User selected an existing Player object
        if (typeof this.selectedOffenderToAdd === 'object') {
            this.playerToAdd = this.selectedOffenderToAdd;
        } else { // CASE 2: User typed a new name (string)
            const typedName = (this.selectedOffenderToAdd as string).trim();
            if (!typedName) {
                return;
            }
            // Check if already exists (case insensitive)
            const existing = this.allPlayers.find(p =>
                p.playerName?.toLowerCase() === typedName.toLowerCase()
            );
            if (existing) {
               this.playerToAdd = existing;
            } else {
                // Create new Player
                this.playerToAdd = new Player();
                this.playerToAdd.playerName = typedName;
                this.allPlayers.push(this.playerToAdd);
                this.doSavePlayer(this.playerToAdd);
            }
        }
        // Avoid duplicates across lists
        if (this.isPlayerUsed(this.playerToAdd)) {
            return;
        }
        this.offenderPlayers.push(this.playerToAdd);
        this.updateTourney();
        this.selectedOffenderToAdd = undefined;
        this.filteredOffenderPlayers = [];
        this.offenderPlayers = [...this.offenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    private doSavePlayer(newPlayer : Player) {
        const newPlayerVO : PlayerVO = {
            id: newPlayer.id
            , playerName: newPlayer.playerName
            , country: newPlayer.country
            , clientId: this.clientService.selectedClient == undefined ? null : this.clientService.selectedClient.id
            , json: JSON.stringify(newPlayer)
        };
        const subscriber = this.playerService.savePlayer(newPlayerVO, this.savePlayerErrorHandler('Create player operation'));
        subscriber.subscribe(cs => this.newPlayerNext(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete( ));
    }
     
    private newPlayerNext(tvo:PlayerVO) {
        console.log("newPlayerNext()");
        console.log(tvo.json);
        if( this.playerToAdd != null ) {
            this.playerToAdd.id = tvo.id;
        }        
    }

    private savePlayerErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering savePlayerErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            return of(result as T);
        };
    }
    private onSaveComplete( ) {
        console.log("Entering onSaveComplete()");
    }

    // -----------------------------
    // Remove Players
    // -----------------------------

    removeDefender(player: Player) {
        this.defenderPlayers = this.defenderPlayers.filter(p => p.id !== player.id);
        this.updateTourney();
        this.tourneyService.createChaosDisabled = false;
    }
    
    removeJolly(player: Player) {
        this.jollyPlayers = this.jollyPlayers.filter(p => p.id !== player.id);
        this.updateTourney();
        this.tourneyService.createChaosDisabled = false;
    }

    removeOffender(player: Player) {
        this.offenderPlayers = this.offenderPlayers.filter(p => p.id !== player.id);
        this.updateTourney();
        this.tourneyService.createChaosDisabled = false;
    }

    // -----------------------------
    // Move Players
    // -----------------------------

    moveToOffender(player: Player) {
        this.removeDefender(player);
        this.offenderPlayers.push(player);
        this.updateTourney();
        this.offenderPlayers = [...this.offenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    moveToDefender(player: Player) {
        this.removeOffender(player);
        this.defenderPlayers.push(player);
        this.updateTourney();
        this.defenderPlayers = [...this.defenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    // -----------------------------
    // Move to JOLLY
    // -----------------------------

    moveDefenderToJolly(player: Player) {
        this.defenderPlayers = this.defenderPlayers.filter(p => p.id !== player.id);
        this.jollyPlayers.push(player);
        this.updateTourney();
        this.tourneyService.createChaosDisabled = false;
    }

    moveOffenderToJolly(player: Player) {
        this.offenderPlayers = this.offenderPlayers.filter(p => p.id !== player.id);
        this.jollyPlayers.push(player);
        this.updateTourney();
        this.tourneyService.createChaosDisabled = false;
    }

    // -----------------------------
    // Move from JOLLY
    // -----------------------------

    moveJollyToDefender(player: Player) {
        this.jollyPlayers = this.jollyPlayers.filter(p => p.id !== player.id);
        this.defenderPlayers.push(player);
        this.updateTourney();
        this.defenderPlayers = [...this.defenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    moveJollyToOffender(player: Player) {
        this.jollyPlayers = this.jollyPlayers.filter(p => p.id !== player.id);
        this.offenderPlayers.push(player);
        this.updateTourney();
        this.offenderPlayers = [...this.offenderPlayers].sort((a, b) => 
            a.playerName.localeCompare(b.playerName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    // -----------------------------
    // Editing Defender
    // -----------------------------
    enableEdit(player: Player) {
        this.previousPlayer =  {...player};
        this.editingPlayer =  player;
    }
    
    saveAndDisableEdit(player: Player) {
        if(this.previousPlayer !== player)  {
            this.doSavePlayer(player);
            this.previousPlayer = null;
        }   
        this.editingPlayer = null;
        this.tourneyService.createChaosDisabled = false;
    }

    isEditing(player: Player): boolean {
        return this.editingPlayer === player;
    }
}