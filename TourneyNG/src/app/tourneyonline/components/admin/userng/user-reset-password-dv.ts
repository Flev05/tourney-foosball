import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Location } from '@angular/common';
import {Message} from '../../../../components/common/api';
import { Password } from '../../../domain/password';
import { UserngService } from '../../../service/userngservice';
import { LoginService } from '../../../service/loginservice';

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

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserngService,
        private loginService: LoginService,
        private location: Location
    ) {}

    ngOnInit() {
        this.formLogin = {"id":1, "username":"", "password" : ""};

        const username = this.userService.selectedUser==undefined ? '' : this.userService.selectedUser.username;

        this.userform = this.fb.group({
            'username': new FormControl(username),
        });
    }

    onSubmit(value: string) {
        this.submitted = true;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Success', detail:'Form Submitted'});

        this.formLogin.username = this.userform.get('username').value;

        this.userService.resetPassword(this.formLogin).subscribe( () => this.goBack());  
    }
    
    goBack(): void {
        this.location.back();
    }
}
