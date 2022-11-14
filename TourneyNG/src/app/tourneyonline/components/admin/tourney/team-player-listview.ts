import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Player } from 'app/tourneyonline/domain/player';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TeamDetailView } from 'app/tourneyonline/components/admin/team/team-detailview';
import { CountryService } from 'app/tourneyonline/service/country-service';

const REDIRECT_PLAYER_PL = "admintourney/dv/playerpl";
const REDIRECT_PLAYER_DV = "admintourney/dv/playerdv";
const REDIRECT_TEAM_DV   = "admintourney/dv/updateteam";

@Component({
    templateUrl: './team-player-listview.html',
})
export class TeamPlayerListView extends AbstractDetailView {

    selectedTeam: Team;
    selectedPlayer: Player;
    playerCols: TableCols[];
    playerLabel: string;
    previousTeamName: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        private   teamService: TeamService,
        public    playerService: PlayerService,
        private   router: Router,
        private   countryService: CountryService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();
        this.countries = this.countryService.countries;
        this.selectedTeam = this.teamService.selectedTeam;
        this.playerCols = PlayerService.cols;

        if(this.teamService.newTeam) {
            this.selectedTeam.id = null; 
            this.selectedTeam.players = [];
            this.teamService.newTeam = false;
        }
        this.previousTeamName = this.selectedTeam.teamName;
        this.teamService.teamAlreadyExists = false;

        this.playerLabel = this.selectedTeam.players.length == 0 ? "Aggiungi Giocatori" : "Gestisci Giocatori";
    }

    saveTourneyTeam() {     
        if( this.previousTeamName != this.selectedTeam.teamName ) {
            if(!confirm(TeamDetailView.CHANGE_TEAM_NAME_POPUP)) {
                return;
            }
        }
        this.teamService.saveTourneyTeam(this.selectedTourney, false, this.selectedTeam, () => this.saveTeamOnComplete());
    } 

    private saveTeamOnComplete(): void {
        this.tourneyService.updateTourneyWithCleanAll(this.selectedTourney, () => this.onSaveTourneyComplete());
    }

    private onSaveTourneyComplete(): void {
        this.selectedTourney.roundVO.rounds = [];
        super.goBack();
    }
    
    goToPickList() {
        this.playerService.loadAllPlayers( () => this.onComplete() ) ;
    }

    private onComplete(): any {
        console.log("Entering onComplete()");

        this.playerLabel = this.selectedTeam.players.length == 0 ? "Aggiungi Giocatori" : "Gestisci Giocatori";
        this.router.navigate([REDIRECT_PLAYER_PL]);
    }

    updateTeamDetails() {
        this.teamService.newTeam = false;
        this.router.navigate([REDIRECT_TEAM_DV]);
    }

    onPlayerRowSelect(event) {
        console.log(event);
        this.playerService.selectedPlayer = this.selectedPlayer;
        this.playerService.newPlayer = false;
        this.router.navigate([REDIRECT_PLAYER_DV]);
    }
}
