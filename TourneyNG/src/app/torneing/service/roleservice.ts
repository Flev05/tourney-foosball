import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Role } from '../domain/role';
import { isUndefined } from 'util';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RoleService {
    private apiUrl = 'api/roles';  // URL to web api

    constructor(private http: HttpClient) { 
        console.log("Constructor of RoleService");
    }

    loadRolesSmall (): Observable<Role[]> {
 
        return this.http.get<Role[]>(this.apiUrl)
        .pipe(
            tap(_ => this.log(`fetched all Roles`)),
            catchError(this.handleError('loadRolesSmall', []))
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
