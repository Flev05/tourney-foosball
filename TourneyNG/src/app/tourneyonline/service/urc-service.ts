

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
    urcList: UserRoleClientVO[];

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
      
    saveUrc (urc: UserRoleClientVO, selector: (err: any, caught: Observable<UserRoleClientVO> ) => Observable<UserRoleClientVO> ): Observable<UserRoleClientVO> {
        let userId = urc.id;
        if(userId == null) {
            return this.createUrc(urc, selector);
        }
        return this.updateUrc(urc, selector);
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log('UrcService: ' + message);
    }

    /** POST: add a new User to the server */
    public createUrc (urc: UserRoleClientVO, selector: (err: any, caught: Observable<UserRoleClientVO> ) => Observable<UserRoleClientVO> ): Observable<UserRoleClientVO> {
        let url = userUrl + "/insert";
        console.log(url);

        return this.http.post<UserRoleClientVO>(url, urc, httpOptions).pipe(
                tap((urc: UserRoleClientVO) => this.log(`added User w/ url=` + urc))
            , catchError(selector)
        );
    }

    /** POST: add a new User to the server */
    public insertUrcOperator (urc: UserRoleClientVO, selector: (err: any, caught: Observable<UserRoleClientVO> ) => Observable<UserRoleClientVO> ): Observable<UserRoleClientVO> {
        let url = userUrl + "/insertUrcOperator";
        console.log(url);

        return this.http.post<UserRoleClientVO>(url, urc, httpOptions).pipe(
                tap((urc: UserRoleClientVO) => this.log(`insertUrcOperator w/ url=` + urc))
            , catchError(selector)
        );
    }

    /** PUT: update the User on the server */
    private updateUrc (urc: UserRoleClientVO, selector: (err: any, caught: Observable<UserRoleClientVO> ) => Observable<UserRoleClientVO> ): Observable<UserRoleClientVO>{
        const url = userUrl + "/update";
        console.log(url);
        
        return this.http.put(url, urc, httpOptions).pipe(
            tap(urc => this.log(`updated User id=` + url)),
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
