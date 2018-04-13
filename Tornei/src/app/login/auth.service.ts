import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient , HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { User }                 from './user';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  isLoggedIn = false;
  users : User[];
  
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  
  private usersUrl = 'api/users';  // URL to web api

  login(username): Observable<User[]> {

    this.isLoggedIn = false;

    const obUser = this.searchUsers(username);

    this.isLoggedIn = true;

    return obUser;
  }
 
    /* GET Users whose username contains search term */
  searchUsers(username: string): Observable<User[]> {
      username = username.trim();  
  
      // Add safe, URL encoded search parameter if there is a search term
      const options = username ?
       { params: new HttpParams().set('username', username) } : {};
  
      return this.http.get<User[]>(this.usersUrl, options)
        .pipe(
          catchError(this.handleError<User[]>('searchUsers', []))
        );
  }
  
  logout(): void {
    this.isLoggedIn = false;
  }
 
  getUsers (): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        catchError(this.handleError('getHeroes', []))
      );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    // this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
