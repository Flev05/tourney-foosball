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
import { LoginService } from 'app/tourneyonline/service/login-service';
import { Md5 } from 'md5-typescript';

@Component({
    templateUrl: './urc-detailview.html' 
})
export class UrcDetailView extends AbstractDetailView {

    roleCols: TableCols[] = RoleService.roleCols;
    selectedUrc: UserRoleClientVO;
    selectedUser: UserVO;

    clientRoleCols:  TableCols[] = [
        { field: 'clientName', header: 'Cliente' },
        { field: 'role',   header: 'Ruolo' }
    ];

    roleOptions: Combobox[];

    clientRoleRows :     {id: number, businessName: string, selectedRole: Combobox}[];
    selectedClientRoleRows : {id: number, businessName: string, selectedRole: Combobox}[];

    roles : RoleVO[];
    
    onSaveUserError: any;
    badRequest: boolean;
    userAlreadyExists: boolean;
    onLoadClientError: boolean;

    clients: ClientVO[];

    currentPassword: string;
    retypedPassword: string;
    isRetypePasswordFailed: boolean;
    defaultRole: { label: string; value: number; };

    constructor(
        private logginService: LoginService,
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
        super.ngOnInit();

        let loggedUserId = this.logginService.userLogged.id;
        this.roleService.loadLowerRoles(loggedUserId).subscribe(rs => this.roles = rs, e => this.onError(e), () => this.onCompleteLoadRoles());

        const subscriber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subscriber.subscribe(cs => this.clients = cs, e => this.onError(e), () => this.onCompleteLoadClient());

        if(this.urcService.newUser) {
            this.selectedClientRoleRows = [];
            
            let uvo: UserVO = {
                id: null,
                username    : "",
                firstname   : "",
                lastname    : "",
                password    : "",
                address     : "",
                email       : "",
                phoneNumber : "",
                description : "",
                country     : {
                    city: "",
                    cityCode:"",
                    provinceCode:"",
                    zipCode:"",
                    countryCode:""
                },
            }

            this.urcService.selectedUrc = {userVo: uvo, roleVo: null, clientVo: null};
        }

        this.selectedUrc = this.urcService.selectedUrc;
        this.selectedUser = this.selectedUrc.userVo;

        this.currentPassword = new String(this.selectedUser.password).toString();
        this.retypedPassword = new String(this.selectedUser.password).toString();

        this.isRetypePasswordFailed = false;
        this.badRequest = false;
    }

    private onCompleteLoadRoles(): void {

        this.roleOptions = [];
        
        this.defaultRole = {label: "OWNER", value: 0};

        for( let rvo of this.roles ) {
            let row = {label: rvo.name, value: rvo.id};
            this.roleOptions.push(row);

            if(rvo.name == 'OWNER') {
                this.defaultRole = {label: rvo.name, value: rvo.id};
            }
        }
    }

    private onCompleteLoadClient(): void {
        this.clientRoleRows = [];

        this.selectedClientRoleRows = [];
        for( let cvo of this.clients ) {
            let selectedRow = {id: cvo.id, businessName: cvo.businessName, selectedRole: this.defaultRole};

            if( !this.urcService.newUser ) {
                let foundUrc = this.urcService.urcList.find( urc => urc.clientVo.id == cvo.id && urc.userVo.id == this.selectedUser.id);
                if( foundUrc != undefined ) {
                    let cb : Combobox = {label: foundUrc.roleVo.name, value: foundUrc.roleVo.id};
                    selectedRow = {id: foundUrc.id, businessName: cvo.businessName, selectedRole: cb};
                    this.selectedClientRoleRows.push(selectedRow);
                }
            }
            this.clientRoleRows.push(selectedRow);
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
        if(this.selectedUrc.userVo == undefined ) {
            return;
        }

        let un = this.selectedUrc.userVo.username;
        let userEnable:   boolean = un.trim() == "";

        let fn = this.selectedUrc.userVo.firstname;
        let ln = this.selectedUrc.userVo.lastname;

        let upn = this.selectedUrc.userVo.phoneNumber;
        let uem = this.selectedUrc.userVo.email;
        let uad = this.selectedUrc.userVo.address;
        userEnable = userEnable || fn.trim() == "" || ln.trim() == "" || upn.trim() == "" || uem.trim() == "" || uad.trim() == "";

        userEnable = userEnable || this.selectedClientRoleRows.length == 0;

        return userEnable ? "disabled" : "";
    }

    onSubmit(): void {
 
        if( this.currentPassword != this.selectedUser.password ) {
            if(this.currentPassword != this.retypedPassword ) {
                this.isRetypePasswordFailed = true;
                return;
            }
            let md5 = Md5.init(this.currentPassword)
            console.log("MD5(password)=" + md5);
            this.selectedUrc.userVo.password = md5;
        }

        console.log("MD5(password)=" + this.selectedUrc.userVo.password);

        let urcList : UserRoleClientVO[] = [];

        for( let row of this.selectedClientRoleRows ) {

            let cvo = this.clients.find( c => c.businessName == row.businessName );
            let rvo = this.roles.find( r => r.id == row.selectedRole.value);

            let urc : UserRoleClientVO = {
                id        : null,
                userVo    : this.selectedUrc.userVo,
                roleVo    : rvo,
                clientVo  : cvo
            };

            urcList.push(urc);
        }

        for(let urc of urcList) {
            this.onSaveUserError = false;
            const subscriber = this.urcService.saveUrc(urc, this.saveUserErrorHandler('Create User operation'));
            subscriber.subscribe(cs => super.next(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
        }
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
