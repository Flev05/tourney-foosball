import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from '../../../../components/common/abstract-detailview';
import { Player } from '../../../../domain/player';
import { TourneyService } from '../../../../service/tourney-service';
import { CountryService } from '../../../../service/country-service';
import { PlayerService } from '../../../../service/player-service';
import { Observable, of } from 'rxjs';
import { ClientService } from '../../../../service/client-service';
import { PlayerVO } from '../../../../domain/player-vo';
import { TourneyVO } from '../../../../domain/tourney.vo';
import { LoginService } from '../../../../service/login-service';
import { Team } from '../../../../domain/team';
import { TeamService } from '../../../../service/team-service';

@Component({
    templateUrl: './player-detailview.html',
})
export class PlayerDetailView extends AbstractDetailView {
    selectedPlayer: Player = new Player();

    playerAlreadyExists: boolean = false;
    onSavePlayerError: boolean = false;
    newPlayerVO: PlayerVO = new PlayerVO();
    
    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        protected loginService: LoginService,
        protected teamService: TeamService,
        public playerService: PlayerService
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        console.log("PlayerDetailView.ngOnInit() ");

        super.ngOnInit();
        this.countries = this.countryService.countries;
        this.selectedPlayer = this.playerService.selectedPlayer;
        this.playerAlreadyExists = false;

        if(this.playerService.newPlayer) {
            this.selectedPlayer.playerName = "";
            this.selectedPlayer.id = null; 
        }
    }

    enabledModify() : boolean {
        if(this.loginService.isOperator()) {
            let un = this.loginService.userLogged.username;
            let tn = this.teamService.selectedTeam.teamName;
            let team = this.selectedTourney.teams.find(t => t.teamName == tn);
            if( team ) {
                let index = team.operators.indexOf(un);
                if( index != -1) {
                    return true;
                }
            }
        }
        if( this.playerService.readOnly ) {
            return false;
        }
        return true;
    }

    enableSaveButton() : string {
        let n : String = this.selectedPlayer.playerName;
        if( n == undefined  ) {
            return  "disabled";
        }
        return   n.trim() == "" ? "disabled" : "";
    }

    onSubmit() {
        this.selectedPlayer.clientId = this.clientService.selectedClient == undefined ? null : this.clientService.selectedClient.id;
        this.newPlayerVO = {
            id: this.selectedPlayer.id
            , playerName: this.selectedPlayer.playerName
            , country: this.selectedPlayer.country
            , clientId: this.selectedPlayer.clientId
            , json: JSON.stringify(this.selectedPlayer)
        };
        this.playerAlreadyExists = false;
        this.onSavePlayerError = false;
        const subscriber = this.playerService.savePlayer(this.newPlayerVO, this.savePlayerErrorHandler('Create player operation'));
        subscriber.subscribe(cs => this.newPlayerNext(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
        this.updateTourney();
    }
 
    private updateTourney(): void {
        console.log("Entering updateTourney()");
        for( let t of this.selectedTourney.teams ) {
            for( let p of t.players ) {
                if( p.id == this.selectedPlayer.id ) {
                    p = this.selectedPlayer;
                }
            }
        }
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Save Tourney operation'));
        subscriber.subscribe(cs => {}, e => this.subscribeErrorHandler(e), () => {});
    }
    
    private newPlayerNext(tvo:PlayerVO) {
        console.log("newPlayerNext()");
        console.log(tvo.json);
        this.selectedPlayer.id = tvo.id;
    }

    protected override subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onSavePlayerError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    private onSaveComplete() {
        console.log("Entering onSaveComplete()");
        if( !this.onSavePlayerError ) {
            if(this.playerService.newPlayer) {
                let ppo: Player = JSON.parse(this.newPlayerVO.json);
                ppo.country = this.newPlayerVO.country;
                ppo.clientId = this.newPlayerVO.clientId;
                ppo.playerName = this.newPlayerVO.playerName;
                this.playerService.playerPool.push(ppo);
            }
            this.playerService.newPlayer = false;
            super.goBack();
        }
    }

    private savePlayerErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering savePlayerErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            this.onSavePlayerError = true;
            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            if( res.error.errorCode == "PlayerAlreadyExists" ) {
                this.playerAlreadyExists = true;
                return of(result as T);
            }
            return of(result as T);
        };
    }
 
    override onError(n:any): any {
        let msgerr : string = 'Creazione/Modifica giocatore fallita';
        console.error(msgerr);
    }
}
