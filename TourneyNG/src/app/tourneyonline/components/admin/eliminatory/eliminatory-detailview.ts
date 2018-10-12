import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { Team } from '../../../domain/team';
import { Player } from '../../../domain/player';
import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';


@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {
    selectedEliminatory: Eliminatory;

    msgs: Message[] = [];

    eliminatoryFormGroup: FormGroup;
    toggleable: boolean = false;

    availablePlayers: Player[] = [];
    targetPlayers: Player[] = [];

    fullAddress: string;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedEliminatory = this.tourneyService.selectedEliminatory;

        if(this.selectedEliminatory.round.meetings[0].country!=undefined) {
            this.fullAddress = this.selectedEliminatory.round.meetings[0].address + " - " 
                + this.selectedEliminatory.round.meetings[0].country.zipCode + " " + this.selectedEliminatory.round.meetings[0].country.city
                + " (" + this.selectedEliminatory.round.meetings[0].country.provinceCode +")";
        }

        this.eliminatoryFormGroup = this.fb.group({
            'name': new FormControl(this.selectedEliminatory.round.name, Validators.compose([Validators.required])),
            'address':  new FormControl(this.selectedEliminatory.round.meetings[0].address ),

            'country':          new FormControl(this.selectedEliminatory.round.meetings[0].country),
        });
    }
 
    onSubmit(value: string) {

        this.selectedEliminatory.round.name = this.eliminatoryFormGroup.get('name').value;
        this.selectedEliminatory.round.meetings[0].address = this.eliminatoryFormGroup.get('address').value;
        this.selectedEliminatory.round.meetings[0].country = this.eliminatoryFormGroup.get('country').value;

        if(this.tourneyService.newTeam) {
            this.selectedTourney.teams.push(this.selectedEliminatory);
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newTeam) {
            msgerr = 'Creazione nuova squadra fallita';
        } else {
            msgerr = 'Modifica squadra fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
