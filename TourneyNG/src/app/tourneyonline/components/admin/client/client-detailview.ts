import { Component } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';
import { Country } from 'app/tourneyonline/domain/country';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
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

    isUserRegisteredRadio: boolean;
    isRetypePasswordFailed: boolean;
    
    returnedClientVo: ClientVO;
    currentPassword: string;
    retypedPassword: string;
    userRegisteredRadio: string;
    
    onCreateClientError: boolean;
    onUpdateClientError: boolean;
    clientAlreadyExists: boolean;
    badRequest: boolean;
    userNotRegistered: boolean;
    userAlreadyExists: boolean;
    userRegisteredRadioEnabled: boolean;

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

        this.userRegisteredRadio = "no";

        if(this.clientService.newClient) {
            this.userRegisteredRadioEnabled = true;
            this.selectedClient={
                businessName: ""
              , phoneNumber: ""
              , email: ""
              , siteUrl: ""
              , userAlreadyRegistered: false
              , country: {}
              , cuvo : {
                    username   : "",
                    password    : "",
                    firstname   : "",
                    lastname    : "",
                    address     : "",
                    email       : "",
                    phoneNumber : "",
                }
            };
        } else {
            this.userRegisteredRadioEnabled = false;
        }
        
        this.currentPassword = new String(this.selectedClient.cuvo.password).toString();
        this.retypedPassword = new String(this.selectedClient.cuvo.password).toString();
    }

    onSubmit(value: string) {
        console.log("New currentPassword    =" + this.currentPassword);

        this.selectedClient.userAlreadyRegistered = this.userRegisteredRadio == "yes" ? true : false;

        if( !this.selectedClient.userAlreadyRegistered ) {
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

        this.clearErrors();

        if(this.clientService.newClient) {
            this.clientService.newClient = false;
            const subscriber = this.clientService.saveClient(this.selectedClient, this.saveClientErrorHandler('Create client operation'));
            subscriber.subscribe(cs => this.returnedClientVo = cs, e => this.subscribeErrorHandler(e), () => this.onInsertComplete());
        } else  {
            const subscriber = this.clientService.saveClient(this.selectedClient, this.saveClientErrorHandler('Update client operation'));
            subscriber.subscribe(cs => this.returnedClientVo = cs, e => this.subscribeErrorHandler(e), () => this.onUpdateComplete());
        }
    }

    private clearErrors() {
        this.onCreateClientError = false;
        this.onUpdateClientError = false;
        this.clientAlreadyExists = false;
        this.badRequest          = false;
        this.userNotRegistered   = false;
        this.userAlreadyExists   = false;
    }

    enableSaveButton() : string {
        let bn = this.selectedClient.businessName;
        let pn = this.selectedClient.phoneNumber;
        let ad = this.selectedClient.address;
        let em = this.selectedClient.email;

        let un = this.selectedClient.cuvo.username;
        let fn = this.selectedClient.cuvo.firstname;
        let ln = this.selectedClient.cuvo.lastname;

        let upn = this.selectedClient.cuvo.phoneNumber;
        let uem = this.selectedClient.cuvo.email;
        let uad = this.selectedClient.cuvo.address;

        let clientEnable: boolean = bn.trim() == "" || pn.trim() == "" || ad.trim() == "" || em.trim() == "" ;
        let userEnable:   boolean = un.trim() == "" || fn.trim() == "" || ln.trim() == "" || upn.trim() == "" || uem.trim() == "" || uad.trim() == "";

        return clientEnable || userEnable ? "disabled" : "";
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
        console.log("Entering onInsertComplete()");
        if( !this.onCreateClientError ) {
            super.goBack();
        }
    }

    private onUpdateComplete() {
        console.log("Entering onUpdateComplete()");
        if( !this.onUpdateClientError ) {
            super.goBack();
        }
    }

    private saveClientErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveClientErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead

      
            this.onCreateClientError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            if( res.error.errorCode == "ClientAlreadyExists" ) {
                this.clientAlreadyExists = true;
                return of(result as T);
            }
            if( res.error.errorCode == "UserAlreadyExists" ) {
                this.userAlreadyExists = true;
                return of(result as T);
            }
            if( res.error.errorCode == "UserNotRegistered" ) {
                this.userNotRegistered = true;
                return of(result as T);
            }
      
            return of(result as T);
        };
    }

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
      
            this.onUpdateClientError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

}
