import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'app/tourneyonline/service/user-service';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { AbstractUrcDetailView } from '../../common/abstract-urc-detailview';
import { ERoles } from 'app/tourneyonline/domain/enumerations';
import { RoleVO } from 'app/tourneyonline/domain/role-vo';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

const DEFAULT_OPERATOR_PASSWORD: string = "torneionline";

@Component({
    templateUrl: './operator-detailview.html' 
})
export class OperatorDetailView extends AbstractUrcDetailView {
    operatorRole: RoleVO;

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
        super(tourneyService
            ,userService
            ,logginService
            ,roleService
            ,location
            ,clientService
            ,urcService
            ,countryService
            );
    }

    ngOnInit() {
        super.ngOnInit();
        if( this.urcService.newUser ) {
            this.currentPassword = DEFAULT_OPERATOR_PASSWORD;
            this.retypedPassword = DEFAULT_OPERATOR_PASSWORD;
        }
    }

    protected loadClients(loggedUserId: number) {
        this.clients = [];
        this.clients.push(this.clientService.selectedClient);
    }

    protected onRoleLoadNext(rs: RoleVO[]): void {
        super.onRoleLoadNext(rs);

        

        this.operatorRole = this.roles.find( r => {var asEnum : ERoles= <ERoles>ERoles[r.name]; return asEnum == ERoles.OPERATOR} );

        this.selectedUrc.roleVo = this.operatorRole;
        this.selectedUrc.clientVO = this.clientService.selectedClient;
        this.selectedUrc.tourneyId = this.selectedTourney.id;
        this.selectedUrc.disciplineId = this.selectedTourney.discipline.id;

        let cb : Combobox = {label: this.operatorRole.name, value: this.operatorRole.id};
        let selectedRow = {id: this.selectedUrc.clientVO.id, businessName: this.selectedUrc.clientVO.businessName, selectedRole: cb};
        this.selectedClientRoleRows.push(selectedRow);
    }
}
