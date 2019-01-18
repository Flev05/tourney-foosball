import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { Login } from 'app/tourneyonline/domain/login';
import { Message } from 'app/components/common/api';
import { LoginService } from 'app/tourneyonline/service/login-service';
import {Md5} from "md5-typescript";
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { Observable, of } from 'rxjs';

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

    submitted: boolean;
    isLoginFailed: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService,
        private userService: UserService,
    ) {}

    ngOnInit() {
        this.isLoginFailed = false;
        this.formLogin = {"id": 1, "username": "", "password" : ""};

        const username = this.loginService.selectedLogin==undefined ? '' : this.loginService.selectedLogin.username;

        this.loginformGroup = this.fb.group({
            'username': new FormControl(username, Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
        });
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.formLogin.username = this.loginformGroup.get('username').value;

        let md5 = Md5.init(this.loginformGroup.get('password').value)
        this.formLogin.password = md5;
        console.log("MD5(password)=" + md5);

        this.isLoginFailed = false;
        this.loginService.userLogged=true;

        const subscr = this.loginService.sendLogin(this.formLogin, this.handleLoginError<Login>('sendLogin'));
        
        subscr.subscribe(uvo=> this.next(uvo), e => this.onError(e), () => this.onComplete());  
    }

    private handleLoginError<Login> (operation: string, result?: Login) {
        console.error("Entering handleLoginError()"); // log to console instead
  
        return (error: any): Observable<Login> => {                      
            console.error("Entering Observable<Login>"); // log to console instead

            this.loginService.userLogged=false;
  
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
      
            // TODO: better job of transforming error for user consumption
            console.error(`${operation} failed: ${error.message}`);
      
            // Let the app keep running by returning an empty result.
            return of(result as Login);
        };
    }
    
    next(uvo: UserVO) {
        console.log("Entering next()"); // log to console instead
        console.log(uvo);
        
        this.userService.selectedUser = uvo;
    }

    onError(e:any) {
        console.error("Entering LoginDetailView.onError()");
        console.error(e);
    }

    onComplete() {
        console.log("Entering LoginDetailView.onComplete()" );

        if(this.loginService.userLogged)  {
            this.isLoginFailed = false;
            this.userService.setSelectedUser(this.userService.selectedUser);
            let redirect = '/admintourney';
            this.router.navigate([redirect]);
        } else {
            this.isLoginFailed = true;
        }
        console.log("isLoginFailed=" + this.isLoginFailed);
    }

    get diagnostic() { return JSON.stringify(this.loginformGroup.value); }
}
