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

    clientRoleRows: any[];
    roleOptions: Combobox[];

    roles : RoleVO[];
    
    selectedClients: ClientVO[];

    onSaveUserError: any;
    badRequest: boolean;
    userAlreadyExists: boolean;
    clients: ClientVO[];
    onLoadClientError: boolean;

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        protected clientService: ClientService,
    ) {
        super(tourneyService, location, countryService);
    }

    ngOnInit() {

        if(this.userService.newUser) {
            this.userService.selectedUser = {
                firstname: '',
                lastname: '',
                address: '',
                email: '',
                phoneNumber: '',
                description: '',
                country      : {},
                roles        : [],
                clientIdList : []
            }
        }
        this.selectedUser = this.userService.selectedUser;

        this.selectedClients = this.clients.filter( c => c.id in this.selectedUser.clientIdList );

        this.roleService.loadAllRoles().subscribe(rs => this.roles = rs);

        let loggedUserId = this.userService.selectedUser.id;
        const subscriber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subscriber.subscribe(cs => this.clients = cs, e => this.onError(e));

        let ucrsub = this.urcService.loadUrc(selectedUser, this.loadClientsErrorHandler('loadAllClients()'));
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

        for( let i=0; i< this.clients.length;i++ ) {
            let cvo = this.clients[i];
            let roleCB = {label: cvo.role.name, value: i};
            let row = {businessName: cvo.businessName, selectedRole: roleCB};
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
 
        let clientIds : number[] = [];
        for( let cvo of this.selectedClients ) {
            clientIds.push(cvo.id);
        }

        this.selectedUser.clientIdList = clientIds;

        const subscriber = this.userService.saveUser(this.selectedUser, this.saveUserErrorHandler('Create User operation'));
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
