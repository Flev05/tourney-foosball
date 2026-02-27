import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

import { UserVO } from '../../../domain/user-vo';
import { UserService } from '../../../service/user-service';
import { TableCols } from '../../../domain/table-cols';
import { AbstractListView } from '../../../components/common/abstract-listview';
import { TourneyService } from '../../../service/tourney-service';
import { LoginService } from '../../../service/login-service';

const redirect = '/users/resetPasswordDv';

@Component({
    templateUrl: './user-reset-password-lv.html'
})
export class UserResetPasswordLv extends AbstractListView  {
    selectedUser: UserVO = new UserVO();
    users: UserVO[] = [];
    cols: TableCols[] = [];
    onLoadUserError: boolean = false;
    loggedUsername: string = "";

    constructor(protected override tourneyService: TourneyService
        , private loginService: LoginService
        , private userService: UserService
        , public override router: Router
        , protected override location: Location) 
    { 
        super(redirect, tourneyService, router, location);
        console.log("UserResetPasswordLv.constructor()");
    }

    override ngOnInit() {
        console.log("UserResetPasswordLv.ngOnInit()");
        
        this.onLoadUserError = false;
        let loggedUserId = this.loginService.userLogged.id;
        this.loggedUsername = this.loginService.userLogged.username;

        const subscriber = this.userService.loadAllUsers(loggedUserId, this.loadUsersErrorHandler('loadAllUsers()'));
        subscriber.subscribe(cs => this.users = cs, e => this.onError(e), () => this.onComplete());
        this.userService.newUser = false;
        this.cols = [
            { field: 'username',    header: '' },
            { field: 'firstname',   header: '' },
            { field: 'lastname',    header: '' },
            { field: 'email',       header: '' },
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
        this.selectedUser.username="<Username>";
        this.selectedUser.firstname="<Nome Utente>";
        this.selectedUser.lastname="<Cognome Utente>";
        this.userService.selectedUser = this.selectedUser;
        this.userService.newUser = true;
        this.gotoDetailView();
    }

    onRowSelect(event : any) {
        console.log(event.data);

        this.userService.selectedUser = this.selectedUser;
        this.userService.newUser = false;

        this.gotoDetailView();
    }
}
