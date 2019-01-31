import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';

@Component({
    templateUrl: './meeting-detailview.html',
})
export class MeetingDetailView extends AbstractDetailView {


    meetingFormGroup: FormGroup;
    toggleable: boolean = false;

    selectedRound: Round;
    selectedMeeting: MeetingDb;
    
    fullAddress: string;
    dateAndTime: Date;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("MeetingDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.selectedMeeting = this.tourneyService.selectedMeeting;

        this.dateAndTime = new Date(this.selectedMeeting.datetime);
        
        this.fullAddress = this.selectedMeeting.address + " - " 
            + this.selectedMeeting.country.zipCode + " " + this.selectedMeeting.country.city
            + " (" + this.selectedMeeting.country.provinceCode +")";

        this.meetingFormGroup = this.fb.group({
            'name':    new FormControl(this.selectedMeeting.name),
            
            'dateAndTime':    new FormControl(this.dateAndTime),

            'address': new FormControl(this.selectedMeeting.address),
            'country': new FormControl(this.selectedMeeting.country),
        });
    }

    goBack() {

        let dt = this.meetingFormGroup.get('dateAndTime').value;

        this.selectedMeeting.datetime = new Date(dt);

        this.selectedMeeting.address = this.meetingFormGroup.get('address').value;
        this.selectedMeeting.country = this.meetingFormGroup.get('country').value;

        if( !this.selectedTourney.isOnewayRound ) {
            let rtDateTime = this.selectedRound.meetings[1].datetime;
            if(rtDateTime < this.selectedMeeting.datetime) {
                this.selectedRound.meetings[1].datetime = this.selectedMeeting.datetime;
            }
        }
        super.goBack();
    }
 
    onError(n:any) {
        let msgerr : string = 'Modifica meeting fallita';
        console.error(msgerr);
    }
}
