import { OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { Country } from '../../domain/country';
import { Team } from 'app/tourneyonline/domain/team';
import { Classification } from 'app/tourneyonline/domain/classification';

export abstract class AbstractView implements OnInit {

    protected selectedTourney: Tourney;
    countries: Country[];
    filteredCountriesSingle: Country[];
    toggleable: boolean = false;

    constructor(
         protected tourneyService: TourneyService
        , protected location: Location
    ) {}

    protected cloneObject(c: any): any {
        let obj = {};
        for (let prop in c) {
            obj[prop] = c[prop];
        }
        return obj;
    }

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;
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

    protected newClassification(t: Team, initialPoints: number): Classification {
        return {
            id: this.tourneyService.getSequenceNumber(),
            team: t,
            points: initialPoints,
            played: 0,
            won: 0,
            lost: 0,
            balanced: 0,
            penalty: 0,
            goalsDone: 0,
            goalsConceded: 0,
            goalsDiff: 0
        };
    }


}
