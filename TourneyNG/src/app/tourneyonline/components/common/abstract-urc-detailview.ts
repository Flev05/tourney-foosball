import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Md5 } from 'md5-typescript';

import { UserService } from 'app/tourneyonline/service/user-service';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { UserRoleClientVO } from 'app/tourneyonline/domain/urc-vo';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { RoleVO } from 'app/tourneyonline/domain/role-vo';
import { AbstractDetailView } from './abstract-detailview';
 
export abstract class AbstractUrcDetailView extends AbstractDetailView {

    roleCols: TableCols[] = RoleService.roleCols;
    selectedUrc: UserRoleClientVO;
    selectedUser: UserVO;
    display: boolean = false;

    clientRoleCols:  TableCols[] = [
        { field: 'clientName', header: 'Cliente' },
        { field: 'role',       header: 'Ruolo' }
    ];

    roleOptions: Combobox[];

    clientRoleRows         : {id: number, businessName: string, selectedRole: Combobox}[];
    selectedClientRoleRows : {id: number, businessName: string, selectedRole: Combobox}[];

    roles : RoleVO[];
    
    onSaveUserError: any;
    badRequest: boolean;
    userAlreadyExists: boolean = false;
    onLoadClientError: boolean;

    clients: ClientVO[];

    currentPassword: string;
    retypedPassword: string;
    isRetypePasswordFailed: boolean;
    defaultRole: { label: string; value: number; };

    username: string = "";

    constructor(
        protected tourneyService: TourneyService,
        protected userService: UserService,
        protected logginService: LoginService,
        protected roleService: RoleService,
        protected location: Location,
        protected clientService: ClientService,
        protected urcService: UrcService,
        protected countryService: CountryService,
    ) {
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.countries = this.countryService.countries;

        let loggedUserId = this.logginService.userLogged.id;
        this.username = this.logginService.userLogged.username;

        this.roleService.loadLowerRoles(loggedUserId, rs => this.onRoleLoadNext(rs));

        this.loadClients(loggedUserId);

        this.selectedClientRoleRows = [];

        if(this.urcService.newUser) {
            
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

            this.urcService.selectedUrc = {userVo: uvo, roleVo: null, clientVO: null};
        }

        this.selectedUrc = this.urcService.selectedUrc;
        this.selectedUser = this.selectedUrc.userVo;

        this.currentPassword = new String(this.selectedUser.password).toString();
        this.retypedPassword = new String(this.selectedUser.password).toString();

        this.isRetypePasswordFailed = false;
        this.badRequest = false;
    }
   
    protected onRoleLoadNext(rs: RoleVO[]): void {
        this.roles = rs;
    }

    protected loadClients(loggedUserId: number) {
        const subscriber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subscriber.subscribe(cs => this.clients = cs, e => this.onError(e), () => this.onCompleteLoadClient());
    }

    protected onCompleteLoadRoles(): void {

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
                let foundUrc = this.urcService.urcList.find( urc => urc.clientVO.id == cvo.id && urc.userVo.id == this.selectedUser.id);
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
            return "disabled";
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
 
        if( this.urcService.newUser ) {
            const subscriber = this.userService.getUserByUsername(this.selectedUser.username);
            subscriber.subscribe(cs => this.onComplete(cs), e => this.onError(e) );
            return;
        }

        this.saveUser(true);
    }
    
    private saveUser(checkPassword: boolean) {
        if( checkPassword && this.currentPassword != this.selectedUser.password ) {
            if(this.currentPassword != this.retypedPassword ) {
                this.isRetypePasswordFailed = true;
                return;
            }
            let md5 = Md5.init(this.currentPassword)
            console.log("MD5(password)=" + md5);
            this.selectedUrc.userVo.password = md5;
            console.log("MD5(password)=" + this.selectedUrc.userVo.password);
        }

        let urcList : UserRoleClientVO[] = [];

        for( let row of this.selectedClientRoleRows ) {

            let cvo = this.clients.find( c => c.businessName == row.businessName );
            let rvo = this.roles.find( r => r.id == row.selectedRole.value);

            let urc : UserRoleClientVO = {
                id           : this.urcService.newUser ? null : this.selectedUrc.id,
                userVo       : this.selectedUrc.userVo,
                roleVo       : rvo,
                clientVO     : cvo,
                tourneyId    : this.selectedTourney.id,
                disciplineId : this.selectedTourney.discipline.id
            };

            urcList.push(urc);
        }

        for(let urc of urcList) {
            this.onSaveUserError = false;
            const subscriber = this.urcService.saveUrc(urc, this.saveUserErrorHandler('Create User operation'));
            subscriber.subscribe(cs => super.next(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
        }
    }

    private onComplete(existingUser: UserVO): void {
        if( existingUser == null ) {
            this.saveUser(true);
            return;
        }

        let msg = "L'utente con username [" + this.selectedUser.username + "] che si sta creando, esiste già con le seguenti credenziali.";
        msg += "\nNome:     " + this.selectedUser.firstname
        msg += "\nCognome:  " + this.selectedUser.lastname
        msg += "\nEmail:    " + this.selectedUser.email
        msg += "\nTelefono: " + this.selectedUser.phoneNumber
        msg += "\nSe si tratta della stessa persona, rispondere OK e sarà usato l'utente preesistente."
        msg += "\nAltrimenti premere Annulla, cambiare la username e sarà salvato il nuovo utente."

        if(confirm(msg)) {
            this.selectedUrc.userVo = existingUser;
            this.saveUser(false);
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
