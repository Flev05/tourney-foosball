import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {  Params, ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { LoginDetailView } from './login-detailview';
import { FormBuilder } from '@angular/forms';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Login } from 'app/tourneyonline/domain/login';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';

const redirect : string = "/result/lv";
const DEFAULT_PASSWORD = "4A97D80A588D25719C729A43B51AA9FC"; // torneionline
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
        private activatedRoute: ActivatedRoute,
        protected tourneyService: TourneyService,
        protected location: Location
    ) {
        super(fb,router,loginService,clientService,location);
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
        console.log( this.routeParams );

        this.formLogin = {username: this.routeParams.first, password: DEFAULT_PASSWORD};

        const subscr = this.loginService.sendLogin(this.formLogin, this.handleLoginError<Login>('sendLogin'));
        subscr.subscribe(uvo=> this.onNext(uvo), e => this.onError(e) );  

        this.loginService.blockedDocument = false;
    }

    protected onComplete() {
        console.log("Entering FollowerDetailView.onComplete()" );
        this.tourneyService.loadTourneyByUsername(this.formLogin.username, () => this.gotoDetailView(), e => this.serverUnreachableHandler(e));    
    }
}
