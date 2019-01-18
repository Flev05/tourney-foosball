import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Player } from 'app/tourneyonline/domain/player';
import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';


@Component({
    templateUrl: './player-detailview.html',
})
export class PlayerDetailView extends AbstractDetailView {
    selectedPlayer: Player;

    msgs: Message[] = [];

    playerFormGroup: FormGroup;
    toggleable: boolean = false;
    fullAddress: string;
    
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

        if(this.playerService.newPlayer) {
            this.selectedPlayer.firstname = "";
            this.selectedPlayer.lastname = "";
            this.selectedPlayer.id = this.tourneyService.getSequenceNumber(); 
        }

        if(this.selectedPlayer.country != undefined ) {
            this.fullAddress = this.selectedPlayer.address + " - " 
            + this.selectedPlayer.country.zipCode + " " + this.selectedPlayer.country.city
            + " (" + this.selectedPlayer.country.provinceCode +")";
        }

        this.playerFormGroup = this.fb.group({
            'firstname': new FormControl(this.selectedPlayer.firstname, Validators.compose([Validators.required])),
            'lastname': new FormControl(this.selectedPlayer.lastname, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedPlayer.address),
            'country': new FormControl(this.selectedPlayer.country),
            'phoneNumber': new FormControl(this.selectedPlayer.phoneNumber),
            'email': new FormControl(this.selectedPlayer.email),
        });
    }

    onSubmit(value: string) {

        this.selectedPlayer.firstname = this.playerFormGroup.get('firstname').value;
        this.selectedPlayer.lastname = this.playerFormGroup.get('lastname').value;
        this.selectedPlayer.address = this.playerFormGroup.get('address').value;
        this.selectedPlayer.country = this.playerFormGroup.get('country').value;

        this.selectedPlayer.phoneNumber = this.playerFormGroup.get('phoneNumber').value;
        this.selectedPlayer.email = this.playerFormGroup.get('email').value;

        if(this.playerService.newPlayer) {
            this.playerService.newPlayer = false;
        }

        this.playerService.updatePlayer(this.selectedPlayer).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.playerService.newPlayer) {
            msgerr = 'Creazione nuovo giocatore fallita';
        } else {
            msgerr = 'Modifica giocatore fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
