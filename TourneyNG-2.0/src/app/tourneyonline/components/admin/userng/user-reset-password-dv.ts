import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Location } from '@angular/common';
import { Password } from '../../../domain/password';
import { UserService } from '../../../service/user-service';
import { Md5 } from 'md5-typescript';
import { LoginService } from '../../../service/login-service';
import { ToastMessageOptions } from 'primeng/api';

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
  `],
    standalone: false
})
export class UserResetPasswordDv implements OnInit {

    formLogin: Password = new Password();

    msgs: ToastMessageOptions[] = [];

    userform: FormGroup;

    submitted: boolean = false;
    loggedUsername: string = "";

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private loginService: LoginService,
        private location: Location
    ) {
        this.userform = this.fb.group({
            username: [''],
            password: ['']
        });
    }

    ngOnInit() {
        this.formLogin.id = 1;

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

        let get = this.userform.get('username');
        if( get == null ) return;
        this.formLogin.username = get.value;

        this.formLogin.password = Md5.init(this.formLogin.username);
        console.log("MD5(password)=" + this.formLogin.password);

        this.userService.selectedUser.password = this.formLogin.password;
        this.userService.resetPassword(this.userService.selectedUser).subscribe( () => this.goBack());  
    }
    
    goBack(): void {
        this.location.back();
    }
}
