import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

@Component({
    templateUrl: './meeting-detailview.html',
})
export class MeetingDetailView extends AbstractDetailView {


    meetingFormGroup: FormGroup;
    toggleable: boolean = false;

    selectedRound: Round;
    selectedMeeting: Meeting;
    
    dateAndTime: Date;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("MeetingDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.selectedMeeting = this.meetingService.selectedMeeting;

        this.dateAndTime = new Date(this.selectedMeeting.datetime);
        
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

        if( this.selectedTourney.isOnewayRound != "true" ) {
            let index = this.selectedRound.onewayMeetings.indexOf(this.selectedMeeting);
            if( index > -1 ) {
                let rtDateTime = this.selectedRound.onewayMeetings[index].datetime;
                if(rtDateTime < this.selectedMeeting.datetime) {
                    this.selectedRound.onewayMeetings[index].datetime = this.selectedMeeting.datetime;
                }
            }
        }
        super.goBack();
    }
 
    onError(n:any) {
        let msgerr : string = 'Modifica meeting fallita';
        console.error(msgerr);
    }
}
