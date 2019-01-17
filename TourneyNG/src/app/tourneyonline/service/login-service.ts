

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { Login } from '../domain/login';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const loginUrl  = 'api/logon/login';  // URL to web server api
const logoutUrl = 'api/logon/logout';  // URL to web server api

@Injectable()
export class LoginService {

    selectedLogin : Login;

    userLogged: boolean = true;

    constructor(private http: HttpClient) { 
        console.log("Constructor of LoginService");
        this.userLogged=undefined;
    }

    /** PUT: send the request login to the server */
    sendLogin (login: Login ): Observable<Login> {
        const url = loginUrl;
        console.log("Entering sendLogin(" + login.username + ")"); 

        this.userLogged=true;
        this.selectedLogin = login;

        return this.http.put(url, login, httpOptions).pipe(
            tap(_ => this.log(`sendLogin url=${url}  successful`)),
            catchError(this.handleLoginError<Login>('sendLogin'))
        );
    }
  
    /** PUT: send the request logout to the server */
    sendLogout (): Observable<Login> {
        const url = logoutUrl;

        this.userLogged=false;
        this.selectedLogin=undefined;

        return this.http.put(url, this.selectedLogin, httpOptions).pipe(
            tap(_ => this.log(`sendLogout url=${url} successful`) ),
            catchError(this.handleLogoutError<Login>('sendLogout'))
        );
    }
  
    private handleLoginError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error("Entering handleLoginError()"); // log to console instead
      
            this.userLogged=false;
            this.selectedLogin=undefined;
        
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
      
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
      
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
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
