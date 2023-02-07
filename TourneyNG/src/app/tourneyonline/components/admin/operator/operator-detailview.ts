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
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';

const DEFAULT_OPERATOR_PASSWORD: string = "torneionline";
const REDIRECT_TOURNEY_DV   = 'adminoperator/dv';

@Component({
    templateUrl: './operator-detailview.html' 
})
export class OperatorDetailView extends UserDetailView {
    public static redirect: string = REDIRECT_TOURNEY_DV;

    cols: TableCols[] = TeamService.cols;
    selectedTeams: Team[] = [];
    teams: Team[] = [];
    
    constructor(
        protected tourneyService: TourneyService,
        protected userService: UserService,
        protected loginService: LoginService,
        protected roleService: RoleService,
        protected location: Location,
        protected clientService: ClientService,
        public    urcService: UrcService,
        protected countryService: CountryService 
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
        this.teams = this.selectedTourney.teams;
        for(let t of this.teams) {
            for(let o of t.operators) {
                if(this.selectedUser.username == o ) {
                    this.selectedTeams.push(t);
                }
            }
        }
    }

    protected setPasswords() {
        if( this.userService.newUser ) {
            this.currentPassword = new String(DEFAULT_OPERATOR_PASSWORD).toString();
            this.retypedPassword = new String(DEFAULT_OPERATOR_PASSWORD).toString();
        } else {
            this.currentPassword = this.selectedUser.password;
            this.retypedPassword = this.selectedUser.password;
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
    protected onUpdateNext(cs: UserVO): void {
        console.log("Entering onUpdateNext()");
        this.updateOpList(cs.username);
        this.goBack();
    }

    // @Override
    protected onSaveComplete( urc : UserRoleClientVO ) {
        console.log("Entering onSaveComplete()");
        this.userService.newUser = false;
        this.tourneyService.operatorVo.selectedOperators.push(urc.userVo);
        this.tourneyService.operatorVo.allOperators.push(urc.userVo);
        this.updateOpList(urc.userVo.username);
        if( !this.onSaveUserError ) {
            this.goBack();
        }
    }
    
    private updateOpList(username : string) {
        for(let t of this.teams) {
            let index = this.selectedTeams.indexOf(t);
            if( index == -1) { // remove deselected operator
                let indexOp = t.operators.indexOf(username);
                if(indexOp!=-1) {
                    t.operators.splice(indexOp);
                }
            }
            let indexTeam = this.selectedTeams.indexOf(t);
            if(indexTeam != -1) {
                let index = t.operators.indexOf(username);
                if( index == -1 ){ // no duplicate
                    t.operators.push(username); 
                }
            }
        }
    }
}
