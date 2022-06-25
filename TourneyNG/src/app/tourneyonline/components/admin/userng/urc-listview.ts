import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { UserRoleClientVO } from 'app/tourneyonline/domain/urc-vo';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { RoleVO } from 'app/tourneyonline/domain/role-vo';
import { UserRoleClientRow } from 'app/tourneyonline/domain/urc-row-vo';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';

const redirect = '/users/urcdv';

@Component({
    templateUrl: './urc-listview.html'
})
export class UrcListView extends AbstractListView {

    urcList: UserRoleClientVO[];

    onLoadUrcError: boolean;
    onDeleteError: boolean;
    loggedUsername: string = "";
    
    urcRowList: UserRoleClientRow[] = [];

    roles:  RoleVO[];

    userOptions: Combobox[];
    roleOptions: Combobox[];
    clientOptions: Combobox[];
    
    therIsOnlyOneDeveloper: boolean;

    constructor(protected tourneyService: TourneyService
        , public urcService: UrcService
        , private roleService: RoleService
        , protected loginService: LoginService
        , public router: Router
        , protected location: Location
        , protected countryService: CountryService
        , private clientService: ClientService) 
    {        
        super(redirect, tourneyService, router, location);
        console.log("UrcListView.constructor()");
    }

    ngOnInit() {
        console.log("UrcListView.ngOnInit()");
        this.therIsOnlyOneDeveloper = false;

        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());

        this.urcService.newUser = false;

        this.onLoadUrcError = false;

        let loggedUserId = this.loginService.userLogged.id;
        this.loggedUsername = this.loginService.userLogged.username;

