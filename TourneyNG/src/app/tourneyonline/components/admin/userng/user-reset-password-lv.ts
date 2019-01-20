import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
 
@Component({
    templateUrl: './user-reset-password-lv.html'
})
export class UserResetPasswordLv implements OnInit {

    selectedUser: UserVO;

    users: UserVO[];

    cols: TableCols[] ;

    constructor(private userService: UserService, public router: Router) { 
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

    cloneUser(c: UserVO): UserVO {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
