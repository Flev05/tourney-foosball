import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { MeetingPlayoffService } from './meeting-playoff-service';
import { Team } from 'app/tourneyonline/domain/team';
import { Direction } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './meeting-rule-detailview.html',
})
export class MeetingRuleDetailView extends AbstractDetailView {

    msgs: Message[] = [];

    meetingFormGroup: FormGroup;
    toggleable: boolean = false;

    selectedPlayoff: Playoff;
    selectedMeeting: Meeting;
    
    dateAndTime: Date;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected countryService: CountryService,
        protected meetingPlayoffService: MeetingPlayoffService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("MeetingDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.selectedMeeting = this.meetingService.selectedMeeting;

        this.dateAndTime = new Date(this.selectedMeeting.datetime);
       
        // this.selectedMeeting.address =  this.selectedTourney.address;
        // this.selectedMeeting.country =  this.selectedTourney.country;

        // let homeTeamId = this.selectedMeeting.team1.id;
        // let homeTeam : Team = this.selectedTourney.teams.find( t => t.id == homeTeamId);
        // if( homeTeam != undefined ) {
        //     this.selectedMeeting.address = homeTeam.address;
        //     this.selectedMeeting.country = homeTeam.country;
        // }

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

        if( this.selectedPlayoff.round.direction == Direction.RoundTrip ) {
            let index = this.selectedPlayoff.round.onewayMeetings.indexOf(this.meetingService.selectedMeeting);
            if( index > -1 ) {
                let rtDateTime = this.selectedPlayoff.round.onewayMeetings[index].datetime;
                if(rtDateTime < this.selectedMeeting.datetime) {
                    this.selectedPlayoff.round.onewayMeetings[index].datetime = this.selectedMeeting.datetime;
                }
            }
        }

        this.selectedMeeting.address = this.meetingFormGroup.get('address').value;
        this.selectedMeeting.country = this.meetingFormGroup.get('country').value;

        let observer = this.meetingPlayoffService.savePlayoffMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedPlayoff.id);
        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
    }

    private saveMeetingNext(n:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(n);
        m.id = n.id;
    }

    done(): void {
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
