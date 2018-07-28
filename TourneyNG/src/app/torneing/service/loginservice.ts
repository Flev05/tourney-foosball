

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Login } from '../domain/login';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LoginService {
    private apiUrl = 'api/login';  // URL to web api

    selectedLogin : Login;

    newLogin : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of LoginService");
    }

    loadLoginSmall (): Observable<Login[]> {
 
        return this.http.get<Login[]>(this.apiUrl)
        .pipe(
            tap(_ => this.log(`fetched all Login`)),
            catchError(this.handleError('loadLoginSmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getLogin(id: number): Observable<Login> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Login>(url).pipe(
            tap(_ => this.log(`fetched Login id=${id}`)),
            catchError(this.handleError<Login>(`getLogin id=${id}`))
        );
    }

    /** PUT: update the Login on the server */
    updateLogin (login: Login ): Observable<Login> {
        const url = `${this.apiUrl}`;

        return this.http.put(url, login, httpOptions).pipe(
            tap(_ => this.log(`updated Login url=${url}`)),
            catchError(this.handleError<Login>('updateLogin'))
        );
    }
  
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
      
    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log('ClientService: ' + message);
    }
}
