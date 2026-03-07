import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Validators,FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { Message } from 'primeng/api';
import { Login } from '../../domain/login';
import { LoginService } from '../../service/login-service';
import { Md5 } from "md5-typescript";
import { Observable, of } from 'rxjs';
import { ClientService } from '../../service/client-service';
import { ClientVO } from '../../domain/client-vo';
import { AbstractListView } from '../common/abstract-listview';
import { TourneyService } from '../../service/tourney-service';

const redirect : string = "/login/lv";
@Component({
    templateUrl: './login-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
        .ui-g-4 {
            width: 25mm;
        }
  `]
})
export class LoginDetailView extends AbstractListView {
    public static redirectToAdminTourney = '/admintourney';
    public static redirectToShowTourney  = '/showtourney';
    
    formLogin: Login = new Login();

    msgs: Message[] = [];

    loginformGroup: FormGroup;

    loginFailed: boolean = false;
    loggedUsername: string = "";

    constructor(
        protected fb: FormBuilder,
        protected override router: Router,
        protected loginService: LoginService,
        protected override tourneyService: TourneyService,
        protected clientService: ClientService,
        protected override location: Location
    ) {
        super(redirect 
            ,   tourneyService 
            ,   router 
            ,   location);
            
            this.loginformGroup = this.fb.group({
                'username': new FormControl(this.loggedUsername, Validators.required),
                'password': new FormControl("", Validators.required),
            });
    }

    override ngOnInit() {
        this.loginService.blockedDocument = false;
        this.formLogin.id = 1;

        this.loggedUsername = this.loginService.userLogged==undefined ? '' : this.loginService.userLogged.username;

        this.loginformGroup = this.fb.group({
            'username': new FormControl(this.loggedUsername, Validators.required),
            'password': new FormControl("", Validators.required),
        });
    }

    onSubmit(value: string) {
        if( this.loginformGroup == null ) return;
  
        const lgf = this.loginformGroup.get('username');
        if( lgf == null ) return;
        this.formLogin.username = lgf.value;

        const pgf = this.loginformGroup.get('password');
        if( pgf == null ) return;
        let md5 = Md5.init(pgf.value);

        this.formLogin.password = md5.toUpperCase();
        console.log("MD5(password)=" + this.formLogin.password);
        
        this.loginService.isUserLogged = true;
        this.loginFailed = false;

        const subscr = this.loginService.sendLogin(this.formLogin, this.handleLoginError<Login>('sendLogin'));
        subscr.subscribe(uvo=> this.onNext(uvo), e => this.onError(e) );  
    }

    protected onNext(lvo: Login) {
        console.log("Entering LoginDetailView.onNext()"); // log to console instead
        console.log(lvo);

        if( lvo != undefined ) {
            this.loginService.setUserLogged(lvo);
            this.loginFailed = false;
        } else {
            this.loginService.isUserLogged = false;
            this.loginFailed = true;
        }
        this.onComplete();
    }

    protected onComplete() {
        console.log("Entering LoginDetailView.onComplete()" );
        
        if(!this.loginService.isUserLogged)  {
            this.loginFailed = true;
            return;
        }

        let cvo = new ClientVO();
        
        cvo.id=null;
        cvo.businessName="";

        this.clientService.selectedClient = cvo;

        let loggedUserId = this.loginService.userLogged.id;

        const subsrciber = this.clientService.loadAllClients(loggedUserId, this.handleLoginError('loadAllClients()'));
        subsrciber.subscribe(clients => this.processClientNext(clients), e => this.onError(e));
    }

    private processClientNext(clients: ClientVO[]): void {
        if( clients.length == 1 ) {
            this.clientService.setSelectClients(clients);
            if( this.loginService.isAtLeastAdmin() ) {
                this.router.navigate([LoginDetailView.redirectToAdminTourney]);
            } else {
                this.router.navigate([LoginDetailView.redirectToShowTourney]);
            }
            return;
        }

        this.gotoDetailView();
    }

    protected override gotoDetailView(): void {
        console.log("navigate to=" + redirect);
        this.router.navigate([redirect]);
    }
    public override onError(e:any) {
        console.error("Entering LoginDetailView.onError()");
        console.error(e);
        this.loginService.isUserLogged = false;
        this.loginFailed = true;
    }

    protected handleLoginError<Login> (operation: string, result?: Login) {
        return (error: any): Observable<Login> => {                      
            console.error("Entering Observable<Login>"); // log to console instead

            this.loginService.isUserLogged=false;
            this.loginFailed = true;

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
      
            // TODO: better job of transforming error for user consumption
            console.error(`${operation} failed: ${error.message}`);
      
            // Let the app keep running by returning an empty result.
            return of(result as Login);
        };
    }
}
