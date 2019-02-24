import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Observable, of } from 'rxjs';

const redirect = '/users/resetPasswordDv';

@Component({
    templateUrl: './user-reset-password-lv.html'
})
export class UserResetPasswordLv extends AbstractListView  {

    selectedUser: UserVO;

    users: UserVO[];

    cols: TableCols[] ;
    onLoadUserError: boolean;

    constructor(protected tourneyService: TourneyService
        , private userService: UserService
        , public router: Router
        , protected location: Location) 
    { 
        super(redirect, tourneyService, router, location);
        console.log("UserListView.constructor()");
    }

    ngOnInit() {
        console.log("UserListView.ngOnInit()");

        this.onLoadUserError = false;

        const subscriber = this.userService.loadAllUsers(this.selectedUser.id, this.loadUsersErrorHandler('loadAllUsers()'));
        subscriber.subscribe(cs => this.users = cs, e => this.onError(e), () => this.onComplete());

        this.userService.newUser = false;

        this.cols = [
            { field: 'username',    header: 'username' },
            { field: 'firstname',   header: 'Nome' },
            { field: 'lastname',    header: 'Cognome' },
        ];
    }

    private onComplete(): void {
        console.log("onComplete()");
    }

    private loadUsersErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onLoadUserError = true;
            console.log(`${operation} failed`);

            console.error(error); // log to console instead     
      
            return of(result as T);
        };
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

        this.userService.selectedUser = this.selectedUser;
        this.userService.newUser = false;

        this.gotoDetailView();
    }
   
 
}
