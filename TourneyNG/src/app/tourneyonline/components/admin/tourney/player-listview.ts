import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Player } from 'app/tourneyonline/domain/player';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { AbstractDetailView } from '../../common/abstract-detailview';

const REDIRECT_PLAYER_PL = "admintourney/dv/playerpl";
const REDIRECT_PLAYER_DV = "admintourney/dv/playerdv";
const REDIRECT_TEAM_DV   = "admintourney/dv/updateteam";

@Component({
    templateUrl: './player-listview.html',
})
export class PlayerListView extends AbstractDetailView {

    selectedTeam: Team;
    selectedPlayer: Player;
    playerCols: TableCols[];
    playerLabel: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        private   teamService: TeamService,
        private   playerService: PlayerService,
        private   router: Router
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedTeam = this.teamService.selectedTeam;
        this.playerCols = PlayerService.cols;

        if(this.teamService.newTeam) {
            this.selectedTeam.id = null; 
            this.selectedTeam.players = [];
            this.teamService.newTeam = false;
        }

        let alreadyInTeam: Player[] = [];
        for(let i=0; i<this.selectedTourney.teams.length; i++ ) {
            let t = this.selectedTourney.teams[i];
            let p = t.players;
            for(let j=0; j<p.length; j++ ) {
                alreadyInTeam.push(p[j]);
            }
        }
        
        this.playerLabel = this.selectedTeam.players.length == 0 ? "Aggiungi Giocatori" : "Gestisci Giocatori";
    }
 
    updateTeamList() {

        this.playerService.loadAllPlayers( () => this.onComplete() ) ;

        this.router.navigate([REDIRECT_PLAYER_PL]);
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

        this.selectedTeam.players = this.playerService.playerPool;   
        this.playerLabel = this.selectedTeam.players.length == 0 ? "Aggiungi Giocatori" : "Gestisci Giocatori";
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
