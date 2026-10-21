import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {  Params, ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { LoginDetailView } from './login-detailview';
import { FormBuilder } from '@angular/forms';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Login } from 'app/tourneyonline/domain/login';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';

const REDIRECT_RESULT_LV : string = "/result/lv";
const DEFAULT_PASSWORD = "4A97D80A588D25719C729A43B51AA9FC"; // torneionline
@Component({
    template: "",
    standalone: false
})
export class FollowerDetailView extends LoginDetailView {
    
    routeParams: Params = {};
 
    constructor(
        protected override fb: FormBuilder
        , protected override router: Router
        , protected override loginService: LoginService
        , protected override clientService: ClientService
        , private activatedRoute: ActivatedRoute
        , protected override tourneyService: TourneyService
        , protected override location: Location
        , protected teamService : TeamService
    ) {
        super(fb,router,loginService,tourneyService,clientService,location);
        console.log( "constructor of FollowerDetailView()");
    }

    // Store parameter values on URL changes
    private getRouteParams() {
        // Route parameters
        this.activatedRoute.params.subscribe( params => {
            this.routeParams = params;
        });
    }

    override ngOnInit() {
        console.log( "Entering FollowerDetailView.ngOnInit()");
        this.getRouteParams();
        console.log( "RouteParams: " + this.routeParams );
        let firstName = this.activatedRoute.snapshot.paramMap.get('first');
        console.log("firstName=" + firstName);
        if( firstName ) {
            this.formLogin.username = firstName;
            this.formLogin.password = DEFAULT_PASSWORD;
            const subscr = this.loginService.sendLogin(this.formLogin, this.handleLoginError<Login>('sendLogin'));
            subscr.subscribe(uvo=> this.onNext(uvo), e => this.onError(e) );  
        }   
    }

    protected override onComplete() {
        super.onComplete();
        console.log("Entering FollowerDetailView.onComplete()" );
        this.tourneyService.loadTourneyByUsername(this.formLogin.username, () => this.gotoDetailView(), e => this.serverUnreachableHandler(e));    
    }

    protected override gotoDetailView(): void {
        this.router.navigate([REDIRECT_RESULT_LV]);
    }
}
