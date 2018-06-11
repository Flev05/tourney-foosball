import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Login } from '../domain/login';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LoginService {
    private loginUrl = 'api/login';  // URL to web server api
    private logoutUrl = 'api/logout';  // URL to web server api

    selectedLogin : Login;

    userLogged: boolean = true;

    constructor(private http: HttpClient) { 
        console.log("Constructor of LoginService");
        this.userLogged=undefined;
    }

    /** PUT: send the request login to the server */
    sendLogin (login: Login ): Observable<Login> {
        const url = `${this.loginUrl}`;

        this.userLogged=true;

        return this.http.put(url, login, httpOptions).pipe(
            tap(_ => this.log(`sendLogin url=${url}`) ),
            catchError(this.handleError<Login>('sendLogin'))
        );
    }
  
    /** PUT: send the request logout to the server */
    sendLogout (): Observable<Login> {
        const url = `${this.logoutUrl}`;

        this.userLogged=undefined;

        return this.http.put(url, this.selectedLogin, httpOptions).pipe(
            tap(_ => this.log(`sendLogout url=${url}`) ),
            catchError(this.handleLogoutError<Login>('sendLogout'))
        );
    }
  
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error("Entering handleError()"); // log to console instead
      
        this.userLogged=true;
        
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
      
        this.userLogged=undefined;
        
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
