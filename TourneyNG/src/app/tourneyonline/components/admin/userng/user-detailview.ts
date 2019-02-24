import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { Role } from 'app/tourneyonline/domain/role';
import { UserService } from 'app/tourneyonline/service/user-service';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Observable, of } from 'rxjs';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { AbstractDetailView } from '../../common/abstract-detailview';

@Component({
    templateUrl: './user-detailview.html' 
})
export class UserDetailView extends AbstractDetailView {

    selectedUser: UserVO;
    cols: TableCols[] ;

    roles : Role[];
    
    selectedRoles: Role[];
    onSaveUserError: any;
    badRequest: boolean;
    userAlreadyExists: boolean;

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
    ) {
        super(tourneyService, location, countryService);
    }

    ngOnInit() {

        this.getUserng();

        this.cols = [
            { field: 'rolename',    header: 'Nome ruolo' },
            { field: 'description', header: 'Descrizione' },
        ];

        this.roleService.loadRolesSmall().subscribe(rs => this.roles = rs);
    }

    getUserng(): void {
        this.selectedUser = this.userService.selectedUser;

        this.selectedRoles = this.selectedUser.roles;
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
