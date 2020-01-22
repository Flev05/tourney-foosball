

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { UserVO } from '../domain/user-vo';
import { Password } from '../domain/password';

const userUrl = 'api/users';                         // URL to Back End api

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {
    private changePasswordUrl = 'api/changePassword';    // URL to Back End api
    private resetPasswordUrl = 'api/resetPassword';      // URL to Back End api

    newUser : boolean = false;
    selectedUser: UserVO;
    
    constructor(private http: HttpClient) 
    { 
        console.log("Constructor of UserService");
    }

    loadAllUsers (loggedUserId: number, selector: (err: any, caught: Observable<UserVO[]> ) => Observable<UserVO[]>): Observable<UserVO[]> {
        const url = userUrl + "/findByUserId/" + loggedUserId;
        console.log(url);
        
        return this.http.get<UserVO[]>(url).pipe(
            tap(_ => this.log("fetched all clients by user id: " + loggedUserId))
          , catchError(selector)
        );
    }

    loadOperatorsByClient (clientId: number, selector: (err: any, caught: Observable<UserVO[]> ) => Observable<UserVO[]>): Observable<UserVO[]> {
        const url = userUrl + "/findOperatorsByClientId/" + clientId;
        console.log(url);
        
        return this.http.get<UserVO[]>(url).pipe(
            tap(_ => this.log("fetched all clients by user id: " + clientId))
          , catchError(selector)
        );
    }


    /** GET hero by id. Will 404 if id not found */
    getUser(id: number): Observable<UserVO> {
        const url = `${userUrl}/${id}`;
        return this.http.get<UserVO>(url).pipe(
            tap(_ => this.log(`fetched User id=${id}`)),
            catchError(this.handleError<UserVO>(`getUser id=${id}`))
        );
    }

    /** POST: add a new User to the server */
    addUser (userng: UserVO): Observable<UserVO> {
        return this.http.post<UserVO>(userUrl, userng, httpOptions).pipe(
            tap((userng: UserVO) => this.log(`added User w/ id=${userng.id}`)),
            catchError(this.handleError<UserVO>('addUser'))
        );
    }

    /** POST: add a new User to the server */
    private createUser (user: UserVO, selector: (err: any, caught: Observable<UserVO> ) => Observable<UserVO>): Observable<UserVO> {
        let url = userUrl + "/insert";
        console.log(url);

        return this.http.post<UserVO>(url, user, httpOptions).pipe(
              tap((user: UserVO) => this.log(`added User w/ id=${user.id}`))
            , catchError(selector)
        );
    }

    /** PUT: update the User on the server */
    private updateUser (user: UserVO, selector: (err: any, caught: Observable<UserVO> ) => Observable<UserVO> ): Observable<UserVO> {
        const url = userUrl + "/update";
        console.log(url);
        
        return this.http.put(url, user, httpOptions).pipe(
            tap(_ => this.log(`updated User id=${user.id}`)),
            catchError(selector)
        );
    }
    
    saveUser (user: UserVO, selector: (err: any, caught: Observable<UserVO> ) => Observable<UserVO> ): Observable<UserVO> {
        if(user.id == null) {
            return this.createUser(user, selector);
        }
        return this.updateUser(user, selector);
    }

    /** DELETE: delete the User from the server */
    deleteUser (userId: number, selector: (err: any, caught: Observable<UserVO> ) => Observable<UserVO> ): Observable<UserVO> {
        const id = userId;
        const url = `${userUrl}/delete/${id}`;
        console.log(url);

        return this.http.delete<UserVO>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted User id=${id}`)),
            catchError(selector)
        );
    }

    /** PUT: changePassword the User on the server */
    changePassword (userng: Password ): Observable<UserVO> {
        const username =  userng.username;
        const url = `${this.changePasswordUrl}`;

        return this.http.put(url, userng, httpOptions).pipe(
            tap(_ => this.log(`Change password, username=${username}`)),
            catchError(this.handleError<UserVO>('changePassword'))
        );
    }
    
    /** PUT: resetPassword the User on the server */
    resetPassword (userng: Password ): Observable<UserVO> {
        const url = `${this.resetPasswordUrl}`;

        return this.http.put(url, userng, httpOptions).pipe(
            tap(_ => this.log(`Reset password, username=${userng.username}`)),
            catchError(this.handleError<UserVO>('resetPassword'))
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
        console.log('UserService: ' + message);
    }
}
