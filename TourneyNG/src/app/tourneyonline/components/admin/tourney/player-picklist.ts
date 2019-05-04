import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Router } from '@angular/router';
import { Player } from 'app/tourneyonline/domain/player';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';

const REDIRECT_PLAYER_DV = "admintourney/dv/playerdv";

@Component({
    templateUrl: './player-picklist.html',
})
export class PlayerPickList extends AbstractListView {

    selectedTeam: Team;

    avalilablePlayers: string[];
    targetPlayers: string[];
    returnLabel: string;
    isPlayersChanged: boolean;

    constructor( protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private teamService: TeamService
        , private playerService: PlayerService
        , private clientService: ClientService
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
        this.isPlayersChanged = false;

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
        this.isPlayersChanged = true;
    }

    onMoveToSource(event) {
        console.log("Entering onMoveToSource()");
        this.returnLabel = "Salva e torna";
        this.isPlayersChanged = true;
    }

    goBack(): void {
        this.copyTargetPlayers();
        this.location.back();
    }

    newPlayer() {
        this.playerService.selectedPlayer = {};
        this.playerService.newPlayer = true;
        this.isPlayersChanged = true;
        this.returnLabel = "Salva e torna";
        this.router.navigate([REDIRECT_PLAYER_DV]);
    }

    /**
     * Verifies if some player was moved and, if so, replaces all the players in the selected team
     * with the players in the target area.
     * At last saves the selected tourney in the DB
     */
    private copyTargetPlayers() {
        if(!this.isPlayersChanged) {
            return;
        }
        this.selectedTeam.players = [];
        for (let pn of this.targetPlayers) {
            let p: Player = this.playerService.playerPool.find(x => x.playerName == pn);
            this.selectedTeam.players.push(p);
        }

        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        const subscriber = this.tourneyService.saveTourney(tvo,  this.onError("Player update failed"));
        subscriber.subscribe(cs => this.next(cs));
    }

    onError(n:any) : any {
        let msgerr : string;

        if(this.teamService.newTeam) {
            msgerr = 'Creation failed';
        } else {
            msgerr = 'Update failed';
        }
        console.log(msgerr);
    }
}
