import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Observable, of } from 'rxjs';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

@Component({
    templateUrl: './meeting-detailview.html',
})
export class MeetingDetailView extends AbstractDetailView {

    selectedRound: Round;
    selectedMeeting: Meeting;
    onSaveMeetingError: boolean;
    isRoundAutoGen: string;

    teamName1CB: Combobox;
    teamName2CB: Combobox;
    teams4RoundCombobox: Combobox[]; 

    
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
        this.isRoundAutoGen = this.meetingRoundService.isRoundAutoGen;

        this.teams4RoundCombobox = [];
        for( let t of this.selectedTourney.teams) {
            this.teams4RoundCombobox.push({label: t.teamName, value: t.id});
        }

        this.teamName1CB = {label: this.selectedMeeting.teamName1, value: -1};
        for( let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName1) {
                this.teamName1CB.value = t.id;
                break;
            }
        }
        this.teamName2CB = {label: this.selectedMeeting.teamName2, value: -1};
        for( let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName2) {
                this.teamName2CB.value = t.id;
                break;
            }
        }
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
        
        this.onSaveMeetingError = false;
        let observer = this.meetingRoundService.saveRoundMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedRound.id, this.saveMeetingErrorHandler()  );
        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));

        super.goBack();
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

    onError(n:any) {
        let msgerr : string = 'Modifica meeting fallita';
        console.error(msgerr);
    }

    /**
     * Processes the change on the number of teams for each round
     * @param cb the selected item in the combo box
     */
    onTeam1Change(cb: Combobox) {
        console.log('Entering onTeam1Change(' + cb +")");
        for(let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName1) {
                this.selectedMeeting.teamName1 = cb.label;
                break;
            }
        }
    }
    onTeam2Change(cb: Combobox) {
        console.log('Entering onTeam2Change(' + cb +")");
        for(let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName2) {
                this.selectedMeeting.teamName2 = cb.label;
                break;
            }
        }
    }
    
}
