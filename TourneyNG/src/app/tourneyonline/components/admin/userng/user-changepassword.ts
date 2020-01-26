import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Md5 } from 'md5-typescript';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { LoginService } from 'app/tourneyonline/service/login-service';
import { Password } from 'app/tourneyonline/domain/password';
import { UserService } from 'app/tourneyonline/service/user-service';

@Component({
    templateUrl: './user-changepassword.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
        .ui-grid-col-2 {
            width: 47mm;
        }
  `]
})
export class UserChangePassword implements OnInit {

    formLogin: Password;

    msgs: string = "";

    userform: FormGroup;

    submitted: boolean;
    changePasswordError: boolean;
    changePasswordInfo: boolean;
    loggedUsername: string;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private loginService: LoginService
    ) {}

    ngOnInit() {
        this.changePasswordInfo = false;
        this.changePasswordError = false;
        this.msgs = "";
        this.formLogin = {"id":1, "username":"", "password" : "", "newPassword" : "", "confirmedPassword" : ""};

        this.loggedUsername = this.loginService.userLogged.username;
        
        this.userform = this.fb.group({
            'username': new FormControl(this.loginService.userLogged.username),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
            'newPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
            'confirmedPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
        });
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.formLogin.username = this.userform.get('username').value;
        this.formLogin.password = this.userform.get('password').value;
        let prevPassword = Md5.init(this.formLogin.password)
        this.changePasswordInfo = false;
        this.changePasswordError = false;
        if( this.userService.selectedUser.password.toUpperCase() != prevPassword.toUpperCase() ) {
            this.changePasswordError = true;
            this.msgs = "Vecchia Password errata! Rifare";
            return;
        }
        this.formLogin.newPassword = this.userform.get('newPassword').value;
        this.formLogin.confirmedPassword = this.userform.get('confirmedPassword').value;

        if(this.formLogin.newPassword != this.formLogin.confirmedPassword) {
            this.changePasswordError = true;
            this.msgs = 'La nuova password deve essere uguale a quella confermata! Rifare';
        } else {
            let md5 = Md5.init(this.formLogin.newPassword);
            console.log("MD5(password)=" + md5);

            this.userService.selectedUser.password = md5;
            this.userService.changePassword(this.userService.selectedUser).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());  
        }
    }

    next(n:any) {
    }

    onError(n:any) {
        this.changePasswordError = true;
        this.msgs = 'Cambio password fallito';
    }

    onComplete() {
        this.changePasswordInfo = true;
        this.msgs = 'Password cambiata con successo! Uscire e rifare il Login con la nuova password!';
    }

    goHome(): void {
        let redirect = '';
        this.router.navigate([redirect]);
    }
}
