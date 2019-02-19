import { Component } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
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
    clientFormGroup: FormGroup;
    fullAddress: string;
    onCreateClientError: boolean;
    onUpdateClientError: boolean;

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

        this.selectedClient = this.clientService.selectedClient;

        this.countryService.loadCountries().subscribe(data => {
            this.countries = data;
        });

        if(this.clientService.newClient) {
            this.selectedClient={
                businessName: ""
              , phoneNumber: ""
              , email: ""
            };
        }
        
        if(this.selectedClient.country!=undefined) {
            this.fullAddress = this.selectedClient.address + " - " 
                + this.selectedClient.country.zipCode + " " + this.selectedClient.country.city
                + " (" + this.selectedClient.country.provinceCode +")";
        }

        this.clientFormGroup = this.fb.group({
            'businessName': new FormControl(this.selectedClient.businessName, Validators.compose([Validators.required])),
            'username': new FormControl(this.selectedClient.username, Validators.compose([Validators.required])),
            'phoneNumber': new FormControl(this.selectedClient.phoneNumber, Validators.compose([Validators.required])),
            'email'  : new FormControl(this.selectedClient.email, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedClient.address),
            'country': new FormControl(this.selectedClient.country),
            'siteUrl': new FormControl(this.selectedClient.siteUrl),
        });
    }

    onSubmit(value: string) {
        this.selectedClient.businessName = this.clientFormGroup.get('businessName').value;

        this.selectedClient.username = this.clientFormGroup.get('username').value;

        this.selectedClient.address = this.clientFormGroup.get('address').value;
        this.selectedClient.phoneNumber = this.clientFormGroup.get('phoneNumber').value;
        this.selectedClient.email = this.clientFormGroup.get('email').value;        
        this.selectedClient.country = this.clientFormGroup.get('country').value;
        this.selectedClient.siteUrl = this.clientFormGroup.get('siteUrl').value;

        if(this.clientService.newClient) {
            this.clientService.newClient = false;
            this.onCreateClientError = false;
        } else  {
            this.onUpdateClientError = false;
        }
        this.clientService.saveClient(this.selectedClient, this.updateErrorHandler('updateClient()')).subscribe(() => this.goBack());
    }

    private createErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onCreateClientError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

    private updateErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onUpdateClientError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

}
