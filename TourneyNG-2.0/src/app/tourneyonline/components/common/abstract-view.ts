import { Injectable, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';

import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Country } from 'app/tourneyonline/domain/country';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Observable, of } from 'rxjs';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

@Injectable()
export abstract class AbstractView implements OnInit {
    it: any;
    selectedTourney: Tourney = new Tourney();
    countries: Country[] = [];
    filteredCountriesSingle: Country[] = [];
    toggleable: boolean = false;
    serverUnreachable: boolean = false;
    onSaveTourneyError: boolean = false;
    tourneyAlreadyExists: boolean = false;
    badRequest: boolean = false;
    
    constructor(
         protected tourneyService: TourneyService
         , protected location: Location
    ) {}

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;
        
        this.it = {
        	firstDayOfWeek: 1,
        	dayNames: [ "domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato" ],
        	dayNamesShort: [ "dom","lun","mar","mer","gio","ven","sab" ],
        	dayNamesMin: [ "D","L","M","M","G","V","S" ],
            
            monthNames: [ "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno"
                         ,"Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre" ],

        	monthNamesShort: [ "Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic" ],
            today: 'Oggi',
            clear: 'Clear'
        };

        let today = new Date();

        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month -1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        
        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);

        registerLocaleData(localeIt);
    }
    
    protected serverUnreachableHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering serverUnreachableHandler()");
            this.serverUnreachable = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    protected containsPhase(value: PhaseType, phases: PhaseType[]) : boolean {
        for(let i=0; i<phases.length; i++ ) {
            if(phases[i] == value ) {
                return true;
            }
        }
        return false;
    }

    containsRound(): boolean {
        return this.containsPhase(PhaseType.R, this.selectedTourney.phases);
    }

    containsPlayoff(): boolean {
        return this.containsPhase(PhaseType.P, this.selectedTourney.phases) && this.containsRound();
    }

    containsPlayout(): boolean {
        return this.containsPhase(PhaseType.O, this.selectedTourney.phases) && this.containsPlayoff();
    }

    containsEliminatory(): boolean {
        let con: boolean = this.containsPhase(PhaseType.E, this.selectedTourney.phases);
        return con;
    }
    containsEliminatoryB(): boolean {
        let con: boolean = this.containsPhase(PhaseType.EB, this.selectedTourney.phases);
        return con;
    }

    next(n:any) {
        console.log("next()");
        console.log(n);
    }

    goBack(): void {
        this.location.back();
    }
    
    searchCountry(event : any) {
        let query = event.query;
        this.filteredCountriesSingle = [...this.filterCountry(query, this.countries)];
    }

    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    private filterCountry(query : any, countries: Country[]) : Country[] {
        let filtered : Country[] = [];
        for(let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if( country.city == undefined ) continue;
            if(country.city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }

    protected saveTourneyErrorHandler<T> (operation = 'operation', result?: T): any {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            this.onSaveTourneyError = true;
            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            if( res.error.errorCode == "TourneyAlreadyExists" ) {
                this.tourneyAlreadyExists = true;
                return of(result as T);
            }
            return of(result as T);
        };
    }

    protected subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onSaveTourneyError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

}
