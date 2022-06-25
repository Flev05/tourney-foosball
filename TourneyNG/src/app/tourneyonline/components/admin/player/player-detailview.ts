import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { Player } from 'app/tourneyonline/domain/player';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { Observable, of } from 'rxjs';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { PlayerVO } from 'app/tourneyonline/domain/player-vo';

@Component({
    templateUrl: './player-detailview.html',
})
export class PlayerDetailView extends AbstractDetailView {
    selectedPlayer: Player;

    toggleable: boolean = false;
    playerAlreadyExists: boolean;
    onSavePlayerError: boolean;
    badRequest: boolean;
    newPlayerVO: PlayerVO;
    
    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        private   playerService: PlayerService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
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
    }
 
    private newPlayerNext(tvo:PlayerVO) {
        console.log("newPlayerNext()");
        console.log(tvo);
        this.selectedPlayer.id = tvo.id;
    }

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
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
 
    onError(n:any): any {
        let msgerr : string = 'Creazione/Modifica giocatore fallita';
        console.error(msgerr);
    }
}
