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
import { UserVO } from 'app/tourneyonline/domain/user-vo';

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
        public    urcService: UrcService,
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

    // @Override
    ngOnInit() {
        super.ngOnInit();
        this.selectedTourney = this.tourneyService.selectedTourney;
    }

    protected setPasswords() {
        if( this.userService.newUser ) {
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
  
    // @Override
    protected createUserAndUrc(urc: UserRoleClientVO) {
        urc.tourneyId = this.selectedTourney.id;
        const subscriber = this.urcService.insertUrcOperator(urc, this.saveUserErrorHandler('Create Operator operation'));
        return subscriber;
    }
    
    // @Override
    protected createUrc(urc: UserRoleClientVO) {
        return this.createUserAndUrc(urc);
    }

    // @Override
    protected prepareUrcVO(existingUser: UserVO, rvo: RoleVO): UserRoleClientVO {
        return {
            id: null,
            userVo: existingUser,
            roleVo: rvo,
            clientVO: this.clientService.selectedClient,
            tourneyId: this.selectedTourney.id,
        };
    }

    // @Override
    protected onSaveComplete( urc : UserRoleClientVO ) {
        console.log("Entering onSaveComplete()");
        this.userService.newUser = false;
        this.tourneyService.operatorVo.selectedOperators.push(urc.userVo);
        this.tourneyService.operatorVo.allOperators.push(urc.userVo);
        if( !this.onSaveUserError ) {
            this.goBack();
        }
    }
}
