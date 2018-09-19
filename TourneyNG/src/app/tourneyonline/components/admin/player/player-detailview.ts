import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { Player } from '../../../domain/player';
import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';


@Component({
    templateUrl: './player-detailview.html',
})
export class PlayerDetailView extends AbstractDetailView {
    selectedPlayer: Player;

    msgs: Message[] = [];

    playerFormGroup: FormGroup;
    toggleable: boolean = false;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("PlayerDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedPlayer = this.tourneyService.selectedPlayer;

        if(this.tourneyService.newPlayer) {
            this.selectedPlayer.id = this.tourneyService.getSequenceNumber(); 
        }

        this.playerFormGroup = this.fb.group({
            'firstname': new FormControl(this.selectedPlayer.firstname, Validators.compose([Validators.required])),
            'lastname': new FormControl(this.selectedPlayer.lastname, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedPlayer.address, Validators.compose([Validators.required])),
            'country': new FormControl(this.selectedPlayer.country),
            'phoneNumber': new FormControl(this.selectedPlayer.phoneNumber, Validators.compose([Validators.required])),
            'email': new FormControl(this.selectedPlayer.email, Validators.compose([Validators.required])),
        });
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedPlayer.firstname);
        let popup = 'Sicuro di voler rimuovere il giocatore: ';

        if(confirm(popup + this.selectedPlayer.firstname + "?")) {
            let index: number = this.selectedTourney.players.indexOf(this.selectedPlayer);
            if(index > -1) {
                this.selectedTourney.players.splice(index, 1);
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
        }
    }

    onSubmit(value: string) {

        this.selectedPlayer.firstname = this.playerFormGroup.get('firstname').value;
        this.selectedPlayer.lastname = this.playerFormGroup.get('lastname').value;
        this.selectedPlayer.address = this.playerFormGroup.get('address').value;
        this.selectedPlayer.country = this.playerFormGroup.get('country').value;

        this.selectedPlayer.phoneNumber = this.playerFormGroup.get('phoneNumber').value;
        this.selectedPlayer.email = this.playerFormGroup.get('email').value;

        if(this.tourneyService.newPlayer) {
            this.selectedTourney.players.push(this.selectedPlayer);
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newPlayer) {
            msgerr = 'Creazione nuovo giocatore fallita';
        } else {
            msgerr = 'Modifica giocatore fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
