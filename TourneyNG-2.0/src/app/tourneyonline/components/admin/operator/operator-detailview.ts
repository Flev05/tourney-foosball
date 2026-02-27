import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../../service/user-service';
import { RoleService } from '../../../service/role-service';
import { TourneyService } from '../../../service/tourney-service';
import { CountryService } from '../../../service/country-service';
import { ClientService } from '../../../service/client-service';
import { UrcService } from '../../../service/urc-service';
import { LoginService } from '../../../service/login-service';
import { ERoles } from '../../../domain/enumerations';
import { RoleVO } from '../../../domain/role-vo';
import { UserDetailView } from '../userng/user-detailview';
import { UserRoleClientVO } from '../../../domain/urc-vo';
import { UserVO } from '../../../domain/user-vo';
import { TableCols } from '../../../domain/table-cols';
import { TeamService } from '../../../service/team-service';
import { Team } from '../../../domain/team';

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
        protected override tourneyService: TourneyService,
        protected override userService: UserService,
        protected override loginService: LoginService,
        protected override roleService: RoleService,
        protected override location: Location,
        protected override clientService: ClientService,
        public override    urcService: UrcService,
        protected override countryService: CountryService 
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
    override ngOnInit() {
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

    protected override setPasswords() {
        if( this.userService.newUser ) {
            this.currentPassword = new String(DEFAULT_OPERATOR_PASSWORD).toString();
            this.retypedPassword = new String(DEFAULT_OPERATOR_PASSWORD).toString();
        } else {
            this.currentPassword = this.selectedUser.password;
            this.retypedPassword = this.selectedUser.password;
        }
    }

    protected override selectRoleForNewUser(): RoleVO {
        return this.selectDefaultRole();
    }

    protected override selectDefaultRole(): RoleVO {
        let rvo = this.roleService.selectedRoles.find(r => { 
            var asEnum: ERoles = <ERoles>ERoles[r.name as keyof typeof ERoles]; 
            return asEnum == ERoles.OPERATOR; 
        });
        if( rvo == undefined ) {
            rvo = new RoleVO();
        }        
        return rvo;
    }
  
    // @Override
    protected override createUserAndUrc(urc: UserRoleClientVO) {
        urc.tourneyId = this.selectedTourney.id;
        const subscriber = this.urcService.insertUrcOperator(urc, this.saveUserErrorHandler('Create Operator operation'));
        return subscriber;
    }
    
    // @Override
    protected override createUrc(urc: UserRoleClientVO) {
        return this.createUserAndUrc(urc);
    }

    // @Override
    protected override prepareUrcVO(existingUser: UserVO, rvo: RoleVO): UserRoleClientVO {
        let urc = new UserRoleClientVO();
        urc.userVo = existingUser;
        urc.roleVo = rvo;
        urc.clientVO = this.clientService.selectedClient;
        urc.tourneyId = this.selectedTourney.id;
        return urc;
    }

    // @Override
    protected override onUpdateNext(cs: UserVO): void {
        console.log("Entering onUpdateNext()");
        this.updateOpList(cs.username);
        this.goBack();
    }

    // @Override
    protected override onSaveComplete( urc : UserRoleClientVO ) {
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
            if( index == -1 && t.operators != undefined ) { // remove deselected operator
                let indexOp = t.operators.indexOf(username);
                if(indexOp!=-1) {
                    t.operators.splice(indexOp);
                }
            }
            let indexTeam = this.selectedTeams.indexOf(t);
            if(indexTeam != -1 ) {
                if(t.operators == undefined) {
                    t.operators = [];
                    t.operators.push(username); 
                    continue;
                }
                let index = t.operators.indexOf(username);
                if( index == -1 ){ // no duplicate
                    t.operators.push(username); 
                }
            }
        }
    }
}