        this.roleService.loadLowerRoles(loggedUserId, (rs) => this.rolesCallback(rs));
    }

    private rolesCallback( rs: RoleVO[] ): void {
        this.roles = rs;
        
        let loggedUserId = this.loginService.userLogged.id;
        let ucrsub = this.urcService.loadUrc(loggedUserId, this.loadClientsErrorHandler('loadUrc()'));
        ucrsub.subscribe(cs => this.onLoadNext(cs), e => this.onError(e) );
    }

    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
    }

    private onLoadNext( cs: UserRoleClientVO[] ): void {
        console.log("onLoadNext()");
        this.urcList = cs;
        this.urcService.urcList = cs; 

        this.userOptions   = this.prepareUserOptions();
        this.roleOptions   = this.prepareRoleOptions();
        this.clientOptions = this.prepareClientOptions();

        this.urcRowList = [];
        for( let urc of this.urcList ) {
            if( urc.userVo.username == this.loggedUsername ) {
               console.log("Skip myself [" + this.loggedUsername + "]") 
               continue;
            }
            let userSelect: Combobox = {label: urc.userVo.username, value: urc.userVo.id};
            let roleSelect: Combobox = {label: urc.roleVo.name, value: urc.roleVo.id};
            let clientSelect: Combobox = {label: urc.clientVO.businessName, value: urc.clientVO.id} ;

            let urcRow : UserRoleClientRow = {
                  id: urc.id
                , userOptions: this.userOptions
                , userSelect: userSelect
                , roleOptions: this.roleOptions
                , roleSelect: roleSelect
                , clientOptions: this.clientOptions
                , clientSelect: clientSelect
            };
            this.urcRowList.push(urcRow);       
         }

         this.urcRowList = this.urcRowList.sort( (u1,u2) =>  {
            if( u1.userSelect.label < u2.userSelect.label ) {
                return -1;
            }
            if( u1.userSelect.label > u2.userSelect.label ) {
                return 1;
            }
            if( u1.roleSelect.label < u2.roleSelect.label ) {
                return -1;
            }
            if( u1.roleSelect.label > u2.roleSelect.label ) {
                return 1;
            }
            if( u1.clientSelect.label < u2.clientSelect.label ) {
                return -1;
            }
            if( u1.clientSelect.label > u2.clientSelect.label ) {
                return 1;
            }
           
             return 0;
         })
    }

    private loadClientsErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.onLoadUrcError = true;
            console.log(`${operation} failed!`);
            console.error(error); // log to console instead     
            return of(result as T);
        };
    }

    newAssociation() {
        this.urcService.newUser = true;

        let userSelect: Combobox = {label: "", value: null};
        let roleSelect: Combobox = {label: "", value: null};
        let clientSelect: Combobox = {label: "", value: null} ;

        let urcRow : UserRoleClientRow = {
              id: null
            , userOptions: this.userOptions
            , userSelect: userSelect
            , roleOptions: this.roleOptions
            , roleSelect: roleSelect
            , clientOptions: this.clientOptions
            , clientSelect: clientSelect
        };

        let urcl: UserRoleClientRow[] = [];
        urcl.push(urcRow);

        this.urcRowList = urcl.concat(this.urcRowList);
    }

    private prepareUserOptions(): Combobox[] {
        let options : Combobox[] = [];
        for( let urc of this.urcList ) {
            let found = options.find( cb => cb.label == urc.userVo.username );
            if( !found ) {
                let cb: Combobox = {label: urc.userVo.username, value: urc.userVo.id} ;
                options.push(cb);
            }
        }
        return options;
    }

    private prepareRoleOptions(): Combobox[] {
        let options : Combobox[] = this.roleService.getNoFollowerRoleOptions();
        return options;
    }
    
    private prepareClientOptions(): Combobox[] {
        let options : Combobox[] = this.clientService.clientOptions;
        // for( let c of this.clientService.clientOptions ) {
        //     let found = options.find( cb => cb.label == c.businessName );
        //     if( !found ) {
        //         let cb: Combobox = {label: urc.clientVO.businessName, value: urc.clientVO.id} ;
        //         options.push(cb);
        //     }
        // }
        return options;
    }
    
    onSubmit(): void {
        for(let row of this.urcRowList ) {
            if( this.urcService.newUser && (row.userSelect.value == null
                || row.roleSelect.value == null 
                || row.clientSelect.value == null) ) 
            {
                continue;
            }
            console.log("Relation [" + row.userSelect.label + " - " + row.roleSelect.label + " - " + row.clientSelect.label + "]");

            let found: UserRoleClientVO = this.urcList.find( 
                urc => urc.userVo.username == row.userSelect.label
                && urc.roleVo.name == row.roleSelect.label
                && (urc.clientVO != undefined && urc.clientVO.businessName == row.clientSelect.label));
            if( found ) {
                console.error("Already exists. Do not save!");
                continue;
            }

            let urcUserVo: UserRoleClientVO = this.urcList.find( urc => urc.userVo.username == row.userSelect.label);
            let roleVo: RoleVO = this.roleService.getRoleVO(row.roleSelect.label);
            let cvo: ClientVO = this.clientService.selectedClients.find( c => c.businessName == row.clientSelect.label );

            let urc : UserRoleClientVO = {
                  id: row.id
                , userVo: urcUserVo.userVo
                , roleVo: roleVo
                , clientVO: cvo
            }

            const subscriber = this.urcService.saveUrc(urc, this.saveUserErrorHandler('Create User operation'));
            subscriber.subscribe(cs => this.onSubmitNext(cs)  );
        }

        this.ngOnInit();
    }
    
    private onSubmitNext(cs: UserRoleClientVO): void {
        this.urcService.newUser = false;
    }

    private saveUserErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveUserErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                return of(result as T);
            } 
            return of(result as T);
        };
    }

    doDelete(row: UserRoleClientRow) {
        console.log(row);

        if( this.urcService.newUser ) {
            this.urcRowList.splice(0, 1);
            this.urcService.newUser = false;
            return;
        }

        this.therIsOnlyOneDeveloper = false;
        if( this.roleService.isUserDeveloper(row.roleSelect.label) ) {
            let devs: UserVO[] = this.urcList.filter( urc =>  this.roleService.isUserDeveloper(urc.roleVo.name) );
            if( devs.length <= 1 ) {
                this.therIsOnlyOneDeveloper = true;
                return;
            }
        }

        let urcId = row.id;
        this.urcService.selectedUrc = this.urcList.find( urc => urc.id == urcId );
       
        let name =  row.userSelect.label + " - " + row.roleSelect.label + " - " + row.clientSelect.label;
        let popup = 'Sicuro di voler rimuovere la relazione Utente-Ruolo-Cliente: [' + name + "]?";

        this.onDeleteError = false;
        if(confirm(popup)) {
            const subscr = this.urcService.deleteUrc(row.id, this.deleteErrorHandler('deleteUser()'));
            subscr.subscribe(n => this.onDeleteComplete(row.id), e => this.onError(e));
        }
    }
    
    private onDeleteComplete(id: number): void {
        console.log("onDeleteComplete()");
        let found: UserRoleClientRow = this.urcRowList.find( r => r.id == id);
        
        if( found ) {
            let index = this.urcRowList.indexOf(found);
            if(index > -1 ) {
                this.urcRowList.splice(index, 1);
            }
        }
    }

    private deleteErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.onDeleteError = true;
            console.log(`${operation} failed!`);
            console.error(error); // log to console instead
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    
    onError(e:any) {
        console.log("onError()");
        console.log(e);
        this.onLoadUrcError = true;
    }
 }
