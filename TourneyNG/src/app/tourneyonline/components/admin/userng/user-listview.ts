import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './user-listview.html'
})
export class UserListView implements OnInit {

    selectedUser: UserVO;

    users: UserVO[];

    cols: TableCols[] ;

    constructor(private userngService: UserService, public router: Router) { 
        console.log("UserListView.constructor()");
    }

    ngOnInit() {
        console.log("UserListView.ngOnInit()");

        this.userngService.loadUserSmall().subscribe(cs => this.users = cs);

        this.userngService.newUser = false;

        this.cols = [
            { field: 'firstname',   header: 'Nome' },
            { field: 'lastname',    header: 'Cognome' },
            { field: 'username',    header: 'username' },
            { field: 'phoneNumber', header: 'Telefono' }
        ];
    }

    create() {
        this.selectedUser={
              firstname: "<Nome User>"
            , lastname: "<Cognome User>"
            , username: "<Username"
            , phoneNumber: "<Numero di cellulare>"
        };
        this.userngService.selectedUser = this.selectedUser;
        this.userngService.newUser = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.userngService.selectedUser = this.cloneUser(event.data);
        this.userngService.newUser = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
        let redirect = '/users/userdv';
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
