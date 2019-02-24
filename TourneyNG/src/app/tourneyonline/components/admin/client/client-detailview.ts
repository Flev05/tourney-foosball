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
import { RoleService } from 'app/tourneyonline/service/role-service';

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
    
    onSaveClientError: boolean;
    clientAlreadyExists: boolean;
    badRequest: boolean;
    userEnabled: boolean;

    clientAddress: string;
    userAddress: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        private   clientService: ClientService,
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("ClientDetailView.ngOnInit() ");
        super.ngOnInit();
        
        this.countryService.loadCountries().subscribe(data => {
            this.countries = data;
        });

        this.userRegisteredRadio = "no";

        this.clientAddress = "";
        this.userAddress = "";

        if(this.clientService.newClient) {
            this.selectedClient={
                businessName: ""
              , phoneNumber: ""
              , email: ""
              , siteUrl: ""
              , userAlreadyRegistered: false
              , country: {}
            //   , userVo : [{
            //          username    : ""
            //         ,password    : ""
            //         ,firstname   : ""
            //         ,lastname    : ""
            //         ,address     : ""
            //         ,email       : ""
            //         ,phoneNumber : ""
            //         ,country: {}
            //         ,roles: [{
            //             id: null,
            //             name: "",
            //             description: ""
            //         }]
            //     }]
            };
        } else {
            this.selectedClient = this.clientService.selectedClient;
            if( this.selectedClient != undefined ) {
                if( this.selectedClient.country != undefined ) {
                    this.clientAddress = this.selectedClient.address  + " " +
                    this.selectedClient.country.zipCode + " " + this.selectedClient.country.city
                        + " (" + this.selectedClient.country.provinceCode +")";
                }
        
                // if( this.selectedClient.userVo != undefined && this.selectedClient.userVo.country != undefined ) {
                //     this.userAddress = this.selectedClient.userVo.address  + " " +
                //     this.selectedClient.userVo.country.zipCode + " " + this.selectedClient.userVo.country.city
                //         + " (" + this.selectedClient.userVo.country.provinceCode +")";
                // }
            }
        }
        
        // this.currentPassword = new String(this.selectedClient.userVo.password).toString();
        // this.retypedPassword = new String(this.selectedClient.userVo.password).toString();

        this.userEnabled = true;
    }

    // private isUserEnabled(): boolean {
    //     return this.roleService.isOwner();
    // }

    onSubmit(value: string) {
        console.log("New currentPassword    =" + this.currentPassword);

        this.selectedClient.userAlreadyRegistered = this.userRegisteredRadio == "yes" ? true : false;

        // if( !this.selectedClient.userAlreadyRegistered ) {
        //     if( this.currentPassword != this.selectedClient.userVo.password ) {
        //         this.selectedClient.userVo.password = Md5.init(this.currentPassword);

        //         this.isRetypePasswordFailed = false;
        //         console.log("Retyped password=" + this.retypedPassword);
        //         if( this.currentPassword != this.retypedPassword ) {
        //             this.isRetypePasswordFailed = true;
        //             return;
        //         }
        //     }
        // } else {
        //     this.selectedClient.userVo.password = Md5.init(this.currentPassword);
        // }

        this.clearErrors();

        const subscriber = this.clientService.saveClient(this.selectedClient, this.saveClientErrorHandler('Create client operation'));
        subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());

        this.clientService.newClient = false;
    }

    private clearErrors() {

        this.onSaveClientError = false;
        this.clientAlreadyExists = false;
        this.badRequest          = false;
    }

    enableSaveButton() : string {
        // if( !this.isUserEnabled() ) {
        //     return "disabled";
        // }

        let bn = this.selectedClient.businessName;
        let pn = this.selectedClient.phoneNumber;
        let ad = this.selectedClient.address;
        let em = this.selectedClient.email;
        let clientEnable: boolean = bn.trim() == "" || pn.trim() == "" || ad.trim() == "" || em.trim() == "" ;

        // let un = this.selectedClient.userVo.username;
        // let userEnable:   boolean = un.trim() == "";

        // if( !this.selectedClient.userAlreadyRegistered ) {
        //     let fn = this.selectedClient.userVo.firstname;
        //     let ln = this.selectedClient.userVo.lastname;

        //     let upn = this.selectedClient.userVo.phoneNumber;
        //     let uem = this.selectedClient.userVo.email;
        //     let uad = this.selectedClient.userVo.address;
        //     userEnable = userEnable || fn.trim() == "" || ln.trim() == "" || upn.trim() == "" || uem.trim() == "" || uad.trim() == "";
        // }

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

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");

            this.onSaveClientError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }
}
