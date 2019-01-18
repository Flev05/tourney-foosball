import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Client } from 'app/tourneyonline/domain/client';
import { Country } from 'app/tourneyonline/domain/country';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

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
        private location: Location,
        private clientService: ClientService,
        private countryService: CountryService,
    ) {}

    ngOnInit() {

        this.getClient();
        this.countryService.loadCountries().subscribe(data => {
            this.countries = data;
        });
    }

    search(event) {
        let query = event.query;
        this.filteredCountriesSingle =this.filterCountry(query, this.countries);
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

    // delete() {
    //     this.clientService.deleteClient(this.selectedClient)
    //       .subscribe(() => this.goBack());
    // }

    goBack(): void {
        this.location.back();
    }
}
