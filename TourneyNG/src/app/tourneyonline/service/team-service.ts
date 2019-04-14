

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Team } from '../domain/team';
import { ClientService } from './client-service';
import { TableCols } from '../domain/table-cols';
import { TeamVO } from '../domain/team-vo';
import { LoginService } from './login-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const teamUrl = 'api/teams';
const loadTeamByClientIdUrl  = teamUrl +'/loadByClientId';
const loadTeamBySessionIdUrl = teamUrl +'/loadBySessionId';
const loadTeamUrl   = teamUrl +'/load';
const insertTeamUrl = teamUrl +'/insert';
const updateTeamUrl = teamUrl +'/update';
const deleteTeamUrl = teamUrl +'/delete';

@Injectable()
export class TeamService {

    selectedTeam : Team;
    newTeam : boolean = false;

    static cols: TableCols[] = [
        { field: 'teamName',   header: 'Nome' },
        { field: 'address',    header: 'Indirizzo' },
    ];
    teamPool: Team[] = [];
    teamPoolVO: TeamVO[] = [];
    isTeamsChanged: boolean;
    
    constructor(private http: HttpClient,  private clientService: ClientService, private loginService: LoginService) { 
        console.log("Constructor of TeamService");
    }

    loadAllTeams (complete: () => void): void {
 
        let url = loadTeamBySessionIdUrl;
        if(this.loginService.isUserLogged) {
            url = loadTeamByClientIdUrl + "/" + this.clientService.selectedClient.id;
        }

        let observer :  Observable<TeamVO[]>  = this.http.get<TeamVO[]>(url)
        .pipe(
            tap(_ => this.log(`fetched all teams`)),
            catchError(this.handleError('loadAllTeams', []))
        );

        observer.subscribe(t => this.teamPoolVO = t, e => this.onError(e), () => complete())
    }

    private onError(e: any): any {
        console.log("Entering onError()" + e);
    }

    /** GET hero by id. Will 404 if id not found */
    getTeam(id: number): Observable<Team> {
        const url = `${loadTeamUrl}/${id}`;

        return this.http.get<Team>(url).pipe(
            tap(_ => this.log(`fetched Team url=` + url)),
            catchError(this.handleError<Team>(`getTeam id=${id}`))
        );
    }

    /** POST: add a new Team to the server */
    private addTeam (team: TeamVO, selector: (err: any, caught: Observable<TeamVO> ) => Observable<TeamVO> ): Observable<TeamVO> {

        let url = insertTeamUrl;

        return this.http.post<TeamVO>(url, team, httpOptions).pipe(
            tap((team: TeamVO) => this.log(`added Team w/ id=${team.id}`)),
            catchError(selector)
        );
    }

    /** PUT: update the Team on the server */
    private updateTeam (team: TeamVO, selector: (err: any, caught: Observable<TeamVO> ) => Observable<TeamVO> ): Observable<TeamVO>  {
        let url = updateTeamUrl;
        
        console.log(team);

        return this.http.put(url, team, httpOptions).pipe(
            tap(_ => this.log(`updated Team id=${team.id}`)),
            catchError(selector)
        );
    }

    saveTeam (tvo: TeamVO , selector: (err: any, caught: Observable<TeamVO> ) => Observable<TeamVO> ): Observable<TeamVO> { 

        if(tvo.id == null) {
            return this.addTeam(tvo, selector);
        }
        return this.updateTeam(tvo, selector);
    }
    
    /** DELETE: delete the Team from the server */
    deleteTeam (team: Team , selector: (err: any, caught: Observable<Team> ) => Observable<Team>) : Observable<Team> {
        const id = team.id;
        let url = deleteTeamUrl + "/" + id;

        return this.http.delete<Team>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Team id=` + id)),
            catchError(selector)
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
