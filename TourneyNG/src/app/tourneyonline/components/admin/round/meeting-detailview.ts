import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Team } from 'app/tourneyonline/domain/team';
import { Direction } from 'app/tourneyonline/domain/enumerations';

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
        public meetingService: MeetingRoundService,
        protected meetingRoundService: MeetingRoundService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("MeetingDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.selectedMeeting = this.meetingService.selectedMeeting;

        this.dateAndTime = new Date(this.selectedMeeting.datetime);
               
        this.selectedMeeting.address =  this.selectedTourney.address;
        this.selectedMeeting.country =  this.selectedTourney.country;
        
        let homeTeamId = this.selectedMeeting.team1.id;
        let homeTeam : Team = this.selectedTourney.teams.find( t => t.id == homeTeamId);
        if( homeTeam != undefined ) {
            this.selectedMeeting.address = homeTeam.address;
            this.selectedMeeting.country = homeTeam.country;
        }

        this.meetingFormGroup = this.fb.group({
            'name':    new FormControl(this.selectedMeeting.name),
            
            'dateAndTime':    new FormControl(this.dateAndTime),

            'address': new FormControl(this.selectedMeeting.address),
            'country': new FormControl(this.selectedMeeting.country),
        });
    }

    done() {
        let dt = this.meetingFormGroup.get('dateAndTime').value;

        this.selectedMeeting.datetime = new Date(dt);

        this.selectedMeeting.address = this.meetingFormGroup.get('address').value;
        this.selectedMeeting.country = this.meetingFormGroup.get('country').value;

        if( this.selectedRound.direction == Direction.RoundTrip ) {
            let index = this.selectedRound.onewayMeetings.indexOf(this.selectedMeeting);
            if( index > -1 ) {
                let rtDateTime = this.selectedRound.onewayMeetings[index].datetime;
                if(rtDateTime < this.selectedMeeting.datetime) {
                    this.selectedRound.onewayMeetings[index].datetime = this.selectedMeeting.datetime;
                }
            }
        }

        let observer = this.meetingRoundService.saveRoundMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedRound.id);
        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));

        super.goBack();
    }
    
    private saveMeetingNext(n:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(n);
        m.id = n.id;
    }

    onError(n:any) {
        let msgerr : string = 'Modifica meeting fallita';
        console.error(msgerr);
    }
}
