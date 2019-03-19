import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { Login } from 'app/tourneyonline/domain/login';
import { Message } from 'app/components/common/api';
import { LoginService } from 'app/tourneyonline/service/login-service';
import {Md5} from "md5-typescript";
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

    formLogin: Login;

    msgs: Message[] = [];

    loginformGroup: FormGroup;

    loginFailed: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService,
        private clientService: ClientService,
    ) {}

    ngOnInit() {
        this.formLogin = {"id": 1, "username": "", "password" : ""};

        const username = this.loginService.userLogged==undefined ? '' : this.loginService.userLogged.username;

        this.loginformGroup = this.fb.group({
            'username': new FormControl(username, Validators.required),
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
        subscr.subscribe(uvo=> this.next(uvo), e => this.onError(e), () => this.onComplete());  
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
    
    next(uvo: Login) {
        console.log("Entering next()"); // log to console instead
        console.log(uvo);

        if( uvo != undefined ) {
            this.loginService.setUserLogged(uvo);
        } else {
            this.loginService.isUserLogged = false;
            this.loginFailed = true;
        }
    }

    onError(e:any) {
        console.error("Entering LoginDetailView.onError()");
        console.error(e);
        this.loginService.isUserLogged = false;
        this.loginFailed = true;
    }

    onComplete() {
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

        console.log("navigate to=" + redirect);
        this.router.navigate([redirect]);
    }
}
