import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { RoleVO } from 'app/tourneyonline/domain/role-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Observable, of } from 'rxjs';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { UserRoleClientVO } from 'app/tourneyonline/domain/urc-vo';

@Component({
    templateUrl: './user-detailview.html' 
})
export class UserDetailView extends AbstractDetailView {

    selectedUser: UserVO;
    roleCols: TableCols[] = RoleService.roleCols;

    clientRoleCols:  TableCols[] = [
        { field: 'clientName', header: 'Cliente' },
        { field: 'role',   header: 'Ruolo' }
    ];

    roleOptions: Combobox[];

    clientRoleRows :     {id: number, businessName: string, selectedRole: Combobox}[];
    selectedClientRole : {id: number, businessName: string, selectedRole: Combobox}[];

    roles : RoleVO[];
    
    onSaveUserError: any;
    badRequest: boolean;
    userAlreadyExists: boolean;
    onLoadClientError: boolean;

    clients: ClientVO[];
    urcList: UserRoleClientVO[];
    userAddress: string;

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        protected clientService: ClientService,
        protected urcService: UrcService,
    ) {
        super(tourneyService, location, countryService);
    }

    ngOnInit() {

        this.countryService.loadCountries().subscribe(data => {
            this.countries = data;
        });

        if(this.userService.newUser) {
            this.userService.selectedUser = {
                id: null,
                firstname: '',
                lastname: '',
                address: '',
                email: '',
                phoneNumber: '',
                description: '',
                country    : {},
            }
        }  else {
            this.selectedUser = this.userService.selectedUser;

            // this.userAddress = this.selectedUser != undefined && this.selectedUser.country != undefined ? this.selectedUser.address  + " " +
            // this.selectedUser.country.zipCode + " " + this.selectedUser.country.city
            //     + " (" + this.selectedUser.country.provinceCode +")" : "";
        }

        this.selectedUser = this.userService.selectedUser;

        let loggedUserId = this.userService.selectedUser.id;
        this.roleService.loadLowerRoles(loggedUserId).subscribe(rs => this.roles = rs);

        const subscriber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subscriber.subscribe(cs => this.clients = cs, e => this.onError(e));

        let ucrsub = this.urcService.loadUrc(loggedUserId, this.loadClientsErrorHandler('loadUrc()'));
        ucrsub.subscribe(cs => this.urcList = cs, e => this.onError(e), () => this.onComplete());
    }
    
    private onComplete(): void {
        console.log("onComplete()");

        this.roleOptions = [];
        for(let i=0; i<this.roles.length; i++) {
            let r = this.roles[i];
            let cb = {label: r.name, value: i};
            this.roleOptions.push(cb);
        }

        this.clientRoleRows = [];

        for( let i=0; i< this.urcList.length;i++ ) {
            let urc = this.urcList[i];
            let rvo = urc.roleVo;
            let roleCB = {label: rvo.name, value: rvo.id};

            let cvo = urc.clientVo;

            let row = {id: urc.id, businessName: cvo.businessName, selectedRole: roleCB};

            this.clientRoleRows.push(row);
        }
    }

    private loadClientsErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onLoadClientError = true;

            console.log(`${operation} failed!`);

            console.error(error); // log to console instead     
      
            return of(result as T);
        };
    }
    
    enableSaveButton() : string {
        let un = this.selectedUser.username;
        let userEnable:   boolean = un.trim() == "";

        let fn = this.selectedUser.firstname;
        let ln = this.selectedUser.lastname;

        let upn = this.selectedUser.phoneNumber;
        let uem = this.selectedUser.email;
        let uad = this.selectedUser.address;
        userEnable = userEnable || fn.trim() == "" || ln.trim() == "" || upn.trim() == "" || uem.trim() == "" || uad.trim() == "";

        return userEnable ? "disabled" : "";
    }

    onSubmit(): void {
 
        let urcList : UserRoleClientVO[] = [];

        for( let row of this.selectedClientRole ) {

            let cvo = this.clients.find( c => c.businessName == row.businessName );
            let rvo = this.roles.find( r => r.id == row.selectedRole.value);

            let urc : UserRoleClientVO = {
                id        : row.id,
                userVo    : this.selectedUser,
                roleVo    : rvo,
                clientVo  : cvo
            };

            urcList.push(urc);
        }

        const subscriber = this.urcService.saveUrc(urcList, this.saveUserErrorHandler('Create User operation'));
        subscriber.subscribe(cs => super.next(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
    }
    
    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");

            this.onSaveUserError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

    private onSaveComplete() {
        console.log("Entering onSaveComplete()");
        this.userService.newUser = false;
        if( !this.onSaveUserError ) {
            this.goBack();
        }
    }

    private saveUserErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveUserErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveUserError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
 
            if( res.error.errorCode == "UserAlreadyExists" ) {
                this.userAlreadyExists = true;
                return of(result as T);
            }
            return of(result as T);
        };
    }
}
