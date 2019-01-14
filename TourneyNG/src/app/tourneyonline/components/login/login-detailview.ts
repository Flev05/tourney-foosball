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

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService
    ) {}

    ngOnInit() {
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

        this.loginService.sendLogin(this.formLogin).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());  
    }
    
    next(n:any) {
    }

    onError(n:any) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Errore', detail:'Login fallito'});
    }

    onComplete() {
        let redirect = '';
        this.router.navigate([redirect]);
    }

    get diagnostic() { return JSON.stringify(this.loginformGroup.value); }
}
