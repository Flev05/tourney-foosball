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

@Component({
    templateUrl: './urc-detailview.html' 
})
export class UrcDetailView extends AbstractUrcDetailView {
 
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
            , userService
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
    }
}
