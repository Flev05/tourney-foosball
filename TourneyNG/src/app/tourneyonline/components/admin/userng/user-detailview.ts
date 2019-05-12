import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { Observable, of } from 'rxjs';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { UrcService } from 'app/tourneyonline/service/urc-service';

@Component({
    templateUrl: './user-detailview.html' 
})
export class UserDetailView extends AbstractDetailView {

    selectedUser: UserVO;

    onSaveUserError: any;
    badRequest: boolean;
    userAlreadyExists: boolean;

    userAddress: string;

    constructor(
        private userService: UserService,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        protected urcService: UrcService,
    ) {
        super(tourneyService, location);
    }

    ngOnInit() {

        this.countryService.loadAllCountries() ;

        if(this.userService.newUser) {
            this.userService.selectedUser = {
                id: null,
                firstname: '',
                lastname: '',
                address: '',
                email: '',
                phoneNumber: '',
                description: '',
                country    : {},
            }
        }
        this.selectedUser = this.userService.selectedUser;
    }
     
    enableSaveButton() : string {
        let un = this.selectedUser.username;
        let userEnable:   boolean = un.trim() == "";

        let fn = this.selectedUser.firstname;
        let ln = this.selectedUser.lastname;

        let upn = this.selectedUser.phoneNumber;
        let uem = this.selectedUser.email;
        let uad = this.selectedUser.address;
        userEnable = userEnable || fn.trim() == "" || ln.trim() == "" || upn.trim() == "" || uem.trim() == "" || uad.trim() == "";

        return userEnable ? "disabled" : "";
    }

    onSubmit(): void {
 
        const subscriber = this.userService.saveUser(this.selectedUser, this.saveUserErrorHandler('Create User operation'));
        subscriber.subscribe(cs => super.next(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
    }
    
    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");

            this.onSaveUserError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

    private onSaveComplete() {
        console.log("Entering onSaveComplete()");
        this.userService.newUser = false;
        if( !this.onSaveUserError ) {
            this.goBack();
        }
    }

    private saveUserErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveUserErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveUserError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
 
            if( res.error.errorCode == "UserAlreadyExists" ) {
                this.userAlreadyExists = true;
                return of(result as T);
            }
            return of(result as T);
        };
    }
}
