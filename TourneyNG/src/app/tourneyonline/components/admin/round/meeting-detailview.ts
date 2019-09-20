import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { CountryService } from 'app/tourneyonline/service/country-service';

@Component({
    templateUrl: './meeting-detailview.html',
})
export class MeetingDetailView extends AbstractDetailView {

    selectedRound: Round;
    selectedMeeting: Meeting;
    
    dateAndTime: Date;

    constructor( protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingRoundService: MeetingRoundService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("MeetingDetailView.ngOnInit() ");

        super.ngOnInit();

        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());

        this.selectedRound = this.tourneyService.selectedRound;
        this.selectedMeeting = this.meetingRoundService.selectedMeeting;

        this.selectedMeeting.datetime = new Date(this.selectedMeeting.datetime);
    }

    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
    }

    done() {
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
