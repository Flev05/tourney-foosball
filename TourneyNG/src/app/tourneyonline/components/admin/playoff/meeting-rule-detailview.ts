import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';

@Component({
    templateUrl: './meeting-rule-detailview.html',
})
export class MeetingRuleDetailView extends AbstractDetailView {

    msgs: Message[] = [];

    meetingFormGroup: FormGroup;
    toggleable: boolean = false;

    selectedPlayoff: Playoff;
    selectedMeeting: Meeting;
    
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

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
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

    private save() {

        let dt = this.meetingFormGroup.get('dateAndTime').value;

        this.selectedMeeting.datetime = new Date(dt);

        if( !this.selectedTourney.isOnewayRound ) {
            let rtDateTime = this.selectedPlayoff.round.meetings[1].datetime;
            if(rtDateTime < this.selectedMeeting.datetime) {
                this.selectedPlayoff.round.meetings[1].datetime = this.selectedMeeting.datetime;
            }
        }

        this.selectedMeeting.address = this.meetingFormGroup.get('address').value;
        this.selectedMeeting.country = this.meetingFormGroup.get('country').value;
    }
    
    goBack(): void {
        this.save();
        super.goBack();
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica meeting fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
