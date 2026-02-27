import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { PlayerService } from '../../../../service/player-service';
import { Player } from '../../../../domain/player';
import { TourneyService } from '../../../../service/tourney-service';
import { Tourney } from '../../../../domain/tourney';
import { AbstractDetailView } from '../../../../components/common/abstract-detailview';
import { ClientService } from '../../../../service/client-service';
import { TourneyVO } from '../../../../domain/tourney.vo';

@Component({
    selector: 'app-player-chooser',
    templateUrl: './player-chooser.component.html',
    styleUrls: ['./player-chooser.component.css']
})
export class PlayerChooserComponent extends AbstractDetailView {

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

    editingPlayerId: number | null = null;

    constructor(protected override location: Location
        , private playerService: PlayerService
        , protected override tourneyService: TourneyService
        , protected clientService: ClientService
    ) {
         super(tourneyService, location);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.allPlayers = [...this.playerService.playerPool];
        this.defenderPlayers = this.selectedTourney.defenderPlayers == undefined ? [] : this.selectedTourney.defenderPlayers;
        this.jollyPlayers = this.selectedTourney.jollyPlayers == undefined ? [] : this.selectedTourney.jollyPlayers;
        this.offenderPlayers = this.selectedTourney.offenderPlayers == undefined ? [] :  this.selectedTourney.offenderPlayers;
    }

    private updateTourney(): void {
        this.selectedTourney.defenderPlayers  = this.defenderPlayers;
        this.selectedTourney.jollyPlayers = this.jollyPlayers;
        this.selectedTourney.offenderPlayers  = this.offenderPlayers;

        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
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
            this.defenderPlayers.some(p => p.id === player.id) ||
            this.offenderPlayers.some(p => p.id === player.id) ||
            this.jollyPlayers.some(p => p.id === player.id)
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
        this.defenderPlayers.push(this.selectedDefenderToAdd);
        this.updateTourney();
        this.selectedDefenderToAdd = undefined;
        this.filteredDefenderPlayers = [];
    }
    
    addJolly() {
        if (!this.selectedJollyToAdd) {
            return;
        } 
        this.jollyPlayers.push(this.selectedJollyToAdd);
        this.updateTourney();
        this.selectedJollyToAdd = undefined;
        this.filteredJollyPlayers = [];
    }

    addOffender() {
        if (!this.selectedOffenderToAdd) {
            return;
        }
        this.offenderPlayers.push(this.selectedOffenderToAdd);
        this.updateTourney();
        this.selectedOffenderToAdd = undefined;
        this.filteredOffenderPlayers = [];
    }    

    // -----------------------------
    // Remove Players
    // -----------------------------

    removeDefender(player: Player) {
        this.defenderPlayers = this.defenderPlayers.filter(p => p.id !== player.id);
        this.updateTourney();
    }
    
    removeJolly(player: Player) {
        this.jollyPlayers = this.jollyPlayers.filter(p => p.id !== player.id);
        this.updateTourney();
    }

    removeOffender(player: Player) {
        this.offenderPlayers = this.offenderPlayers.filter(p => p.id !== player.id);
        this.updateTourney();
    }

    // -----------------------------
    // Move Players
    // -----------------------------

    moveToOffender(player: Player) {
        this.removeDefender(player);
        this.offenderPlayers.push(player);
        this.updateTourney();
    }

    moveToDefender(player: Player) {
        this.removeOffender(player);
        this.defenderPlayers.push(player);
        this.updateTourney();
    }

    // -----------------------------
    // Move to JOLLY
    // -----------------------------

    moveDefenderToJolly(player: Player) {
        this.defenderPlayers = this.defenderPlayers.filter(p => p.id !== player.id);
        this.jollyPlayers.push(player);
        this.updateTourney();
    }

    moveOffenderToJolly(player: Player) {
        this.offenderPlayers = this.offenderPlayers.filter(p => p.id !== player.id);
        this.jollyPlayers.push(player);
        this.updateTourney();
    }

    // -----------------------------
    // Move from JOLLY
    // -----------------------------

    moveJollyToDefender(player: Player) {
        this.jollyPlayers = this.jollyPlayers.filter(p => p.id !== player.id);
        this.defenderPlayers.push(player);
        this.updateTourney();
    }

    moveJollyToOffender(player: Player) {
        this.jollyPlayers = this.jollyPlayers.filter(p => p.id !== player.id);
        this.offenderPlayers.push(player);
        this.updateTourney();
    }

    // -----------------------------
    // Editing
    // -----------------------------

    enableEdit(player: Player) {
        this.editingPlayerId = player.id;
    }

    disableEdit() {
        this.editingPlayerId = null;
    }

    isEditing(player: Player): boolean {
        return this.editingPlayerId === player.id;
    }
}