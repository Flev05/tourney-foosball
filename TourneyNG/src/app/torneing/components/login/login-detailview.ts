import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Login } from '../../domain/login';
import { LoginService } from '../../service/loginservice';
import {Message,SelectItem} from '../../../components/common/api';

@Component({
    templateUrl: './login-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
        .ui-g-4 {
            width: 30mm;
        }
  `]
})
export class LoginDetailView implements OnInit {

    formLogin: Login;

    msgs: Message[] = [];

    userform: FormGroup;

    submitted: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService
    ) {}

    ngOnInit() {
        this.formLogin = {"username":"", "password" : ""};

        this.userform = this.fb.group({
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
        });

    }

    onSubmit(value: string) {
        this.submitted = true;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Success', detail:'Form Submitted'});

        this.formLogin.username = this.userform.get('username').value;
        this.formLogin.password = this.userform.get('password').value;

        this.loginService.sendLogin(this.formLogin).subscribe(() => this.goHome());  
    }

    goHome(): void {
        let redirect = '';
        this.router.navigate([redirect]);
    }

    get diagnostic() { return JSON.stringify(this.userform.value); }
}
