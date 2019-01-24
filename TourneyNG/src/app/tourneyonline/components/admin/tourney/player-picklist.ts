import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Router } from '@angular/router';
import { Player } from 'app/tourneyonline/domain/player';
import { PlayerService } from 'app/tourneyonline/service/player-service';

@Component({
    templateUrl: './player-picklist.html',
})
export class PlayerPickList extends AbstractListView {

    availablePlayers: Player[] = [];
    targetPlayers: Player[] = [];
    selectedTeam: Team;

    constructor( protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private teamService: TeamService
        , private playerService: PlayerService
        ) 
    { 
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        console.log("PlayerPickList.ngOnInit() ");
        super.ngOnInit();
        this.prepareAvailablePlayers();
    }
    
    private prepareAvailablePlayers(): void {
        this.selectedTeam = this.teamService.selectedTeam;
        this.targetPlayers = this.selectedTeam.players;
        this.selectedTourney.players = this.playerService.playerPool;

        this.availablePlayers = [];

        let usedPlayers: Player[] = [];
        for(let t of this.selectedTourney.teams) {
            usedPlayers = usedPlayers.concat(t.players);
        }

        for(let t of this.selectedTourney.teams) {
            for(let pt of t.players) {            
                let index: number = usedPlayers.indexOf(pt);
                if(index == -1) {
                    this.availablePlayers.push(pt);
                }
            }
        }
    }
 
    onError(n:any) {
        let msgerr : string;

        if(this.teamService.newTeam) {
            msgerr = 'Creazione nuova squadra fallita';
        } else {
            msgerr = 'Modifica squadra fallita';
        }
        console.log(msgerr);
    }
}
