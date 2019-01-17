import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { Login } from 'app/tourneyonline/domain/login';
import { Message } from 'app/components/common/api';
import { LoginService } from 'app/tourneyonline/service/login-service';

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
        private loginService: LoginService
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
        this.formLogin.password = this.loginformGroup.get('password').value;

        this.isLoginFailed = false;

        this.loginService.sendLogin(this.formLogin).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());  
    }
    
    next(n:any) {
        console.log(n);
    }

    onError(n:any) {
        console.log("Entering LoginDetailView.onError()");

        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Errore', detail:'Login fallito'});
    }

    onComplete() {
        console.log("Entering LoginDetailView.onComplete()" );

        if(this.loginService.userLogged) {
            this.isLoginFailed = false;
            let redirect = 'admintourney';
            this.router.navigate([redirect]);
        } else {
            this.isLoginFailed = true;
        }
        console.log("isLoginFailed=" + this.isLoginFailed);
    }

    get diagnostic() { return JSON.stringify(this.loginformGroup.value); }
}
