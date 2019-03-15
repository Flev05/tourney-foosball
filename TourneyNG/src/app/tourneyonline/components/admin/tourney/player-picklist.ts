import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Router } from '@angular/router';
import { Player } from 'app/tourneyonline/domain/player';
import { PlayerService } from 'app/tourneyonline/service/player-service';

const REDIRECT_PLAYER_DV = "admintourney/dv/playerdv";

@Component({
    templateUrl: './player-picklist.html',
})
export class PlayerPickList extends AbstractListView {

    selectedTeam: Team;

    avalilablePlayers: string[];
    targetPlayers: string[];
    returnLabel: string;

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
        this.returnLabel = "Indietro";
        this.prepareAvailablePlayers();
    }
    
    private prepareAvailablePlayers(): void {
        this.selectedTeam = this.teamService.selectedTeam;
        
        this.targetPlayers = [];
        for(let p of this.selectedTeam.players) {
            this.targetPlayers.push(p.playerName);
        }

        let usedPlayers: Array<Player> = new Array<Player>();
        for(let t of this.selectedTourney.teams) {
            usedPlayers = usedPlayers.concat(t.players);
        }

        this.avalilablePlayers = [];
        for(let p of this.playerService.playerPool) {
            let pl = usedPlayers.find(x => x.playerName == p.playerName);
            if(pl == undefined) {
                this.avalilablePlayers.push(p.playerName);
            }
        }
    }
    
    onMoveToTarget(event) {
        console.log("Entering onMoveToTarget()");
        this.returnLabel = "Salva e torna";
    }

    onMoveToSource(event) {
        console.log("Entering onMoveToSource()");
        this.returnLabel = "Salva e torna";
    }

    goBack(): void {
        this.copyTargetPlayers();
        this.location.back();
    }

    newPlayer() {
        this.playerService.selectedPlayer = {};
        this.playerService.newPlayer = true;
        this.copyTargetPlayers();
        this.router.navigate([REDIRECT_PLAYER_DV]);
    }

    private copyTargetPlayers() {
        this.selectedTeam.players = [];
        for (let pn of this.targetPlayers) {
            let p: Player = this.playerService.playerPool.find(x => x.playerName == pn);
            this.selectedTeam.players.push(p);
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
