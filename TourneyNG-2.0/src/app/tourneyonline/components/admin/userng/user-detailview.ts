import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { Md5 } from 'md5-typescript';
import { Observable, of } from 'rxjs';
;
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { UserRoleClientVO } from 'app/tourneyonline/domain/urc-vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { ERoles } from 'app/tourneyonline/domain/enumerations';
import { RoleVO } from 'app/tourneyonline/domain/role-vo';
import { LoginService } from 'app/tourneyonline/service/login-service';

@Component({
    templateUrl: './user-detailview.html',
    standalone: false
})
export class UserDetailView extends AbstractDetailView {
    selectedUser: UserVO = new UserVO();
    selectedUrc: UserRoleClientVO = new UserRoleClientVO(); 
    onSaveUserError: any;
    userAlreadyExists: boolean = false;

    userAddress: string = "";
    currentPassword: string = "";
    retypedPassword: string = "";
    isRetypePasswordFailed: boolean = false;
    roles: RoleVO[] = [];
    oldUsername: string = "";
    loggedUsername: string = "";

    constructor(
        protected userService: UserService,
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected countryService: CountryService,
        protected urcService: UrcService,
        protected roleService: RoleService,
        protected loginService: LoginService,
        protected clientService: ClientService
    ) {
        super(tourneyService, location);
    }

