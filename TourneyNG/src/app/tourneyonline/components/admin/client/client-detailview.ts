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
import { Md5 } from 'md5-typescript';

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
    newClientFailed: boolean;
    isUserRegisteredRadio: boolean;
    isRetypePasswordFailed: boolean;
    
    returnedClientVo: ClientVO;

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

        let newPassword = this.clientFormGroup.get('password').value;
        console.log("New password    =" + newPassword);

        if( !this.selectedClient.isUserRegistered ) {
            if( newPassword != this.selectedClient.cuvo.password ) {
                this.selectedClient.cuvo.password = Md5.init(newPassword);

                let isUserRegistered = this.clientFormGroup.get('isUserRegistered').value;        
                isUserRegistered == "yes" ? this.selectedClient.isUserRegistered = true : false;

                this.isRetypePasswordFailed = false;
                let retypePassword = this.clientFormGroup.get('retypePassword').value;
                console.log("Retyped password=" + retypePassword);
                if( newPassword != retypePassword ) {
                    this.isRetypePasswordFailed = true;
                    return;
                }
            }
        } else {
            this.selectedClient.cuvo.password = Md5.init(newPassword);
        }

        this.selectedClient.cuvo.address = this.clientFormGroup.get('userAddress').value;
        this.selectedClient.cuvo.country = this.clientFormGroup.get('userCountry').value;
        this.selectedClient.cuvo.email = this.clientFormGroup.get('userEmail').value;
        this.selectedClient.cuvo.phoneNumber = this.clientFormGroup.get('userPhoneNumber').value;

        if(this.clientService.newClient) {
            this.clientService.newClient = false;
            this.onCreateClientError = false;
            const subscriber = this.clientService.saveClient(this.selectedClient, this.createErrorHandler('Create client operation'));
            subscriber.subscribe(cs => this.returnedClientVo = cs, e => this.createErrorHandler(e), () => this.onInsertComplete());
        } else  {
            this.onUpdateClientError = false;
            const subscriber = this.clientService.saveClient(this.selectedClient, this.updateErrorHandler('Update client operation'));
            subscriber.subscribe(cs => this.returnedClientVo = cs, e => this.updateErrorHandler(e), () => this.onUpdateComplete());
        }
        this.newClientFailed = false;
    }

    onRegisteredYes() {
        console.log("Entering onRegisteredYes()");
        this.isUserRegisteredRadio = true;
    }

    onRegisteredNo() {
        console.log("Entering onRegisteredNo()");
        this.isUserRegisteredRadio = false;
    }

    private onInsertComplete() {
        if( !this.onCreateClientError ) {
            super.goBack();
        }
    }

    private onUpdateComplete() {
        if( !this.onUpdateClientError ) {
            super.goBack();
        }
    }

    private createErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering createErrorHandler()");
      
            this.onCreateClientError = true;
            this.newClientFailed = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

    private updateErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering updateErrorHandler()");
      
            this.onUpdateClientError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

}
