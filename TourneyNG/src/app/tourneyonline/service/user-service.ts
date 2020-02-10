

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { UserVO } from '../domain/user-vo';
import { UserRoleClientVO } from '../domain/urc-vo';
import { OperatorsVO } from '../domain/operators-vo';

const userUrl = 'api/users';                         // URL to Back End api
const resetPasswordUrl = userUrl + '/resetPassword';
const changePasswordUrl = userUrl + '/changePassword';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {
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

    loadOperatorsBy(op: OperatorsVO, selector: (err: any, caught: Observable<OperatorsVO> ) => Observable<OperatorsVO>): Observable<OperatorsVO> {
        const url = userUrl + "/loadOperatorsBy/" + op.clientId + "/" + op.tourneyId;
        console.log(url);
        
        return this.http.get<OperatorsVO>(url).pipe(
            tap(_ => this.log("fetched all operators by client and tourney id: " + op))
          , catchError(selector)
        );
    }

    getUserByUsername (username: string ): Observable<UserVO> {
        const url = userUrl + "/getUserByUsername/" + username;
        console.log(url);
        
        return this.http.get<UserVO>(url).pipe(
            tap(_ => this.log("fetched a User by username: " + username))
          , catchError(this.handleError<UserVO>('addUser'))
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
    public updateUser (user: UserVO, selector: (err: any, caught: Observable<UserVO> ) => Observable<UserVO> ): Observable<UserVO> {
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

        /** POST: add a new User to the server */
        
    createUserAndUrc (urc: UserRoleClientVO, selector: (err: any, caught: Observable<UserRoleClientVO> ) => Observable<UserRoleClientVO> ): Observable<UserRoleClientVO> {
        let url = userUrl + "/insert";
        console.log(url);

        return this.http.post<UserRoleClientVO>(url, urc, httpOptions).pipe(
                tap((urc: UserRoleClientVO) => this.log(`added User w/ url=` + url))
            , catchError(selector)
        );
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

    /** POST: add a new User to the server */
    createOperator (urc: UserRoleClientVO, tourneyId: number, selector: (err: any, caught: Observable<UserRoleClientVO> ) => Observable<UserRoleClientVO>): Observable<UserRoleClientVO> {
        let url = userUrl + "/createOperator/" + tourneyId;
        console.log(url);

        return this.http.post<UserRoleClientVO>(url, urc, httpOptions).pipe(
            tap((op: UserRoleClientVO) => this.log(`added User w/ id=${op.userVo.username}`))
            , catchError(selector)
        );
    }

    /** Saves the relation betweeen the User and the tourney to the server */
    mergeOperators (ovo: OperatorsVO, selector: (err: any, caught: Observable<OperatorsVO> ) => Observable<OperatorsVO>): Observable<OperatorsVO> {
        let url = userUrl + "/mergeOperators";
        console.log(url);

        return this.http.post<OperatorsVO>(url, ovo, httpOptions).pipe(
            tap((op: OperatorsVO) => this.log(`mergeOperators for tourney id=${op.tourneyId}`))
            , catchError(selector)
        );
    }

    /** Detach the operator relation between tourney and operatorSS */
    deleteOperator(userId: number,tourneyId: number, selector: (err: any, caught: Observable<UserVO> ) => Observable<UserVO> ): Observable<UserVO> {
        const url = userUrl + "/deleteOperator/" + userId + "/" + tourneyId;
        console.log(url);

        return this.http.delete<UserVO>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted User id=` + url)),
            catchError(selector)
        );
    }

    /** PUT: changePassword the User on the server */
    changePassword( uvo: UserVO ): Observable<UserVO> {
        const username =  uvo.username;
        const url = changePasswordUrl;

        return this.http.put(url, uvo, httpOptions).pipe(
            tap(_ => this.log(`Change password, username=${username}`)),
            catchError(this.handleError<UserVO>('changePassword'))
        );
    }
    
    /** PUT: resetPassword the User on the server */
    resetPassword( uvo: UserVO ): Observable<UserVO> {
        const url = resetPasswordUrl;

        return this.http.put(url, uvo, httpOptions).pipe(
            tap(_ => this.log(`Reset password, username=${uvo.username}`)),
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