    override ngOnInit() {
        this.countryService.loadAllCountries( () => this.onLoadAllCountriesComplete() );
        if( this.userService.newUser ) {
            this.userService.selectedUser = new UserVO();            
        } else {
            this.oldUsername = this.userService.selectedUser.username
        }

        this.selectedUser = this.userService.selectedUser;
        let loggedUserId = this.loginService.userLogged.id;
        this.loggedUsername = this.loginService.userLogged.username;
        this.roleService.loadLowerRoles(loggedUserId, (rs) => this.onRoleLoadNext(rs));

        this.setPasswords();

        this.isRetypePasswordFailed = false;
    }
        
    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
    }

    protected setPasswords() {
        this.currentPassword = new String(this.selectedUser.password).toString();
        this.retypedPassword = new String(this.selectedUser.password).toString();
    }

    private onRoleLoadNext( rs: RoleVO[] ): void {
        this.roles = rs;
    }
    
    enableSaveButton() : string {
        let un = this.selectedUser.username;
        let userEnable:   boolean = un?.trim() == "";

        let fn = this.selectedUser.firstname == undefined ? "" : this.selectedUser.firstname;
        let ln = this.selectedUser.lastname == undefined ? "" : this.selectedUser.lastname;

        let upn = this.selectedUser.phoneNumber == undefined ? "" : this.selectedUser.phoneNumber;
        let uem = this.selectedUser.email == undefined ? "" : this.selectedUser.email ;
        let uad = this.selectedUser.address == undefined ? "" : this.selectedUser.address;
        userEnable = userEnable || fn.trim() == "" || ln.trim() == "" || upn.trim() == "" || uem.trim() == "" || uad.trim() == "";

        return userEnable ? "disabled" : "";
    }

    onSubmit(): void {
        if( this.userService.newUser ) {
            const subscriber = this.userService.getUserByUsername(this.selectedUser.username);
            subscriber.subscribe(cs => this.onVerifyForCreateNext(cs), e => this.onError(e) );
            return;
        }

        if( this.oldUsername != this.selectedUser.username ) {
            const subscriber = this.userService.getUserByUsername(this.selectedUser.username);
            subscriber.subscribe(cs => this.onVerifyForUpdateNext(cs), e => this.onError(e) );
        } else {
            this.updateUser();
        }
    }

    private createNewUser() {
        let rvo : RoleVO = this.selectRoleForNewUser();

        this.selectedUser.password = Md5.init(this.selectedUser.username);
        console.log("MD5(password)=" + this.selectedUser.password);

        let urc : UserRoleClientVO = new UserRoleClientVO();
        urc.roleVo = rvo;
        urc.clientVO = this.clientService.selectedClient;
        urc.userVo = this.selectedUser;

        const subscriber = this.createUserAndUrc(urc);
        subscriber.subscribe(cs => this.onSaveComplete(cs), e => this.subscribeErrorHandler(e));
    }

    protected createUserAndUrc(urc: UserRoleClientVO): Observable<UserRoleClientVO>  {
        const subscriber = this.userService.createUserAndUrc(urc, this.saveUserErrorHandler('Create User operation'));
        return subscriber;
    }

    protected selectRoleForNewUser(): RoleVO   {
        let rvo;
        if (this.roleService.isDeveloper()) {
            rvo = this.roleService.selectedRoles.find(r => { var asEnum: ERoles = <ERoles>ERoles[r.name as keyof typeof ERoles]; return asEnum == ERoles.DEVELOPER; });
        }
        else {
            rvo = this.roleService.selectedRoles.find(r => { var asEnum: ERoles = <ERoles>ERoles[r.name as keyof typeof ERoles]; return asEnum == ERoles.OWNER; });
        }
        if( rvo == undefined ) {
            rvo = new RoleVO();
        }
        return rvo;
    }

    private createOnlyUrc(existingUser: UserVO) {
        let rvo: RoleVO  = this.selectDefaultRole();

        let urc : UserRoleClientVO = this.prepareUrcVO(existingUser, rvo);

        const subscriber = this.createUrc(urc);
        subscriber.subscribe(cs => this.onSaveComplete(cs), e => this.subscribeErrorHandler(e) );
    }

    protected createUrc(urc: UserRoleClientVO) {
        return this.urcService.createUrc(urc, this.saveUserErrorHandler('Create User operation'));
    }

    protected prepareUrcVO(existingUser: UserVO, rvo: RoleVO): UserRoleClientVO {
        let urc = new UserRoleClientVO();
        urc.userVo = existingUser;
        urc.roleVo = rvo;
        urc.clientVO = this.clientService.selectedClient;
        return urc;
    }

    protected selectDefaultRole(): RoleVO  {
        let rvo = this.roleService.selectedRoles.find(r => { var asEnum: ERoles = <ERoles>ERoles[r.name as keyof typeof ERoles]; return asEnum == ERoles.OWNER; });
        if (this.roleService.isOwner()) {
            rvo = this.roleService.selectedRoles.find(r => { var asEnum: ERoles = <ERoles>ERoles[r.name as keyof typeof ERoles]; return asEnum == ERoles.ADMIN; });
        }
        if (this.roleService.isAdmin()) {
            rvo = this.roleService.selectedRoles.find(r => { var asEnum: ERoles = <ERoles>ERoles[r.name as keyof typeof ERoles]; return asEnum == ERoles.OPERATOR; });
        }
        if( rvo == undefined ) {
            rvo = new RoleVO();
        }
        return rvo;
    }

    protected onVerifyForCreateNext(existingUser: UserVO): void {
        if( existingUser == null ) {
            this.createNewUser();
            return;
        }

        let msg = "L'utente con username [" + this.selectedUser.username + "] che si sta creando, esiste già con le seguenti credenziali.";
        msg += "\nNome:     " + this.selectedUser.firstname
        msg += "\nCognome:  " + this.selectedUser.lastname
        msg += "\nEmail:    " + this.selectedUser.email
        msg += "\nTelefono: " + this.selectedUser.phoneNumber
        msg += "\nSe si tratta della stessa persona, rispondere OK e sarà usato l'utente preesistente."
        msg += "\nAltrimenti premere Annulla, cambiare la username e salvare il nuovo utente."

        if(confirm(msg)) {
            this.createOnlyUrc(existingUser);
        }
    }
    
    private onVerifyForUpdateNext(existingUser: UserVO): void {
        if( existingUser == null ) {
            this.updateUser();
            return;
        }

        let msg = "L'utente con username [" + this.selectedUser.username + "] che si sta modificando, esiste già con le seguenti credenziali.";
        msg += "\nNome:     " + this.selectedUser.firstname
        msg += "\nCognome:  " + this.selectedUser.lastname
        msg += "\nEmail:    " + this.selectedUser.email
        msg += "\nTelefono: " + this.selectedUser.phoneNumber
        msg += "\nSe si tratta della stessa persona, rispondere OK, usare un'altra username e salvare l'utente."
        msg += "\nAltrimenti premere Annulla e rimuovere l'utente con il bottone X dalla vista elenco."

        if(!confirm(msg)) {
            this.goBack();
        }
    }

    private updateUser() {
        if(this.currentPassword != this.selectedUser.password) {
            this.selectedUser.password = Md5.init(this.currentPassword);
            console.log("MD5(password)=" + this.selectedUser.password);
        }
        const subscriber = this.userService.updateUser(this.selectedUser, this.saveUserErrorHandler('Create User operation'));
        subscriber.subscribe(cs => this.onUpdateNext(cs), e => this.subscribeErrorHandler(e) );
    }

    protected onUpdateNext(cs: UserVO): void {
        this.goBack();
    }

    protected override subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onSaveUserError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    protected onSaveComplete( urc : UserRoleClientVO ) {
        console.log("Entering onSaveComplete()");
        this.selectedUrc = urc;
        this.userService.newUser = false;
        if( !this.onSaveUserError ) {
            this.goBack();
        }
    }

    protected saveUserErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveUserErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveUserError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.serverUnreachable = true;
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
