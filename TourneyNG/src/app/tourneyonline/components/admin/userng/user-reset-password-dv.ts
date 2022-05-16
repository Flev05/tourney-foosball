import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Location } from '@angular/common';
import { Password } from 'app/tourneyonline/domain/password';
import { Message } from 'primeng/api';
import { UserService } from 'app/tourneyonline/service/user-service';
import { Md5 } from 'md5-typescript';
import { UserDetailView } from './user-detailview';
import { LoginService } from 'app/tourneyonline/service/login-service';

@Component({
    templateUrl: './user-reset-password-dv.html',
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
export class UserResetPasswordDv implements OnInit {

    formLogin: Password;

    msgs: Message[] = [];

    userform: FormGroup;

    submitted: boolean;
    loggedUsername: string;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private loginService: LoginService,
        private location: Location
    ) {}

    ngOnInit() {
        this.formLogin = {"id": 1, "username": "", "password": ""};

        const username = this.userService.selectedUser==undefined ? '' : this.userService.selectedUser.username;
        this.loggedUsername = this.loginService.userLogged.username;

        this.userform = this.fb.group({
            'username': new FormControl(username),
        });
    }

    onSubmit(value: string) {
        this.submitted = true;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Success', detail:'Form Submitted'});

        this.formLogin.username = this.userform.get('username').value;

        this.formLogin.password = Md5.init(this.formLogin.username);
        console.log("MD5(password)=" + this.formLogin.password);

        this.userService.selectedUser.password = this.formLogin.password;
        this.userService.resetPassword(this.userService.selectedUser).subscribe( () => this.goBack());  
    }
    
    goBack(): void {
        this.location.back();
    }
}
