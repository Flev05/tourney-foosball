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
    fullAddress: string;
    userFullAddress: string;
    onCreateClientError: boolean;
    onUpdateClientError: boolean;
    newClientFailed: boolean;
    isUserRegisteredRadio: boolean;
    isRetypePasswordFailed: boolean;
    
    returnedClientVo: ClientVO;
    currentPassword: string;
    retypedPassword: string;
    userRegisteredRadio: string;

    constructor(
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
              , isUserRegistered: false
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

        this.currentPassword = new String(this.selectedClient.cuvo.password).toString();
        this.retypedPassword = new String(this.selectedClient.cuvo.password).toString();
        
        this.userRegisteredRadio = this.selectedClient.isUserRegistered ? "yes" : "no";
    }

    onSubmit(value: string) {
        console.log("New currentPassword    =" + this.currentPassword);

        if( !this.selectedClient.isUserRegistered ) {
            if( this.currentPassword != this.selectedClient.cuvo.password ) {
                this.selectedClient.cuvo.password = Md5.init(this.currentPassword);

                this.isRetypePasswordFailed = false;
                console.log("Retyped password=" + this.retypedPassword);
                if( this.currentPassword != this.retypedPassword ) {
                    this.isRetypePasswordFailed = true;
                    return;
                }
            }
        } else {
            this.selectedClient.cuvo.password = Md5.init(this.currentPassword);
        }

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

    enableSaveButton() : string {
        let bn : String = this.selectedClient.businessName;
        let un : String = this.selectedClient.cuvo.username;
        let fn : String = this.selectedClient.cuvo.firstname;
        let ln : String = this.selectedClient.cuvo.lastname;

        return bn.trim() == "" || un.trim() == "" || fn.trim() == "" || ln.trim() == "" ? "disabled" : "";
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
