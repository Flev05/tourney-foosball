import { Component } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';
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

    selectedClient: ClientVO;
  
    countries: Country[];
    filteredCountriesSingle: Country[];
    clientFormGroup: FormGroup;
    fullAddress: string;
    userFullAddress: string;
    onCreateClientError: boolean;
    onUpdateClientError: boolean;
    isLoginFailed: boolean;
    isUserRegisteredRadio: boolean;
    isRetypePasswordFailed: boolean;

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
              , country: {}
              , cuvo : {}
            };
        }
        
        if(this.selectedClient.country!=undefined) {
            this.fullAddress = this.selectedClient.address + " - " 
                + this.selectedClient.country.zipCode + " " + this.selectedClient.country.city
                + " (" + this.selectedClient.country.provinceCode +")";
        }

        if(this.selectedClient.cuvo != undefined && this.selectedClient.cuvo.country!=undefined) {
            this.userFullAddress = this.selectedClient.cuvo.address + " - " 
                + this.selectedClient.cuvo.country.zipCode + " " + this.selectedClient.cuvo.country.city
                + " (" + this.selectedClient.cuvo.country.provinceCode +")";
        }

        let password =  new FormControl(this.selectedClient.cuvo.password, Validators.compose([Validators.required]));

        this.clientFormGroup = this.fb.group({

            'businessName': new FormControl(this.selectedClient.businessName, Validators.compose([Validators.required])),
            'phoneNumber': new FormControl(this.selectedClient.phoneNumber, Validators.compose([Validators.required])),
            'email'  : new FormControl(this.selectedClient.email, Validators.compose([Validators.required])),           
            'address': new FormControl(this.selectedClient.address, Validators.compose([Validators.required])),
            'country': new FormControl(this.selectedClient.country),
            'siteUrl': new FormControl(this.selectedClient.siteUrl),

            'isUserRegistered' : new FormControl("no"),
            'username': new FormControl(this.selectedClient.cuvo.username, Validators.compose([Validators.required])),
            'password': password,
            'retypePassword': password,
            'userPhoneNumber': new FormControl(this.selectedClient.cuvo.phoneNumber, Validators.compose([Validators.required])),
            'userEmail'  : new FormControl(this.selectedClient.cuvo.email, Validators.compose([Validators.required])),
            'userAddress': new FormControl(this.selectedClient.cuvo.address, Validators.compose([Validators.required])),
            'userCountry': new FormControl(this.selectedClient.cuvo.country),
        });
    }

    onSubmit(value: string) {
        this.selectedClient.address = this.clientFormGroup.get('address').value;
        this.selectedClient.phoneNumber = this.clientFormGroup.get('phoneNumber').value;
        this.selectedClient.email = this.clientFormGroup.get('email').value;        
        this.selectedClient.country = this.clientFormGroup.get('country').value;
        this.selectedClient.siteUrl = this.clientFormGroup.get('siteUrl').value;
        this.selectedClient.businessName = this.clientFormGroup.get('businessName').value;

        this.selectedClient.cuvo.username = this.clientFormGroup.get('username').value;
        this.selectedClient.cuvo.password = this.clientFormGroup.get('password').value;

        let isUserRegistered = this.clientFormGroup.get('isUserRegistered').value;        
        isUserRegistered == "yes" ? this.selectedClient.isUserRegistered = true : false;

        if( !this.selectedClient.isUserRegistered) {
            this.isRetypePasswordFailed = true;
            let retypePassword = this.clientFormGroup.get('retypePassword').value;
            if( this.selectedClient.cuvo.password != retypePassword ) {
                this.isRetypePasswordFailed = true;
                return;
            }
        }

        this.selectedClient.cuvo.address = this.clientFormGroup.get('userAddress').value;
        this.selectedClient.cuvo.country = this.clientFormGroup.get('userCountry').value;
        this.selectedClient.cuvo.email = this.clientFormGroup.get('userEmail').value;
        this.selectedClient.cuvo.phoneNumber = this.clientFormGroup.get('userPhoneNumber').value;

        if(this.clientService.newClient) {
            this.clientService.newClient = false;
            this.onCreateClientError = false;
        } else  {
            this.onUpdateClientError = false;
        }
        this.isLoginFailed = false;
        this.clientService.saveClient(this.selectedClient, this.updateErrorHandler('updateClient()')).subscribe(() => this.goBack());
    }
    
    onRegisteredYes() {
        console.log("Entering onRegisteredYes()");
        this.isUserRegisteredRadio = true;
    }

    onRegisteredNo() {
        console.log("Entering onRegisteredNo()");
        this.isUserRegisteredRadio = false;
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
            this.isLoginFailed = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

}
