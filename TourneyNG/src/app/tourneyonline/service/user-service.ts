

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { UserVO } from '../domain/user-vo';
import { Password } from '../domain/password';
import { ClientService } from './client-service';
import { RoleService } from './role-service';

const apiUrl = 'api/users';                         // URL to Back End api

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {
    private changePasswordUrl = 'api/changePassword';    // URL to Back End api
    private resetPasswordUrl = 'api/resetPassword';      // URL to Back End api

    selectedUser : UserVO;

    newUser : boolean = false;

    constructor(private http: HttpClient
        , private clientService : ClientService
        , private roleService : RoleService) 
    { 
        console.log("Constructor of UserService");
    }

    loadUserSmall (): Observable<UserVO[]> {
 
        return this.http.get<UserVO[]>(apiUrl)
        .pipe(
            tap(_ => this.log(`fetched all User`)),
            catchError(this.handleError('loadUserSmall', []))
          );
    }

    setSelectedUser(uvo: UserVO): void {
        this.selectedUser = uvo;
        this.clientService.setSelectClients(uvo.clients);
        this.roleService.setSelectRoles(uvo.roles);
    }

    /** GET hero by id. Will 404 if id not found */
    getUser(id: number): Observable<UserVO> {
        const url = `${apiUrl}/${id}`;
        return this.http.get<UserVO>(url).pipe(
            tap(_ => this.log(`fetched User id=${id}`)),
            catchError(this.handleError<UserVO>(`getUser id=${id}`))
        );
    }

    /** POST: add a new User to the server */
    addUser (userng: UserVO): Observable<UserVO> {
        return this.http.post<UserVO>(apiUrl, userng, httpOptions).pipe(
            tap((userng: UserVO) => this.log(`added User w/ id=${userng.id}`)),
            catchError(this.handleError<UserVO>('addUser'))
        );
    }

    /** PUT: update the User on the server */
    updateUser (userng: UserVO ): Observable<UserVO> {
        const id =  userng.id;
        const url = `${apiUrl}/${userng.id}`;

        return this.http.put(url, userng, httpOptions).pipe(
            tap(_ => this.log(`updated User id=${id}`)),
            catchError(this.handleError<UserVO>('updateUser'))
        );
    }
    
    /** DELETE: delete the User from the server */
    deleteUser (userng: UserVO | number): Observable<UserVO> {
        const id = typeof userng === 'number' ? userng : userng.id;
        const url = `${apiUrl}/${id}`;

        return this.http.delete<UserVO>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted User id=${id}`)),
            catchError(this.handleError<UserVO>('deleteUser'))
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
        console.log('ClientService: ' + message);
    }
}
