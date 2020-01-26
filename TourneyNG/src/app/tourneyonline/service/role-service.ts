

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { RoleVO } from '../domain/role-vo';
import { Combobox } from '../domain/tourney-combobox';
import { ERoles } from '../domain/enumerations';

const roleUrl = 'api/roles';  // URL to web api
const loadRoleByUserId = roleUrl + "/loadAllRoles";
const findOperatorRoleByName = roleUrl + "findOperarorRoleByName";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RoleService {

    selectedRoleOption: Combobox;
    roleOptions: Combobox[];
    selectedRoles: RoleVO[];
    maxLoggedUserRole: ERoles;

    static roleCols = [
        { field: 'rolename',    header: 'Nome ruolo' },
        { field: 'description', header: 'Descrizione' },
    ];
    
    constructor(private http: HttpClient) 
    { 
        console.log("Constructor of RoleService");
    }
    
    public resolve(roleName : string) : ERoles {
        var asEnum : ERoles= <ERoles>ERoles[roleName];
        return asEnum;
    }

    getRoleVO( roleName : string ) : RoleVO {
        let found = this.selectedRoles.find(r => r.name == roleName);
        return found;
    }

    isDeveloper(): boolean {
        return this.maxLoggedUserRole == ERoles.DEVELOPER;
    }

    isUserDeveloper(roleName : string): boolean {
        var asEnum : ERoles = this.resolve(roleName);
        return asEnum == ERoles.DEVELOPER ? true : false;
    }

    isUserFollower(roleName : string): boolean {
        var asEnum : ERoles = this.resolve(roleName);
        return asEnum == ERoles.FOLLOWER ? true : false;
    }

    isAtLeastOwner(): boolean {
        return this.maxLoggedUserRole <= ERoles.OWNER;
    }

    isAtLeastAdmin(): boolean {
        return this.maxLoggedUserRole <= ERoles.ADMIN;
    }

    isOwner(): boolean {
        return this.maxLoggedUserRole == ERoles.OWNER;
    }

    isAdmin(): boolean {
        return this.maxLoggedUserRole == ERoles.ADMIN;
    }

    isOperator(): boolean {
        return this.maxLoggedUserRole == ERoles.OPERATOR;
    }

    isFollower(): boolean {
        return this.maxLoggedUserRole == ERoles.FOLLOWER;
    }

    setSelectRoles(roles: RoleVO[]): void {
        this.selectedRoles = roles.sort((r1,r2) => {
            if(r1.id < r2.id) {
                return -1;
            }
            if(r1.id > r2.id) {
                return 1;
            }
            return 0;
        });
        let rvo = roles[0];
        this.selectedRoleOption = {label: rvo.name, value: rvo.id};

        this.roleOptions = [];
        for(let r of roles) {
            this.roleOptions.push({label: r.name, value: r.id});
        }
        this.maxLoggedUserRole = <ERoles>ERoles[this.selectedRoles[0].name];
    }

    getNoFollowerRoleOptions() : Combobox[] {
        let opts : Combobox[] = [];
        for( let cb of this.roleOptions ) {
            if( this.isUserFollower(cb.label) ) {
                continue;
            }
            opts.push(cb);
        }
        return opts;
    }

    loadLowerRoles (loggedUserId : number, next: (value: RoleVO[]) => void): Observable<RoleVO[]> {
        let url = loadRoleByUserId + "/" + loggedUserId;

        let obs = this.http.get<RoleVO[]>(url, httpOptions)
        .pipe(tap(_ => this.log(`fetched all Roles`)), catchError(this.handleError('loadAllRoles', [])) );

        obs.subscribe(rs => this.next(rs, next));
        return obs;
    }

    private next(rs:  RoleVO[], next: (value: RoleVO[]) => void): void {
        this.selectedRoles = rs;
        next(rs);
    }

    findOperarorRoleByName (roleName : ERoles): Observable<RoleVO[]> {
 
        let url = findOperatorRoleByName + "/" + roleName;

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
