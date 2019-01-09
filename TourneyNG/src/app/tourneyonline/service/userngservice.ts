

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Userng } from '../domain/userng';
import { Password } from '../domain/password';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserngService {
    private apiUrl = 'be/userng';                       // URL to Back End api
    private changePasswordUrl = 'be/changePassword';    // URL to Back End api
    private resetPasswordUrl = 'be/resetPassword';      // URL to Back End api

    selectedUser : Userng;

    newUser : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of UserService");
    }

    loadUserSmall (): Observable<Userng[]> {
 
        return this.http.get<Userng[]>(this.apiUrl)
        .pipe(
            tap(_ => this.log(`fetched all User`)),
            catchError(this.handleError('loadUserSmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getUser(id: number): Observable<Userng> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Userng>(url).pipe(
            tap(_ => this.log(`fetched User id=${id}`)),
            catchError(this.handleError<Userng>(`getUser id=${id}`))
        );
    }

    /** POST: add a new User to the server */
    addUser (userng: Userng): Observable<Userng> {
        return this.http.post<Userng>(this.apiUrl, userng, httpOptions).pipe(
            tap((userng: Userng) => this.log(`added User w/ id=${userng.id}`)),
            catchError(this.handleError<Userng>('addUser'))
        );
    }

    /** PUT: update the User on the server */
    updateUser (userng: Userng ): Observable<Userng> {
        const id =  userng.id;
        const url = `${this.apiUrl}/${userng.id}`;

        return this.http.put(url, userng, httpOptions).pipe(
            tap(_ => this.log(`updated User id=${id}`)),
            catchError(this.handleError<Userng>('updateUser'))
        );
    }
    
    /** DELETE: delete the User from the server */
    deleteUser (userng: Userng | number): Observable<Userng> {
        const id = typeof userng === 'number' ? userng : userng.id;
        const url = `${this.apiUrl}/${id}`;

        return this.http.delete<Userng>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted User id=${id}`)),
            catchError(this.handleError<Userng>('deleteUser'))
        );
    }

    /** PUT: changePassword the User on the server */
    changePassword (userng: Password ): Observable<Userng> {
        const username =  userng.username;
        const url = `${this.changePasswordUrl}`;

        return this.http.put(url, userng, httpOptions).pipe(
            tap(_ => this.log(`Change password, username=${username}`)),
            catchError(this.handleError<Userng>('changePassword'))
        );
    }
    
    /** PUT: resetPassword the User on the server */
    resetPassword (userng: Password ): Observable<Userng> {
        const url = `${this.resetPasswordUrl}`;

        return this.http.put(url, userng, httpOptions).pipe(
            tap(_ => this.log(`Reset password, username=${userng.username}`)),
            catchError(this.handleError<Userng>('resetPassword'))
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
