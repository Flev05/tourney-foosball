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
import { TeamDetailView } from 'app/tourneyonline/components/admin/team/team-detailview';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

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
    autoCompleteTeamName: string; 
    filteredTeamsSingle: string[];

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        private   teamService: TeamService,
        public    playerService: PlayerService,
        private   router: Router,
        private   meetingService: MeetingService,
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
        this.autoCompleteTeamName = this.selectedTeam.teamName;

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
        let index = this.selectedTourney.teams.findIndex( t => t.teamName === this.previousTeamName);
        if( index !== -1 ) {
            this.selectedTourney.teams[index] = this.selectedTeam;
        }
        index = this.teamService.teamPool.findIndex( t => t.teamName === this.previousTeamName);
        if( index !== -1 ) {
            this.teamService.teamPool[index] = this.selectedTeam;
        }

        for( let r of this.selectedTourney.roundVO.rounds ) {
            index = r.teamNames.findIndex( t => t === this.previousTeamName);
            if( index !== -1 ) {
                r.teamNames[index] = this.autoCompleteTeamName;
                break;
            }
        }


        this.selectedTeam.teamName = this.autoCompleteTeamName;
        this.teamService.saveTeam( this.selectedTeam
            , TeamDetailView.CHECK_ALREADY_EXIST_TEAM
            , () => this.saveTeamOnComplete());

        if( this.previousTeamName !== this.autoCompleteTeamName ) {
            this.meetingService.updateOnChangeTeamName(this.selectedTourney, this.previousTeamName, this.autoCompleteTeamName);
        }
    } 

    private saveTeamOnComplete(): void {
        this.tourneyService.updateTourneyWithCleanAll(this.selectedTourney, () => this.onSaveTourneyComplete());
    }

    private onSaveTourneyComplete(): void {
        // this.selectedTourney.roundVO.rounds = [];
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

    searchTeam(event) {
        let query = event.query;
        this.filteredTeamsSingle = this.teamService.filterTeam(query, this.selectedTourney.teams);
        if(this.filteredTeamsSingle.length > 0) {
            let partialTeamName = this.filteredTeamsSingle[0];
            let index = this.selectedTourney.teams.findIndex( t => t.teamName === partialTeamName);
            if( index !== -1 ) {
                this.selectedTeam = this.selectedTourney.teams[index];
            }
        }
    }

    enableSaveButton() : string {
        let n : String = this.autoCompleteTeamName;
        if( n == undefined || n.trim() == "") {
            return "disabled";
        }
        return "";
    }
}
