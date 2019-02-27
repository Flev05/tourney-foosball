

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { RoleService } from './role-service';
import { UserRoleClientVO } from '../domain/urc-vo';

const userUrl = 'api/urc';                         // URL to Back End api
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UrcService {
    selectedUrc : UserRoleClientVO;

    newUser : boolean = false;

    constructor(private http: HttpClient, private roleService : RoleService) 
    { 
        console.log("Constructor of UrcService");
    }

    loadUrc (loggedUserId: number, selector: (err: any, caught: Observable<UserRoleClientVO[]> ) => Observable<UserRoleClientVO[]>): Observable<UserRoleClientVO[]> {
        const url = userUrl + "/findByUserId/" + loggedUserId;
        console.log(url);
        
        return this.http.get<UserRoleClientVO[]>(url).pipe(
            tap(_ => this.log("fetched all URC by url: " + url))
          , catchError(selector)
        );
    }
      
    saveUrc (urc: UserRoleClientVO[], selector: (err: any, caught: Observable<UserRoleClientVO[]> ) => Observable<UserRoleClientVO[]> ): Observable<UserRoleClientVO[]> {
        let user = urc[0];
        let userId = user.id;
        if(userId == null) {
            return this.createUser(urc, selector);
        }
        return this.updateUser(urc, selector);
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log('UrcService: ' + message);
    }

    /** POST: add a new User to the server */
    private createUser (urc: UserRoleClientVO[], selector: (err: any, caught: Observable<UserRoleClientVO[]> ) => Observable<UserRoleClientVO[]> ): Observable<UserRoleClientVO[]> {
        let user = urc[0];
        let url = userUrl + "/insert";
        console.log(url);

        return this.http.post<UserRoleClientVO[]>(url, user, httpOptions).pipe(
                tap((urc: UserRoleClientVO[]) => this.log(`added User w/ url=` + url))
            , catchError(selector)
        );
    }

    /** PUT: update the User on the server */
    private updateUser (urc: UserRoleClientVO[], selector: (err: any, caught: Observable<UserRoleClientVO[]> ) => Observable<UserRoleClientVO[]> ): Observable<UserRoleClientVO[]>{
        let user = urc[0];
        const url = userUrl + "/update";
        console.log(url);
        
        return this.http.put(url, user, httpOptions).pipe(
            tap(urc => this.log(`updated User id=${user.id}`)),
            catchError(selector)
        );
    }

    /** DELETE: delete the UserRoleClient from the server */
    deleteUrc (urcId: number, selector: (err: any, caught: Observable<UserRoleClientVO> ) => Observable<UserRoleClientVO> ): Observable<UserRoleClientVO> {
        const id = urcId;
        const url = `${userUrl}/delete/${id}`;
        console.log(url);

        return this.http.delete<UserRoleClientVO>(url, httpOptions).pipe(
            tap(_ => this.log("deleted UserRoleClient url=" + url)),
            catchError(selector)
        );
    }
}
