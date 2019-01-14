

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Team } from '../domain/team';
import { LoginService } from './login-service';
import { ClientService } from './client-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const clientUrl = 'api/teams';  // URL to web api

@Injectable()
export class TeamService {

    selectedTeam : Team;

    newTeam : boolean = false;

    static cols = [
        { field: 'teamName',   header: 'Nome' },
        { field: 'address',    header: 'Indirizzo' },
    ];

    constructor(private http: HttpClient, private loginService: LoginService, private clientService: ClientService) { 
        console.log("Constructor of TeamService");
    }

    loadAllTeams (): Observable<Team[]> {
 
        let url = clientUrl;

        if(this.loginService.userLogged) {
            url = clientUrl + "?" + "clientId=" + this.clientService.selectedClient.id;
        }

        return this.http.get<Team[]>(url)
        .pipe(
            tap(_ => this.log(`fetched all teams`)),
            catchError(this.handleError('loadAllTeams', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getTeam(id: number): Observable<Team> {
        const url = `${clientUrl}/${id}`;
        return this.http.get<Team>(url).pipe(
            tap(_ => this.log(`fetched Team id=${id}`)),
            catchError(this.handleError<Team>(`getTeam id=${id}`))
        );
    }

    /** POST: add a new Team to the server */
    addTeam (team: Team): Observable<Team> {
        return this.http.post<Team>(clientUrl, team, httpOptions).pipe(
            tap((team: Team) => this.log(`added Team w/ id=${team.id}`)),
            catchError(this.handleError<Team>('addTeam'))
        );
    }

    /** PUT: update the Team on the server */
    updateTeam (team: Team ): Observable<Team> {
        const url = `${clientUrl}`;
        
        console.log(team);

        return this.http.put(url, team, httpOptions).pipe(
            tap(_ => this.log(`updated Team id=${team.id}`)),
            catchError(this.handleError<Team>('updateTeam'))
        );
    }
    
    /** DELETE: delete the Team from the server */
    deleteTeam (team: Team) : Observable<Team> {
        const id = team.id;
        const url = `${clientUrl}/${id}`;

        return this.http.delete<Team>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Team id=${id}`)),
            catchError(this.handleError<Team>('deleteTeam'))
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
      
    /** Log a TeamService message with the MessageService */
    private log(message: string) {
        console.log('TeamService: ' + message);
    }
}
