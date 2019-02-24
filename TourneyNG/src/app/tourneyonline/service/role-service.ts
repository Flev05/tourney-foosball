

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { RoleVO } from '../domain/role-vo';
import { Combobox } from '../domain/tourney-combobox';
import { LoginService } from './login-service';
import { Roles } from '../domain/enumerations';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RoleService {
    private apiUrl = 'api/roles';  // URL to web api

    selectedRoleOption: Combobox;
    roleOptions: Combobox[];
    selectedRoles: RoleVO[];

    static roleCols = [
        { field: 'rolename',    header: 'Nome ruolo' },
        { field: 'description', header: 'Descrizione' },
    ];
    
    constructor(private http: HttpClient
        , private loginService: LoginService) 
    { 
        console.log("Constructor of RoleService");
    }

    isAdmin(): boolean {
        if(!this.loginService.userLogged) {
            return true;
        }
        for(let r of this.selectedRoles) {
            if(r.name==Roles.Developer || r.name == Roles.Owner || r.name == Roles.Admin) {
                return true;
            }
        }
        return false;
    }

    isOwner(): boolean {
        for(let r of this.selectedRoles) {
            if(r.name==Roles.Developer || r.name == Roles.Owner) {
                return true;
            }
        }
        return false;
    }

    isDeveloper(): boolean {
        for(let r of this.selectedRoles) {
            if(r.name==Roles.Developer) {
                return true;
            }
        }
        return false;
    }

    isOperator(): boolean {
        for(let r of this.selectedRoles) {
            if(r.name==Roles.Operator) {
                return true;
            }
        }
        return false;
    }

    setSelectRoles(roles: RoleVO[]): any {
        this.selectedRoles = roles;
        let rvo = roles[0];
        this.selectedRoleOption = {label: rvo.name, value: rvo.id};

        this.roleOptions = [];
        for(let r of roles) {
            this.roleOptions.push({label: r.name, value: r.id});
        }
    }

    loadAllRoles (): Observable<RoleVO[]> {
 
        let url = this.apiUrl + "/" + "findAllRoles";

        return this.http.get<RoleVO[]>(url, httpOptions)
        .pipe(
            tap(_ => this.log(`fetched all Roles`)),
            catchError(this.handleError('loadAllRoles', []))
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
      
    /** Log a RoleService message with the MessageService */
    private log(message: string) {
        console.log('RoleService: ' + message);
    }
}
