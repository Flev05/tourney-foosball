import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'app/tourneyonline/service/user-service';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { ERoles } from 'app/tourneyonline/domain/enumerations';
import { RoleVO } from 'app/tourneyonline/domain/role-vo';
import { UserDetailView } from '../userng/user-detailview';
import { UserRoleClientVO } from 'app/tourneyonline/domain/urc-vo';
import { Observable } from 'rxjs';

const DEFAULT_OPERATOR_PASSWORD: string = "torneionline";

@Component({
    templateUrl: './operator-detailview.html' 
})
export class OperatorDetailView extends UserDetailView {
    operatorRole: RoleVO;

    constructor(
        protected tourneyService: TourneyService,
        protected userService: UserService,
        protected loginService: LoginService,
        protected roleService: RoleService,
        protected location: Location,
        protected clientService: ClientService,
        protected urcService: UrcService,
        protected countryService: CountryService,
    ) {
        super( userService,
             location,
             tourneyService,
             countryService,
             urcService,
             roleService,
             loginService,
             clientService
            );
    }

    ngOnInit() {
        super.ngOnInit();
    }

    protected setPasswords() {
        if( this.urcService.newUser ) {
            this.currentPassword = new String(DEFAULT_OPERATOR_PASSWORD).toString();
            this.retypedPassword = new String(DEFAULT_OPERATOR_PASSWORD).toString();
        }
    }

    protected selectRoleForNewUser(): RoleVO {
        return this.selectDefaultRole();
    }

    protected selectDefaultRole(): RoleVO {
        let rvo: RoleVO = this.roleService.selectedRoles.find(r => { var asEnum: ERoles = <ERoles>ERoles[r.name]; return asEnum == ERoles.OPERATOR; });
        return rvo;
    }

    protected createUserAndUrc(urc: UserRoleClientVO): Observable<UserRoleClientVO> {
        const subscriber = this.userService.createOperator(urc, this.selectedTourney.id, this.saveUserErrorHandler('Create Operator operation'));
        return subscriber;
    }
}
