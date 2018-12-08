import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder, Validators} from '@angular/forms';

import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Team } from 'app/tourneyonline/domain/team';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Message } from 'app/components/common/api';
import { EliminatoryMode } from 'app/tourneyonline/domain/enumerations';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { AbstractDetailView } from '../../common/abstract-detailview';

@Component({
    templateUrl: './eliminatory-autodetailview.html',
})
export class AutoEliminatoryDetailView extends AbstractDetailView {
    
    msgs: Message[] = [];

    eliminatoryFormGroup: FormGroup;
    toggleable: boolean = false;

    fullAddress1: string;
    fullAddress2: string;

    selectedEliminatory: Eliminatory;

    eliminatoryMode: EliminatoryMode;
    eliminatories: Eliminatory[];  

    selectedEliminatoryLevel: EliminatoryLevel;
    isTopLevel: boolean;
    private isOneway: boolean;

    isStandalone: boolean;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("EliminatoryDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedEliminatory = this.tourneyService.selectedEliminatory;
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        this.isOneway = this.selectedEliminatoryLevel.isOneway;
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;

        let m1: Meeting = this.selectedEliminatory.round.meetings[0];

        this.isStandalone = this.tourneyService.isStandalone;

        if(m1.country!=undefined) {
            this.fullAddress1 = m1.address + " - " 
                + m1.country.zipCode + " " + m1.country.city
                + " (" + m1.country.provinceCode +")";
        }

        let m2: Meeting = m1;
        if(!this.isOneway) {
            m2 = this.selectedEliminatory.round.meetings[1];
            if(m2.country!=undefined) {
                this.fullAddress2 = m2.address + " - " 
                    + m2.country.zipCode + " " + m2.country.city
                    + " (" + m2.country.provinceCode +")";
            }
        }

        this.eliminatoryFormGroup = this.fb.group({

            'meetingDate1': new FormControl(new Date(m1.datetime)),
            'address1': new FormControl(m1.address, Validators.compose([Validators.required])),
            'country1': new FormControl(m1.country),

            'meetingDate2': new FormControl(new Date(m2.datetime)),
            'address2': new FormControl(m2.address, Validators.compose([Validators.required])),
            'country2': new FormControl(m2.country),    
        });
    }

    onSubmit(value: string) {

        let m1 = this.selectedEliminatory.round.meetings[0];

        m1.datetime = this.eliminatoryFormGroup.get('meetingDate1').value;
        m1.address = this.eliminatoryFormGroup.get('address1').value;
        m1.country = this.eliminatoryFormGroup.get('country1').value;

        if(!this.isOneway) {
            let m2 = this.selectedEliminatory.round.meetings[1];
            m2.datetime = this.eliminatoryFormGroup.get('meetingDate2').value;
            m2.address = this.eliminatoryFormGroup.get('address2').value;
            m2.country = this.eliminatoryFormGroup.get('country2').value;

            this.tourneyService.updateMeetingDb(m2, this.selectedTourney.id, 0, 0, this.selectedEliminatory.id);
        }

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica eliminazione diretta fallita';

        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
