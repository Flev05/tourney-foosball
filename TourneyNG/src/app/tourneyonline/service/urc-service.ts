

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
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

    loadUrcList (userId: number, selector: (err: any, caught: Observable<UserRoleClientVO[]> ) => Observable<UserRoleClientVO[]>): Observable<UserRoleClientVO[]> {
        const url = userUrl + "/findByUserId/" + userId;
        console.log(url);
        
        return this.http.get<UserRoleClientVO[]>(url).pipe(
            tap(_ => this.log("fetched all clients by user id: " + userId))
          , catchError(selector)
        );
    }
  
    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log('UserService: ' + message);
    }
}
