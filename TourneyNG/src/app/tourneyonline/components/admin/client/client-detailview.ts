import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Client } from 'app/tourneyonline/domain/client';
import { Country } from 'app/tourneyonline/domain/country';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';

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
export class ClientDetailView extends AbstractDetailView {

    selectedClient: Client;
  
    countries: Country[];
    filteredCountriesSingle: Country[];
    country: Country;
    clientFormGroup: FormGroup;
    fullAddress: string;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        private   clientService: ClientService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("ClientDetailView.ngOnInit() ");

        super.ngOnInit();
        this.getClient();
        this.countryService.loadCountries().subscribe(data => {
            this.countries = data;
        });

        if(this.clientService.newClient) {
            this.selectedClient={
                firstname: ""
              , lastname: ""
              , businessName: ""
              , phoneNumber: ""
              , email: ""
              , country: this.countries[0]
            };
        }
        
        if(this.selectedClient.country!=undefined) {
            this.fullAddress = this.selectedClient.address + " - " 
                + this.selectedClient.country.zipCode + " " + this.selectedClient.country.city
                + " (" + this.selectedClient.country.provinceCode +")";
        }

        this.clientFormGroup = this.fb.group({
            'firstname': new FormControl(this.selectedClient.firstname, Validators.compose([Validators.required])),
            'lastname': new FormControl(this.selectedClient.lastname, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedClient.address),
            'country': new FormControl(this.selectedClient.country),
            'phoneNumber': new FormControl(this.selectedClient.phoneNumber),
            'email': new FormControl(this.selectedClient.email),
        });
    }

    onSubmit(value: string) {

        this.selectedClient.firstname = this.clientFormGroup.get('firstname').value;
        this.selectedClient.lastname = this.clientFormGroup.get('lastname').value;
        this.selectedClient.address = this.clientFormGroup.get('address').value;
        this.selectedClient.country = this.clientFormGroup.get('country').value;

        this.selectedClient.phoneNumber = this.clientFormGroup.get('phoneNumber').value;
        this.selectedClient.email = this.clientFormGroup.get('email').value;
        
        this.selectedClient.country=this.country;
        if(this.clientService.newClient) {
            this.clientService.newClient = false;
            this.clientService.addClient(this.selectedClient).subscribe(() => this.goBack());  
        } else  {
            this.clientService.updateClient(this.selectedClient).subscribe(() => this.goBack());
        }
    }

    getClient(): void {
        this.selectedClient = this.clientService.selectedClient;
        this.country=this.selectedClient.country;
    } 
}
