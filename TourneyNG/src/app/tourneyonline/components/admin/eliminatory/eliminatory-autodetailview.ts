import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder, Validators} from '@angular/forms';

import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Message } from 'app/components/common/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

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

    eliminatories: Eliminatory[];  

    selectedEliminatoryLevel: EliminatoryLevel;
    isTopLevel: boolean;
    private isOneway: boolean;

    isStandalone: boolean;
    m1: Meeting;
    m2: Meeting;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected countryService: CountryService,
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

        this.m1 = this.selectedEliminatory.round.onewayMeetings[0];

        this.isStandalone = this.tourneyService.isStandalone;

        if(this.m1.country!=undefined) {
            this.fullAddress1 = this.m1.address + " - " 
                + this.m1.country.zipCode + " " + this.m1.country.city
                + " (" + this.m1.country.provinceCode +")";
        }

        this.m2 = this.m1;
        if(!this.isOneway) {
            this.m2 = this.selectedEliminatory.round.onewayMeetings[1];
            if(this.m2.country!=undefined) {
                this.fullAddress2 = this.m2.address + " - " 
                    + this.m2.country.zipCode + " " + this.m2.country.city
                    + " (" + this.m2.country.provinceCode +")";
            }
        }

        this.eliminatoryFormGroup = this.fb.group({

            'meetingDate1': new FormControl(new Date(this.m1.datetime)),
            'address1': new FormControl(this.m1.address, Validators.compose([Validators.required])),
            'country1': new FormControl(this.m1.country),

            'meetingDate2': new FormControl(new Date(this.m2.datetime)),
            'address2': new FormControl(this.m2.address, Validators.compose([Validators.required])),
            'country2': new FormControl(this.m2.country),    
        });
    }

    private save() {

        let m1 = this.selectedEliminatory.round.onewayMeetings[0];

        m1.datetime = this.eliminatoryFormGroup.get('meetingDate1').value;
        m1.address = this.eliminatoryFormGroup.get('address1').value;
        m1.country = this.eliminatoryFormGroup.get('country1').value;

        this.meetingService.completeEliminatoryMeetingDb(m1, this.selectedTourney.id, this.selectedEliminatory.id);

        if(!this.isOneway) {
            let m2 = this.selectedEliminatory.round.onewayMeetings[1];
            m2.datetime = this.eliminatoryFormGroup.get('meetingDate2').value;
            if(m2.datetime < m1.datetime) {
                m2.datetime = m1.datetime;
            }
            m2.address = this.eliminatoryFormGroup.get('address2').value;
            m2.country = this.eliminatoryFormGroup.get('country2').value;

            this.meetingService.completeEliminatoryMeetingDb(m2, this.selectedTourney.id, this.selectedEliminatory.id);
        }

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
    }
    
    goBack(): void {
        this.save();
        super.goBack();
    }
    
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica eliminazione diretta fallita';

        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
