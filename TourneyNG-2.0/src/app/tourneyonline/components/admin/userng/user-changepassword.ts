import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Md5 } from 'md5-typescript';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { LoginService } from '../../../service/login-service';
import { Password } from '../../../domain/password';
import { UserService } from '../../../service/user-service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './user-changepassword.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
        .col-2 {
            width: 47mm;
        }
  `]
})
export class UserChangePassword implements OnInit {

    formLogin: Password = new Password();

    msgs: string = "";

    userform: FormGroup;

    submitted: boolean = false;
    changePasswordError: boolean = false;
    changePasswordInfo: boolean = false;
    loggedUsername: string = "";

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private loginService: LoginService
        ,private messageService: MessageService
    ) {
        this.userform = this.fb.group({
            username: [''],
            password: ['']
        });
    }

    ngOnInit() {
        this.changePasswordInfo = false;
        this.changePasswordError = false;
        this.msgs = "";
        this.formLogin.id = 1;

        this.loggedUsername = this.loginService.userLogged.username;
        
        this.userform = this.fb.group({
            'username': new FormControl(this.loginService.userLogged.username),
            'password': new FormControl(''),
            'newPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
            'confirmedPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
        });
    }

    onSubmit(value: string) {
        this.submitted = true;

        let get = this.userform.get('username');
        if( get != null ) 
            this.formLogin.username = get.value;

        get = this.userform.get('password');
        if( get != null ) 
            this.formLogin.password = get.value;

        let prevPassword = Md5.init(this.formLogin.password)
        this.changePasswordInfo = false;
        this.changePasswordError = false;
        if( this.userService.selectedUser.password.toUpperCase() != prevPassword.toUpperCase() ) {
            this.changePasswordError = true;
            this.msgs = "Vecchia Password errata! Rifare";
            return;
        }

        get = this.userform.get('newPassword');
        if( get != null ) 
            this.formLogin.newPassword = get.value;
        get = this.userform.get('confirmedPassword');
        if( get != null ) 
            this.formLogin.confirmedPassword = get.value;

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
        this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: this.msgs
        });          
    }

    onComplete() {
        this.changePasswordInfo = true;
        this.msgs = 'Password cambiata con successo! Uscire e rifare il Login con la nuova password!';
        this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: this.msgs
        });          
    }

    goHome(): void {
        let redirect = '';
        this.router.navigate([redirect]);
    }
}
