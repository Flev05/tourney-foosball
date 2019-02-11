import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
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

    playerFormGroup: FormGroup;
    toggleable: boolean = false;
    playerAlreadyExists: boolean;
    
    constructor(
        private fb: FormBuilder,
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

        this.playerFormGroup = this.fb.group({
            'playerName': new FormControl(this.selectedPlayer.playerName, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedPlayer.address),
            'country': new FormControl(this.selectedPlayer.country),
            'phoneNumber': new FormControl(this.selectedPlayer.phoneNumber),
            'email': new FormControl(this.selectedPlayer.email),
        });
    }

    onSubmit(value: string) {

        this.selectedPlayer.playerName = this.playerFormGroup.get('playerName').value;
        this.selectedPlayer.address = this.playerFormGroup.get('address').value;
        this.selectedPlayer.country = this.playerFormGroup.get('country').value;

        this.selectedPlayer.phoneNumber = this.playerFormGroup.get('phoneNumber').value;
        this.selectedPlayer.email = this.playerFormGroup.get('email').value;

        if(this.playerService.newPlayer) {
            this.playerService.newPlayer = false;
            this.playerAlreadyExists = false;
            
            let pl = this.verifyPlayer(this.selectedPlayer.playerName);
            if(pl != null) {
                this.playerAlreadyExists = true;

                this.playerFormGroup = this.fb.group({
                    'playerName': new FormControl(pl.playerName, Validators.compose([Validators.required])),
                    'address': new FormControl(pl.address),
                    'country': new FormControl(pl.country),
                    'phoneNumber': new FormControl(pl.phoneNumber),
                    'email': new FormControl(pl.email),
                });
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
