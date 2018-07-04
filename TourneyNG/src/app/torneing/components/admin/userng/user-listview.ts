import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Userng } from '../../../domain/userng';
import { UserngService } from '../../../service/userngservice';

@Component({
    templateUrl: './user-listview.html'
})
export class UserListView implements OnInit {

    selectedUser: Userng;

    users: Userng[];

    cols: any[];

    constructor(private userngService: UserngService, public router: Router) { 
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

    cloneUser(c: Userng): Userng {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
