import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'app/tourneyonline/service/user-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

const redirect = '/users/userdv';

@Component({
    templateUrl: './user-listview.html'
})
export class UserListView extends AbstractListView {

    selectedUser: UserVO;

    users: UserVO[];

    cols: TableCols[] ;
    onLoadUserError: boolean;
    onDeleteError: boolean;
    loggedUsername: string;

    constructor(        
            protected tourneyService: TourneyService
          , private loginService: LoginService
          , private userService: UserService
          , public router: Router
          , protected location: Location
          , protected countryService: CountryService
        ) 
    {        
        super(redirect, tourneyService, router, location);
        console.log("UserListView.constructor()");
    }

    ngOnInit() {
        console.log("UserListView.ngOnInit()");

        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());

        this.userService.newUser = false;

        this.cols = [
            { field: 'username',    header: 'Username' },
            { field: 'firstname',   header: 'Nome' },
            { field: 'lastname',    header: 'Cognome' },
            { field: 'email',       header: 'Email' },
        ];

        this.onLoadUserError = false;

        let loggedUserId = this.loginService.userLogged.id;
        this.loggedUsername = this.loginService.userLogged.username;
        const subscriber = this.userService.loadAllUsers(loggedUserId, this.loadUsersErrorHandler('loadAllUsers()'));
        subscriber.subscribe(cs => this.users = cs, e => this.onError(e));
    }

    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
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
        this.userService.newUser = true;
        this.userService.selectedUser = this.userService.selectedUser = {
            id: null,
            username: '',
            firstname: '',
            lastname: '',
            address: '',
            email: '',
            phoneNumber: '',
            description: '',
            country    : {},
        };
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.userService.selectedUser = this.selectedUser;
        this.userService.newUser = false;
        this.gotoDetailView();
    }

    doDelete(user: UserVO) {
        console.log(user);
        this.selectedUser = user;
        let name =  user.username;
        let popup = "Sicuro di voler rimuovere l'utente: [" + name + "]?";

        this.onDeleteError = false;
        if(confirm(popup)) {

            const subscr = this.userService.deleteUser(this.selectedUser.id, this.deleteErrorHandler('deleteUser()'));

            subscr.subscribe(n => super.next(n), e => this.onError(e), () => this.onDeleteComplete());
        }
    }
    
    private onDeleteComplete(): void {
        console.log("onDeleteComplete()");

        let index: number = -1;

        for( let i=0; i<this.users.length; i++ ) {
            let uvo = this.users[i];

            if( uvo.id == this.selectedUser.id ) {
                index = i;
                break;
            }
        }

        if(index > -1 ) {
            this.users.splice(index, 1);
        }
    }

    private deleteErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onDeleteError = true;
            
            console.log(`${operation} failed!`);

            console.error(error); // log to console instead
      
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    
    onError(e:any) {
        console.log("onError()");
        console.log(e);

        this.onLoadUserError = true;
    }
 }
