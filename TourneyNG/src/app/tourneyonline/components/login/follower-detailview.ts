import { Component, OnInit } from '@angular/core';
import {  Params, ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { LoginDetailView } from './login-detailview';
import { FormBuilder } from '@angular/forms';
import { ClientService } from 'app/tourneyonline/service/client-service';

const redirect : string = "/login/lv";
@Component({
    template: ""
})
export class FollowerDetailView extends LoginDetailView {
    
    routeParams: Params;

    constructor(
        protected fb: FormBuilder,
        protected router: Router,
        protected loginService: LoginService,
        protected clientService: ClientService,
        private activatedRoute: ActivatedRoute
    ) {
        super(fb,router,loginService,clientService);
        this.getRouteParams();
    }

    // Store parameter values on URL changes
    private getRouteParams() {

        // Route parameters
        this.activatedRoute.params.subscribe( params => {
            this.routeParams = params;
        });
    }

    ngOnInit() {
        console.log("RouteParams:");
        console.log( this.routeParams);

        this.loginService.blockedDocument = false;
    }
}
