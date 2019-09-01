

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { Login } from '../domain/login';
import { RoleService } from './role-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const loginUrl  = 'api/logon/login';  // URL to web server api
const logoutUrl = 'api/logon/logout';  // URL to web server api

@Injectable()
export class LoginService {

    userLogged   : Login;
    isUserLogged : boolean = false;
    blockedDocument: boolean;

    constructor(private http: HttpClient, private roleService : RoleService) { 
        console.log("Constructor of LoginService");
        this.isUserLogged = false;
    }

    isDeveloper(): boolean {
        return this.userLogged && this.roleService.isDeveloper();
    }

    isOwnerNotDeveloper(): boolean {
        return this.userLogged && this.roleService.isOwner() && !this.roleService.isDeveloper();
    }

    isOwner(): boolean {
        return this.userLogged && this.roleService.isOwner();
    }

    isAdmin(): boolean {
        return this.userLogged && this.roleService.isAdmin();
    }

    setUserLogged(uvo: Login): void {
        this.userLogged = uvo;
        this.roleService.setSelectRoles(uvo.roles);
    }

    /** PUT: send the request login to the server */
    sendLogin (login: Login, selector: (err: any, caught: Observable<Login> ) => Observable<Login> ): Observable<Login> {
        const url = loginUrl;
        console.log("Entering sendLogin(" + login.username + ")"); 

        return this.http.put(url, login, httpOptions).pipe(
            tap(_ => this.log(`sendLogin url=${url}  successful`)),
            catchError(selector)
        );
    }
  
    /** PUT: send the request logout to the server */
    sendLogout (): Observable<Login> {
        const url = logoutUrl + "/" + this.userLogged.id;

        console.log("Entering sendLogout(" + url + ")"); 

        return this.http.put(url, httpOptions).pipe(
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
