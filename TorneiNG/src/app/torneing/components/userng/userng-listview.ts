import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Userng } from '../../domain/userng';
import { UserngService } from '../../service/userngservice';

@Component({
    templateUrl: './userng-listview.html'
})
export class UserngListView implements OnInit {

    selectedUserng: Userng;

    usersng: Userng[];

    cols: any[];

    constructor(private userngService: UserngService, public router: Router) { 
        console.log("UserngListView.constructor()");
    }

    ngOnInit() {
        console.log("UserngListView.ngOnInit()");

        this.userngService.loadUserngSmall().subscribe(cs => this.usersng = cs);

        this.userngService.newUserng = false;

        this.cols = [
            { field: 'firstname',    header: 'Nome' },
            { field: 'lastname',     header: 'Cognome' },
            { field: 'username', header: 'username' },
            { field: 'phoneNumber',  header: 'Telefono' }
        ];
    }

    create() {
        this.selectedUserng={
              firstname: "<Nome Cliente>"
            , lastname: "<Cognome Cliente>"
            , username: "<Username"
            , phoneNumber: "<Numero di cellulare>"
        };
        this.userngService.selectedUserng = this.selectedUserng;
        this.userngService.newUserng = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.userngService.selectedUserng = this.cloneUserng(event.data);
        this.userngService.newUserng = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
        let redirect = '/userng/dv';
        this.router.navigate([redirect]);
    }

    cloneUserng(c: Userng): Userng {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
