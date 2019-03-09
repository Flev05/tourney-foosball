import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from '../../common/abstract-detailview';
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
    
    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        private   playerService: PlayerService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("PlayerDetailView.ngOnInit() ");

        super.ngOnInit();

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

    onSubmit(value: string) {

        this.selectedPlayer.clientVO = this.clientService.selectedClient;

        let pvo : PlayerVO = {
            id: this.selectedPlayer.id
          , playerName: this.selectedPlayer.playerName
          , country: this.selectedPlayer.country
          , clientVO: this.selectedPlayer.clientVO
          , json: JSON.stringify(this.selectedPlayer)
        };

        this.playerAlreadyExists = false;

        const subscriber = this.playerService.savePlayer(pvo, this.savePlayerErrorHandler('Create player operation'));
        subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
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
 
    onError(n:any) {
        let msgerr : string = 'Creazione/Modifica giocatore fallita';
        console.error(msgerr);
    }
}
