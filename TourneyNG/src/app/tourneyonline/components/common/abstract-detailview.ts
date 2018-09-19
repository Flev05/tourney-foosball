import { OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { Country } from '../../domain/country';
import { CountryService } from '../../service/countryservice';

export abstract class AbstractDetailView implements OnInit {

    protected selectedTourney: Tourney;
    it: any;
    countries: Country[];
    filteredCountriesSingle: Country[];
    toggleable: boolean = false;

    constructor(
        protected tourneyService: TourneyService,
        protected location: Location,
        protected countryService: CountryService,
    ) {}

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;

        this.countryService.loadCountries().subscribe(c => {
            this.countries = c;
        });

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
    
    next(n:any) {
    }

    goBack(): void {
        this.location.back();
    }
    
    search(event) {
        let query = event.query;
        this.filteredCountriesSingle = this.filterCountry(query, this.countries);
    }

    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    filterCountry(query, countries: Country[]) : Country[] {
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
