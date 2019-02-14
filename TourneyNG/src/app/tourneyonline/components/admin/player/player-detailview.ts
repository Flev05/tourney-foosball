import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { Player } from 'app/tourneyonline/domain/player';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';


@Component({
    templateUrl: './player-detailview.html',
})
export class PlayerDetailView extends AbstractDetailView {
    selectedPlayer: Player;

    toggleable: boolean = false;
    playerAlreadyExists: boolean;
    
    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
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
        let a : String = this.selectedPlayer.address;
        let p : String = this.selectedPlayer.phoneNumber;
        let m : String = this.selectedPlayer.email;
        return a.trim() == "" || n.trim() == "" || p.trim() == "" || m.trim() == "" ? "disabled" : "";
    }

    onSubmit(value: string) {

        if(this.playerService.newPlayer) {
            this.playerService.newPlayer = false;
            this.playerAlreadyExists = false;
            
            let pl = this.verifyPlayer(this.selectedPlayer.playerName);
            if(pl != null) {
                this.playerAlreadyExists = true;
                return;
            }
        }

        this.playerService.savePlayer(this.selectedPlayer).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    private verifyPlayer(playerName: string): Player {
        let p2 = playerName.trim().toUpperCase();
        for(let p of this.playerService.playerPool) {
            let p1 = p.playerName.trim().toUpperCase();
            if( p1 == p2 ) {
                return p;
            }
        }
        return null;
    }
 
    onError(n:any) {
        let msgerr : string = 'Creazione/Modifica giocatore fallita';
        console.error(msgerr);
    }
}
