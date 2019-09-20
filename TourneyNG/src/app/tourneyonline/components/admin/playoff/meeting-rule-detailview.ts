import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { MeetingPlayoffService } from './meeting-playoff-service';
import { Direction } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './meeting-rule-detailview.html',
})
export class MeetingRuleDetailView extends AbstractDetailView {

    msgs: Message[] = [];

    toggleable: boolean = false;

    selectedPlayoff: Playoff;
    selectedMeeting: Meeting;
    
    dateAndTime: Date;

    constructor(protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected countryService: CountryService,
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("MeetingRuleDetailView.ngOnInit() ");

        super.ngOnInit();
        
        this.selectedTourney = this.tourneyService.selectedTourney;

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.selectedMeeting = this.meetingPlayoffService.selectedMeeting;

        this.selectedMeeting.datetime = new Date(this.selectedMeeting.datetime);

        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());
    }

    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
    }

    private save() {

        if( this.selectedPlayoff.round.direction == Direction.RoundTrip ) {
            let index = this.selectedPlayoff.round.onewayMeetings.indexOf(this.meetingPlayoffService.selectedMeeting);
            if( index > -1 ) {
                let rtDateTime = this.selectedPlayoff.round.onewayMeetings[index].datetime;
                if(rtDateTime < this.selectedMeeting.datetime) {
                    this.selectedPlayoff.round.onewayMeetings[index].datetime = this.selectedMeeting.datetime;
                }
            }
        }
 
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
