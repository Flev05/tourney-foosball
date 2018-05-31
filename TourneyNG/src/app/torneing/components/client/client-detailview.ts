import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Client } from '../../domain/client';
import { ClientService } from '../../service/clientservice';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { CountryService } from '../../service/countryservice';
import { Country } from '../../domain/country';

@Component({
    templateUrl: './client-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class ClientDetailView implements OnInit {

    selectedClient: Client;
  
    countries: Country[];
    filteredCountriesSingle: Country[];
    country: Country;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private clientService: ClientService,
        private locationService: CountryService,
    ) {}

    ngOnInit() {

        this.getClient();
        this.locationService.loadCountries().subscribe(data => {
            this.countries = data;
        });
    }

    search(event) {
        let query = event.query;
        this.filteredCountriesSingle =this.filterCountry(query, this.countries);
    }

    filterCountry(query, countries: Country[]) : Country[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : Country[] = [];
        for(let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if(country.city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }

    getClient(): void {
        this.selectedClient = this.clientService.selectedClient;
        this.country=this.selectedClient.country;
    }

    save(): void {
        console.log("save(" + this.country+")");
        this.selectedClient.country=this.country;
        if(this.clientService.newClient) {
            this.clientService.addClient(this.selectedClient).subscribe(() => this.goBack());  
        } else  {
            this.clientService.updateClient(this.selectedClient).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.clientService.deleteClient(this.selectedClient)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
