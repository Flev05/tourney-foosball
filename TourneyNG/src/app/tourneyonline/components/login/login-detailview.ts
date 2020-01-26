import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators,FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { Login } from 'app/tourneyonline/domain/login';
import { Message } from 'app/components/common/api';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { Md5 } from "md5-typescript";
import { Observable, of } from 'rxjs';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';

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
export class LoginDetailView implements OnInit {
    public static redirectToAdminTourney = '/admintourney';
    public static redirectToShowTourney  = '/showtourney';
    
    formLogin: Login;

    msgs: Message[] = [];

    loginformGroup: FormGroup;

    loginFailed: boolean;
    loggedUsername: string;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService,
        private clientService: ClientService,
    ) {}

    ngOnInit() {
        this.loginService.blockedDocument = false;
        this.formLogin = {"id": 1, "username": "", "password" : ""};

        this.loggedUsername = this.loginService.userLogged==undefined ? '' : this.loginService.userLogged.username;

        this.loginformGroup = this.fb.group({
            'username': new FormControl(this.loggedUsername, Validators.required),
            'password': new FormControl("", Validators.required),
        });
    }

    onSubmit(value: string) {

        this.formLogin.username = this.loginformGroup.get('username').value;

        let md5 = Md5.init(this.loginformGroup.get('password').value);
        this.formLogin.password = md5.toUpperCase();
        console.log("MD5(password)=" + this.formLogin.password);
        
        this.loginService.isUserLogged = true;
        this.loginFailed = false;

        const subscr = this.loginService.sendLogin(this.formLogin, this.handleLoginError<Login>('sendLogin'));
        subscr.subscribe(uvo=> this.onNext(uvo), e => this.onError(e) );  
    }

    private onNext(lvo: Login) {
        console.log("Entering LoginDetailView.onNext()"); // log to console instead
        console.log(lvo);

        if( lvo != undefined ) {
            this.loginService.setUserLogged(lvo);
        } else {
            this.loginService.isUserLogged = false;
            this.loginFailed = true;
        }
        this.onComplete();
    }

    private onComplete() {
        console.log("Entering LoginDetailView.onComplete()" );
        
        if(!this.loginService.isUserLogged)  {
            this.loginFailed = true;
            return;
        }

        let cvo: ClientVO = {
            id                     : null,
            businessName           : ""
        };

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

        console.log("navigate to=" + redirect);
        this.router.navigate([redirect]);
    }

    private onError(e:any) {
        console.error("Entering LoginDetailView.onError()");
        console.error(e);
        this.loginService.isUserLogged = false;
        this.loginFailed = true;
    }

    private handleLoginError<Login> (operation: string, result?: Login) {
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
