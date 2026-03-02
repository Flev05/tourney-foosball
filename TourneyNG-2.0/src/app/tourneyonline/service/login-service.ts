

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Login } from '../domain/login';
import { RoleService } from './role-service';
import { UserService } from './user-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const loginUrl  = 'api/logon/login';  // URL to web server api
const logoutUrl = 'api/logon/logout';  // URL to web server api

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    userLogged   : Login = new Login();
    isUserLogged : boolean = false;
    blockedDocument: boolean = false;
    currentYear: string;

    constructor(private http: HttpClient
        , private userService: UserService
        , private roleService : RoleService) 
    { 
        console.log("Constructor of LoginService");
        this.isUserLogged = false;
        this.currentYear="2023";
    }

    isDeveloper(): boolean {
        return this.isUserLogged && this.roleService.isDeveloper();
    }
    
    isAtLeastOwner(): boolean {
        return this.roleService.isAtLeastOwner();
    }

    isAtLeastAdmin(): boolean {
        return this.roleService.isAtLeastAdmin();
    }

    isOwnerNotDeveloper(): boolean {
        return this.isUserLogged && this.roleService.isOwner() && !this.roleService.isDeveloper();
    }

    isOwner(): boolean {
        return this.isUserLogged && this.roleService.isOwner();
    }

    isAdmin(): boolean {
        return this.isUserLogged && this.roleService.isAdmin();
    }

    isOperator(): boolean {
        return this.isUserLogged && this.roleService.isOperator();
    }

    isFollower(): boolean {
        return this.isUserLogged && this.roleService.isFollower();
    }

    isSuperUser(): boolean {
        return this.isUserLogged && (this.isDeveloper() || this.isOwner() || this.isAdmin());
    }

    isUserAllowed(): boolean {
        return !this.isUserLogged || this.isAtLeastAdmin() ;
    }

    setUserLogged(lvo: Login): void {
        this.userLogged = lvo;
        this.isUserLogged = true;
        this.userService.selectedUser = lvo;
        this.roleService.setSelectRoles(lvo.roles, lvo.minorRoles);
    }

    /** PUT: send the request login to the server */
    sendLogin (login: Login, selector: (err: any, caught: Observable<Login> ) => Observable<Login> ): Observable<Login> {
        const url = loginUrl;
        console.log("URL: " + loginUrl); 
        const json = JSON.stringify(login);
        console.log('Payload: ', json);
        console.log('Headers: ', httpOptions.headers.keys());

        const payload = {
            id: login.id,
            username: login.username,
            password: login.password
        };
        return this.http.put<Login>(url, payload, httpOptions).pipe(
            tap(_ => this.log(`sendLogin url=${url}  successful`)),
            catchError(selector)
        );
    }
  
    /** PUT: send the request logout to the server */
    sendLogout (): Observable<Login> {
        const url = logoutUrl + "/" + this.userLogged.id;

        console.log("Entering sendLogout(" + url + ")"); 

        return this.http.put<Login>(url, httpOptions).pipe(
            tap(_ => this.log(`sendLogout url=${url} successful`) ),
            catchError(this.handleLogoutError<Login>('sendLogout'))
        );
    }
      
    private handleLogoutError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error("Entering handleLogoutError()"); // log to console instead
        
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
      
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
      
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
      }
      
    /** Log a LoginService message with the MessageService */
    private log(message: string) {
        console.log('LoginService: ' + message);
    }
}
