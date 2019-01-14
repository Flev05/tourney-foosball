import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';
import { Password } from '../../../domain/password';
import { UserngService } from '../../../service/user-service';
import { LoginService } from '../../../service/login-service';

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

    msgs: Message[] = [];

    userform: FormGroup;

    submitted: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userngService: UserngService,
        private loginService: LoginService
    ) {}

    ngOnInit() {
        this.formLogin = {"id":1, "username":"", "password" : "", "newPassword" : "", "confirmedPassword" : ""};

        this.userform = this.fb.group({
            'username': new FormControl(this.loginService.selectedLogin.username),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
            'newPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
            'confirmedPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
        });

    }

    onSubmit(value: string) {
        this.submitted = true;
        this.msgs = [];

        this.formLogin.username = this.userform.get('username').value;
        this.formLogin.password = this.userform.get('password').value;
        this.formLogin.newPassword = this.userform.get('newPassword').value;
        this.formLogin.confirmedPassword = this.userform.get('confirmedPassword').value;

        if(this.formLogin.newPassword!=this.formLogin.confirmedPassword) {
            this.msgs.push({severity:'warn', summary:'Errore', detail:'La nuova password deve essere uguale a quella confermata! Rifare'});
        } else {
            this.userngService.changePassword(this.formLogin).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());  
        }
    }

    next(n:any) {
    }

    onError(n:any) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Errore', detail:'Cambio password fallito'});
    }

    onComplete() {
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'Fatto', detail:'Password cambiata con successo! Logout e Login con la nuova password!'});
        // this.loginService.sendLogout().subscribe(() => this.goHome());  
    }

    goHome(): void {
        let redirect = '';
        this.router.navigate([redirect]);
    }
}
