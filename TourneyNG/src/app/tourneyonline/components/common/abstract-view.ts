import { OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';

import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Country } from 'app/tourneyonline/domain/country';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Observable, of } from 'rxjs';

export abstract class AbstractView implements OnInit {
    it: any;
    selectedTourney: Tourney;
    countries: Country[];
    filteredCountriesSingle: Country[];
    toggleable: boolean = false;
    serverUnreachable: boolean = false;

    constructor(
         protected tourneyService: TourneyService
         , protected location: Location
    ) {}

    protected cloneObject(c: any): any {
        return this.tourneyService.cloneObject(c);
    }

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
        return this.containsPhase(PhaseType.P, this.selectedTourney.phases);
    }

    containsEliminatory(): boolean {
        let con: boolean = this.containsPhase(PhaseType.E, this.selectedTourney.phases);
        return con;
    }

    next(n:any) {
        console.log("next()");
        console.log(n);
    }

    goBack(): void {
        this.location.back();
    }
    
    searchCountry(event) {
        let query = event.query;
        this.filteredCountriesSingle =this.filterCountry(query, this.countries);
    }

    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    private filterCountry(query, countries: Country[]) : Country[] {
        let filtered : Country[] = [];
        for(let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if(country.city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }
}
