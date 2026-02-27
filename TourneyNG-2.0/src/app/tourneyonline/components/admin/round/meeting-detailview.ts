import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Meeting } from '../../../domain/meeting';
import { Round } from '../../../domain/round';
import { TourneyService } from '../../../service/tourney-service';
import { AbstractDetailView } from '../../../components/common/abstract-detailview';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from '../../../domain/meeting-db';
import { Direction } from '../../../domain/enumerations';
import { CountryService } from '../../../service/country-service';
import { Observable, of } from 'rxjs';
import { Combobox } from '../../../domain/tourney-combobox';
import { Team } from '../../../domain/team';

@Component({
    templateUrl: './meeting-detailview.html',
})
export class MeetingDetailView extends AbstractDetailView {

    selectedRound: Round = new Round();
    selectedMeeting: Meeting = new Meeting();
    onSaveMeetingError: boolean = false;
    isRoundAutoGen: string = "true";

    teamName1CB: Combobox = new Combobox();
    teamName2CB: Combobox = new Combobox();
    teams4RoundCombobox: Combobox[] = []; 

    constructor( protected override location: Location,
        protected override tourneyService: TourneyService,
        protected meetingRoundService: MeetingRoundService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        console.log("MeetingDetailView.ngOnInit() ");

        super.ngOnInit();

        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());

        this.selectedRound = this.tourneyService.selectedRound;
        this.selectedMeeting = this.meetingRoundService.selectedMeeting;

        this.selectedMeeting.datetime = new Date(this.selectedMeeting.datetime);
        this.isRoundAutoGen = this.meetingRoundService.isRoundAutoGen;

        this.teams4RoundCombobox = [];
        for( let tn of this.selectedRound.teamNames) {
            let team = this.selectedTourney.teams.find( t => t.teamName == tn);
            if( !team ) continue;
            this.teams4RoundCombobox.push({label: team.teamName, value: team.id});
        }
        this.teams4RoundCombobox.sort((t1,t2) => {
            if(t1.label == null && t2.label == null) {
                return 0;
            }

            if(t1.label < t2.label) {
                return -1;
            }
            if(t1.label > t2.label) {
                return 1;
            }
            return 0;
        });

        this.teamName1CB = {label: this.selectedMeeting.teamName1 == null ? "" : this.selectedMeeting.teamName1, value: -1};
        for( let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName1) {
                this.teamName1CB.value = t.id;
                break;
            }
        }
        this.teamName2CB = {label: this.selectedMeeting.teamName2 == null ? "" : this.selectedMeeting.teamName2 , value: -1};
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

    save() {
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
    }

    private saveMeetingNext(n:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(n);
        m.id = n.id;
        this.selectedRound = this.tourneyService.selectedRound;
        const subsbr = this.meetingRoundService.loadRoundMeeting(this.selectedTourney, this.selectedRound);
        subsbr.subscribe(t => this.onCompleteLoad(t), e => this.onError(e) );
    }

    private onCompleteLoad(t: MeetingDb[]): void {
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.meetingRoundService.onCompleteLoad(this.selectedRound, t, () => {});
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

    override onError(n:any) {
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
            if(t.teamName == cb.label) {
                this.selectedMeeting.teamName1 = cb.label;
                this.selectedMeeting.address = t.address;
                this.selectedMeeting.country = t.country;
                break;
            }
        }
    }
    onTeam2Change(cb: Combobox) {
        console.log('Entering onTeam2Change(' + cb +")");
        for(let t of this.selectedTourney.teams) {
            if(t.teamName == cb.label) {
                this.selectedMeeting.teamName2 = cb.label;
                break;
            }
        }
    }
}
