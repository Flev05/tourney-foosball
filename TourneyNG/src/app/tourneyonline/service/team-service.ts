

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
import { Tourney } from '../domain/tourney';
import { Meeting } from '../domain/meeting';

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
import { BehaviorSubject } from 'rxjs';
import { ETeamOperation } from '../domain/enumerations';
import { Player } from '../domain/player';
import { PlayerService } from './player-service';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    // 1. The private 'Source' (The Publisher)
    private teamSource = new BehaviorSubject<ETeamOperation>(null);

    // 2. The public 'Observable' (The Subscription)
    team$ = this.teamSource.asObservable();

    selectedTeam : Team;
    newTeam : boolean = false;
    readOnly: boolean = false;
    selectedTabIndex: number = 0; 
    storedTeamFilter: string = '';


    static cols: TableCols[] = [
        { field: 'teamName',    header: 'Nome' },
        { field: 'address',     header: 'Indirizzo' },
        { field: 'asd',         header: 'ASD' }
    ];
    teamPool: Team[] = [];
    // isTeamsChanged: any;
    onSaveTeamError: boolean;
    badRequest: boolean;
    teamAlreadyExists: boolean = false;
    isRoundAutoGen: string;
    tourneyTeams: boolean;
    
    constructor(private http: HttpClient
        , private clientService: ClientService
        , private playerService: PlayerService
        , private loginService: LoginService) { 
        console.log("Constructor of TeamService");
    }
    
    // 3. The Method to change the value
    // public onTeamOperationChange(teamData: ETeamOperation) {
    //     this.teamSource.next(teamData);
    // }

    loadAllTeams (complete?: () => void): void {
        let url = loadTeamBySessionIdUrl;
        if(this.loginService.isUserLogged) {
            url = loadTeamByClientIdUrl + "/" + this.clientService.selectedClient.id;
        }
        let observer :  Observable<TeamVO[]>  = this.http.get<TeamVO[]>(url)
        .pipe(
            tap(_ => this.log(`fetched all teams`)),
            catchError(this.handleError('loadAllTeams', []))
        );
        observer.subscribe(t => this.teamNext(t, complete), e => this.onError(e));
    }
    
    private teamNext(teamsVo: TeamVO[], complete?: () => void): void {
        this.teamPool = [];
        for( let pvo of teamsVo ) {
            let ppo: Team = JSON.parse(pvo.json);
            ppo.id = pvo.id;
            this.teamPool.push(ppo);
        }
        if( complete != null ) {
            complete();
        }
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

    private addUpdateTeam (tvo: TeamVO , selector: (err: any, caught: Observable<TeamVO> ) => Observable<TeamVO> ): Observable<TeamVO> { 
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

    static getTeamIdByName(t: Tourney, teamName: string): number {
        let team: Team = TeamService.getTeamByName(t, teamName);
        if( team != null ) {
            return team.id;
        }
        return 0;
    }

    static getTeamByName(t: Tourney, teamName: string): Team {
        let team: Team = t.teams.find(x => x.teamName == teamName);
        if( team != undefined ) {
            return team
        }
        return null;
    }

    static getTeamsByNames(st: Tourney, teamNames: string[]): Team[] {
        let teams: Team[] = [];
        for(let t of st.teams ) {
            let foundTeam = teamNames.find( x => x == t.teamName);
            if( foundTeam != undefined ) {
                teams.push(t);
            }
        }
        return teams;
    }

    public isTeamNameAlreadyExists(newTeam: Team) : boolean  {
        let found = this.teamPool.find( t => this.whereClause(t, newTeam) );
        return found == undefined ? false : true;
    }
    
    private whereClause(t: Team, newTeam: Team): boolean {
        if( newTeam.id == null ) {
            return t.teamName == newTeam.teamName;
        }
        return t.id != newTeam.id && t.teamName.toUpperCase() == newTeam.teamName.toUpperCase();
    }

    private isTourneyTeamAlreadyExists(tourney: Tourney, newTeam: Team) : boolean  {
        let found = tourney.teams.find( t => this.whereClause(t, newTeam) );
        return found == undefined ? false : true;
    }

    updateExistingTeam(selectedTeam : Team, complete: () => void) {
        this.selectedTeam = selectedTeam;
        this.selectedTeam.clientId = this.clientService.selectedClient == undefined ? null : this.clientService.selectedClient.id;
        this.selectedTeam.players = this.playerService.selectedPlayers;
        let tvo : TeamVO = {
            id: this.selectedTeam.id
            , teamName: this.selectedTeam.teamName
            , country: this.selectedTeam.country
            , clientId: this.selectedTeam.clientId
            , json: JSON.stringify(this.selectedTeam)
        };
        const subscriber = this.addUpdateTeam(tvo, this.saveTeamErrorHandler('Create team operation'));
        subscriber.subscribe(cs => this.newTeamNext(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete(complete));
    }

    saveTeam( selectedTeam : Team
            , newTeamName: string
            , message : string
            , complete?: () => void) 
    {    
        if( this.newTeam ) {
            let foundTeam = this.teamPool.find( t => t.teamName.toUpperCase() == newTeamName.toUpperCase() );
            if( foundTeam != undefined) {
                if(!confirm(message)) {
                    return;
                }
            }  
            selectedTeam.id = null;
        }
        selectedTeam.teamName = newTeamName;
        this.updateExistingTeam(selectedTeam, complete);
    } 

    public addMissingTeam(st: Team ): void {
        this.selectedTeam = st;
        this.teamPool.push(st);
        let tvo : TeamVO = {
            id: null
          , teamName: this.selectedTeam.teamName
          , country: this.selectedTeam.country
          , clientId: this.selectedTeam.clientId
          , json: JSON.stringify(this.selectedTeam)
        };

        const subscriber = this.addUpdateTeam(tvo, this.saveTeamErrorHandler('Create team operation'));
        subscriber.subscribe(cs => this.newTeamNext(cs), e => this.subscribeErrorHandler(e), () => {});
    }  

    private isTeamAlreadyExists(tourney: Tourney): boolean {
        this.teamAlreadyExists = false;
        if( this.isTeamNameAlreadyExists(this.selectedTeam) ) {
            this.teamAlreadyExists = true;
            return true;
        }
        if(tourney != undefined ) {
            if( this.isTourneyTeamAlreadyExists(tourney, this.selectedTeam) ) {
                this.teamAlreadyExists = true;
                return true;
            }
        }
        return false;
    }

    public updateInternalTeams(tourney: Tourney, teamName : string) : void {
        console.log('Entering updateInternalTeams()');
        if(tourney != undefined && tourney != null)   {
            if(this.newTeam) {
                let index = tourney.teams.findIndex( e => e.teamName === teamName);
                if(index === -1) {
                    tourney.teams.push(this.selectedTeam);
                }
            }
            var team : Team = null;
            for(let t of tourney.teams) {
                if(t.teamName == teamName) {
                    team = t;
                    break;
                }
            }
            if(team != null) {
                team.teamName = teamName;
                team.address = this.selectedTeam.address
                team.country = this.selectedTeam.country
                team.players = this.selectedTeam.players;
            }
        }
    }

    private newTeamNext(tvo: TeamVO) {
        console.log("newTeamNext()");
        console.log(tvo);
        this.selectedTeam.id = tvo.id;
    }
    
    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");

            this.onSaveTeamError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

    private saveTeamErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveTeamErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveTeamError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            return of(result as T);
        };
    }
    
    private onSaveComplete(complete?: () => void) {
        console.log("Entering onSaveComplete()");
        if( !this.onSaveTeamError ) {
            if(this.newTeam) {
                this.teamPool.push(this.selectedTeam);
            }
        }
        // this.newTeam = false;
        // this.isTeamsChanged = true;
        complete();
    }

    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    public filterTeam(query, teams: Team[]) : string[] {
        let filtered : string[] = [];
        for(let i = 0; i < teams.length; i++) {
            let t = teams[i];
            if(t.teamName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(t.teamName);
            }
        }
        return filtered;
    }

    public setMeetingAddress(onewayMeetings: Meeting[], roundtripMeetings: Meeting[]) {
        for (let m of onewayMeetings) {
            let t = this.teamPool.find(e => e.teamName === m.teamName1);
            if (t == undefined || t.country == undefined) {
                m.address = "";
                continue;
            }
            m.address = t.address + " - " + t.country.zipCode + " " + t.country.city + " (" + t.country.provinceCode + ")";
        }
        for (let m of roundtripMeetings) {
            let t = this.teamPool.find(e => e.teamName === m.teamName1);
            if (t == undefined || t.country == undefined) {
                m.address = "";
                continue;
            }
            m.address = t.address + " - " + t.country.zipCode + " " + t.country.city + " (" + t.country.provinceCode + ")";
        }
    }
}
