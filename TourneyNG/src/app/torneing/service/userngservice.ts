

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Userng } from '../domain/userng';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserngService {
    private apiUrl = 'api/userng';  // URL to web api

    selectedUserng : Userng;

    newUserng : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of UserngService");
    }

    loadUserngSmall (): Observable<Userng[]> {
 
        return this.http.get<Userng[]>(this.apiUrl)
        .pipe(
            tap(_ => this.log(`fetched all Userng`)),
            catchError(this.handleError('loadUserngSmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getUserng(id: number): Observable<Userng> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Userng>(url).pipe(
            tap(_ => this.log(`fetched Userng id=${id}`)),
            catchError(this.handleError<Userng>(`getUserng id=${id}`))
        );
    }

    /** POST: add a new User to the server */
    addUserng (userng: Userng): Observable<Userng> {
        return this.http.post<Userng>(this.apiUrl, userng, httpOptions).pipe(
            tap((userng: Userng) => this.log(`added Userng w/ id=${userng.id}`)),
            catchError(this.handleError<Userng>('addUserng'))
        );
    }

    /** PUT: update the User on the server */
    updateUserng (userng: Userng ): Observable<Userng> {
        const id =  userng.id;
        const url = `${this.apiUrl}/${userng.id}`;

        return this.http.put(url, userng, httpOptions).pipe(
            tap(_ => this.log(`updated Userng id=${id}`)),
            catchError(this.handleError<Userng>('updateUserng'))
        );
    }
    
    /** DELETE: delete the User from the server */
    deleteUserng (userng: Userng | number): Observable<Userng> {
        const id = typeof userng === 'number' ? userng : userng.id;
        const url = `${this.apiUrl}/${id}`;

        return this.http.delete<Userng>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Userng id=${id}`)),
            catchError(this.handleError<Userng>('deleteClient'))
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
