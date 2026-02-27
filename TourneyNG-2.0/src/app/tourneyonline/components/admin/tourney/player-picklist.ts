import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Team } from '../../../domain/team';
import { TourneyService } from '../../../service/tourney-service';
import { TeamService } from '../../../service/team-service';
import { AbstractListView } from '../../../components/common/abstract-listview';
import { Player } from '../../../domain/player';
import { PlayerService } from '../../../service/player-service';
import { ClientService } from '../../../service/client-service';
import { TourneyVO } from '../../../domain/tourney.vo';

const REDIRECT_PLAYER_DV = "admintourney/dv/playerdv";

@Component({
    templateUrl: './player-picklist.html'
})
export class PlayerPickList extends AbstractListView {

    selectedTeam: Team = new Team();

    availablePlayers: string[] = [];
    targetPlayers: string[] = [];
    returnLabel: string = "";
    isPlayersChanged: boolean = false;

    constructor( protected override tourneyService: TourneyService
        , public override router: Router
        , protected override location: Location
        , private teamService: TeamService
        , private playerService: PlayerService
        , private clientService: ClientService
        ) 
    { 
        super("", tourneyService, router, location);
    }

    override ngOnInit() {
        console.log("PlayerPickList.ngOnInit() ");
        super.ngOnInit();
        this.returnLabel = "Indietro";
        this.prepareAvailablePlayers();
    }
    
    private prepareAvailablePlayers(): void {
        this.selectedTeam = this.teamService.selectedTeam;
        this.isPlayersChanged = false;

        this.targetPlayers  = this.selectedTeam.players.filter( p => p != null) .map( p =>   p.playerName );

        let usedPlayers: Array<Player> = new Array<Player>();
        for(let t of this.selectedTourney.teams) {
            usedPlayers = usedPlayers.concat(t.players);
        }

        this.availablePlayers = [];
        for(let p of this.playerService.playerPool) {
            let upl = usedPlayers.find(x => x==null || x.playerName == p.playerName);
            let tpl =  this.targetPlayers.find(x => x==null || x == p.playerName);
            if(upl == undefined && tpl == undefined) {
                this.availablePlayers.push(p.playerName);
            }
        }
        this.availablePlayers.sort();
        this.targetPlayers.sort();
    }
    
    onMoveToTarget(event : any) {
        console.log("Entering onMoveToTarget()");
        this.returnLabel = "Salva e torna";
        this.isPlayersChanged = true;
    }

    onMoveToSource(event : any) {
        console.log("Entering onMoveToSource()");
        this.returnLabel = "Salva e torna";
        this.isPlayersChanged = true;
    }

    override goBack(): void {
        this.copyTargetPlayers();
        this.location.back();
    }

    newPlayer() {
        this.playerService.selectedPlayer = new Player();
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
        let tourneyTeam = this.selectedTourney.teams.find( t => t.teamName == this.selectedTeam.teamName );
        if( tourneyTeam == undefined ) {
            console.error("No team found in the tourney teams with team name [" + this.selectedTeam.teamName + "]");
            return;
        }

        let index = this.selectedTourney.teams.indexOf(tourneyTeam);
        if( index == -1 ) {
            console.error("Unable to find the tourney teams with team name [" + this.selectedTeam.teamName + "]");
            return;
        }

        tourneyTeam.players = [];
        for (let pn of this.targetPlayers) {
            let p = this.playerService.playerPool.find(x => x.playerName == pn);
            if( p == null || p == undefined ){
                continue;
            }
            tourneyTeam.players.push(p);
        }
 
        this.selectedTourney.teams[index] = tourneyTeam;
        let poolIndex = this.teamService.teamPool.findIndex(t => t.teamName == this.selectedTeam.teamName);
        this.teamService.teamPool[poolIndex] = tourneyTeam;

        this.teamService.selectedTeam = tourneyTeam;

        let tvo = new TourneyVO();
        tvo.id = this.selectedTourney.id;
        tvo.tourneyName = this.selectedTourney.tourneyName;
        tvo.country = this.selectedTourney.country;
        tvo.clientVO = this.clientService.selectedClient;
        tvo.json = JSON.stringify(this.selectedTourney);
        const subscriber = this.tourneyService.saveTourney(tvo,  this.onError("Player update failed"));
        subscriber.subscribe(cs => this.next(cs));
    }

    override onError(n:any) : any {
        let msgerr : string;

        if(this.teamService.newTeam) {
            msgerr = 'Creation failed';
        } else {
            msgerr = 'Update failed';
        }
        console.log(msgerr);
    }
}
