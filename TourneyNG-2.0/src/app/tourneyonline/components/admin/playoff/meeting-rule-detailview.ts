import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message, MessageService } from 'primeng/api';

import { Meeting } from '../../../domain/meeting';
import { Playoff } from '../../../domain/playoff';
import { TourneyService } from '../../../service/tourney-service';
import { CountryService } from '../../../service/country-service';
import { AbstractDetailView } from '../../../components/common/abstract-detailview';
import { MeetingDb } from '../../../domain/meeting-db';
import { MeetingPlayoffService } from './meeting-playoff-service';
import { Direction } from '../../../domain/enumerations';
import { Observable, of } from 'rxjs';

@Component({
    templateUrl: './meeting-rule-detailview.html',
})
export class MeetingRuleDetailView extends AbstractDetailView {
    selectedPlayoff: Playoff = new Playoff();
    selectedMeeting: Meeting = new Meeting();
    onSaveMeetingError: boolean = false;
    
    constructor(protected override location: Location,
        protected override tourneyService: TourneyService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected countryService: CountryService
        ,private messageService: MessageService
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        console.log("MeetingRuleDetailView.ngOnInit() ");

        super.ngOnInit();
        
        this.selectedTourney = this.tourneyService.selectedTourney;
        if(this.tourneyService.selectedPlayoff != null ) {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        } else {
            this.selectedPlayoff = this.tourneyService.selectedPlayout;
        }
        
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
 
        let observer = null;
        if(this.tourneyService.selectedPlayoff != null ) {
            observer = this.meetingPlayoffService.savePlayoffMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedPlayoff.id, this.saveMeetingErrorHandler());
        } else {
            observer = this.meetingPlayoffService.savePlayoutMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedPlayoff.id, this.saveMeetingErrorHandler());
        }
        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
    }

    private saveMeetingErrorHandler<MeetingDb> (result?: MeetingDb)  {
        return (res: any): Observable<MeetingDb> => {
            console.log("Entering saveMeetingErrorHandler()");
            console.error(res); // log to console instead
      
            this.onSaveMeetingError = true;

            return of(result as MeetingDb);
        };
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

    override onError(n:any) {
        let msgerr : string = 'Modifica meeting fallita';
        this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: msgerr
        });
    }
}
