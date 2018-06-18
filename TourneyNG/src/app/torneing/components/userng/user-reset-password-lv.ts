import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Userng } from '../../domain/userng';
import { UserngService } from '../../service/userngservice';

@Component({
    templateUrl: './user-reset-password-lv.html'
})
export class UserResetPasswordLv implements OnInit {

    selectedUser: Userng;

    users: Userng[];

    cols: any[];

    constructor(private userService: UserngService, public router: Router) { 
        console.log("UserListView.constructor()");
    }

    ngOnInit() {
        console.log("UserListView.ngOnInit()");

        this.userService.loadUserSmall().subscribe(cs => this.users = cs);

        this.userService.newUser = false;

        this.cols = [
            { field: 'username',    header: 'username' },
            { field: 'firstname',   header: 'Nome' },
            { field: 'lastname',    header: 'Cognome' },
        ];
    }

    create() {
        this.selectedUser={
              username: "<Username"
            , firstname: "<Nome Utente>"
            , lastname: "<Cognome Utente>"
        };
        this.userService.selectedUser = this.selectedUser;
        this.userService.newUser = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.userService.selectedUser = this.cloneUser(event.data);
        this.userService.newUser = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
        let redirect = '/users/resetPasswordDv';
        this.router.navigate([redirect]);
    }

    cloneUser(c: Userng): Userng {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
