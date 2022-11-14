import { Component } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';
import { Country } from 'app/tourneyonline/domain/country';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { LoginService } from 'app/tourneyonline/service/login-service';

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
  
    filteredCountriesSingle: Country[];

    isUserRegisteredRadio: boolean;
    
    returnedClientVo: ClientVO;
    
    onSaveClientError: boolean;
    clientAlreadyExists: boolean;
    badRequest: boolean;
    userEnabled: boolean;

    clientAddress: string;

    loggedUsername: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        private   clientService: ClientService,
        private   loginService: LoginService,
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("ClientDetailView.ngOnInit() ");
        super.ngOnInit();
        
        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());

        this.clientAddress = "";
        this.loggedUsername = this.loginService.userLogged.username;

        if(this.clientService.newClient) {
            this.selectedClient={
                businessName: ""
              , phoneNumber: ""
              , email: ""
              , siteUrl: ""
              , country: {}
            };
        } else {
            this.selectedClient = this.clientService.selectedClient;
            
            this.clientAddress = this.selectedClient != undefined && this.selectedClient.country != undefined ?
                this.selectedClient.address  + " - " +
                this.selectedClient.country.zipCode + " " + this.selectedClient.country.city
                + " (" + this.selectedClient.country.provinceCode +")" : "";
        }
        this.userEnabled = true;
    }

    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
    }

    onSubmit() {

        this.clearErrors();

        const subscriber = this.clientService.saveClient(this.selectedClient, this.saveClientErrorHandler('Create client operation'));
        subscriber.subscribe(cs => this.newClientNext(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());

        this.clientService.newClient = false;
    }
    
    private newClientNext(tvo:ClientVO) {
        console.log("newClientNext()");
        console.log(tvo);
        this.selectedClient.id = tvo.id;
    }

    private clearErrors() {

        this.onSaveClientError = false;
        this.clientAlreadyExists = false;
        this.badRequest          = false;
    }

    enableSaveButton() : string {
        let bn = this.selectedClient.businessName;
        let pn = this.selectedClient.phoneNumber;
        let ad = this.selectedClient.address;
        let em = this.selectedClient.email;
        let clientEnable: boolean = bn.trim() == "" || pn.trim() == "" || ad.trim() == "" || em.trim() == "" ;

        return clientEnable ? "disabled" : "";
    }

    onRegisteredYes() {
        console.log("Entering onRegisteredYes()");
        this.isUserRegisteredRadio = true;
    }

    onRegisteredNo() {
        console.log("Entering onRegisteredNo()");
        this.isUserRegisteredRadio = false;
    }

    private onSaveComplete() {
        console.log("Entering onSaveComplete()");
        if( !this.onSaveClientError ) {
            super.goBack();
        }
    }

    private saveClientErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveClientErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveClientError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            if( res.error.errorCode == "ClientAlreadyExists" ) {
                this.clientAlreadyExists = true;
                return of(result as T);
            }
      
            return of(result as T);
        };
    }

    protected subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onSaveClientError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}
