

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Player } from '../domain/player';
import { TableCols } from '../domain/table-cols';
import { ClientService } from './client-service';
import { PlayerVO } from '../domain/player-vo';
import { LoginService } from './login-service';

const playerUrl = 'api/players';  
const loadPlayerByClientIdUrl  = playerUrl + "/loadByClientId";
const loadPlayerBySessionIdUrl = playerUrl + '/loadBySessionId';  

const loadPlayerUrl = playerUrl + "/load";
const insertPlayerUrl = playerUrl + "/insert";
const updatePlayerUrl = playerUrl + "/update";
const deletePlayerUrl = playerUrl + "/delete";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PlayerService {
    playerPool: Player[];
    selectedPlayer : Player;
    newPlayer : boolean = false;
    readOnly : boolean = false;
    storedPlayerFilter: string = '';
    selectedPlayers: Player[] = [];
    
    static cols: TableCols[]  = [
        { field: 'playerName',  header: 'Nome' },
        { field: 'code',        header: 'Tessera' },
        { field: 'phoneNumber', header: 'Telefono' },
        { field: 'email',       header: 'Email' }
    ];

    constructor(private http: HttpClient, private clientService: ClientService, private loginService: LoginService) { 
        console.log("Constructor of PlayerService");
    }

    loadAllPlayers( complete?: () => void ): void {

        let url = loadPlayerBySessionIdUrl;

        if(this.loginService.isUserLogged) {
            url = loadPlayerByClientIdUrl + "/" + this.clientService.selectedClient.id;
        }

        let observer : Observable<PlayerVO[]> =  this.http.get<PlayerVO[]>(url)
        .pipe(
            tap(_ => this.log(`fetched all players`)),
            catchError(this.handleError('loadAllPlayers', []))
        );

        observer.subscribe(p => this.loadPlayerNext(p, complete), e => this.onError(e) );
    }

    private loadPlayerNext(players : PlayerVO[], complete: () => void ): any {
        console.log("Entering onLoadPlayersComplete()");
        this.playerPool = [];
        for( let pvo of players ) {
            let ppo: Player = JSON.parse(pvo.json);
            ppo.id = pvo.id;
            ppo.country = pvo.country;
            ppo.clientId = pvo.clientId;
            ppo.playerName = pvo.playerName;
            this.playerPool.push(ppo);
        }
        if( complete != null ) {
            complete();
        }
    }

    private onError(e: any): any {
        console.log("Entering onError()" + e);
    }

    /** GET hero by id. Will 404 if id not found */
    getPlayer(playerId: number): Observable<Player> {
        let url = loadPlayerUrl + "/" + playerId;

        return this.http.get<Player>(url).pipe(
            tap(_ => this.log(`fetched Player url` + url)),
            catchError(this.handleError<Player>(`getPlayer id=` + playerId))
        );
    }

    /** POST: add a new Player to the server */
    private addPlayer (player: PlayerVO, selector: (err: any, caught: Observable<PlayerVO> ) => Observable<PlayerVO> ): Observable<PlayerVO> {
        const url = insertPlayerUrl;

        return this.http.post<PlayerVO>(url, player, httpOptions).pipe(
            tap((player: PlayerVO) => this.log(`added Player w/ id=${player.id}`)),
            catchError(selector)
        );
    }

    /** PUT: update the Player on the server */
    private updatePlayer (player: PlayerVO, selector: (err: any, caught: Observable<PlayerVO> ) => Observable<PlayerVO> ): Observable<PlayerVO> {
        const url = updatePlayerUrl;
        
        console.log(url);

        return this.http.put(url, player, httpOptions).pipe(
            tap(_ => this.log(`updated Player url=` + url)),
            catchError(selector)
        );
    }
    
    savePlayer(pvo: PlayerVO, selector: (err: any, caught: Observable<PlayerVO> ) => Observable<PlayerVO> ): Observable<PlayerVO> {
        
        if(pvo.id == null) {
            return this.addPlayer(pvo, selector);
        }
        return this.updatePlayer(pvo, selector);
    }
    
    /** DELETE: delete the Player from the server */
    deletePlayer (player: Player, selector: (err: any, caught: Observable<Player> ) => Observable<Player> ) : Observable<Player> {
        const id = player.id;
        const url = deletePlayerUrl + "/" + id;

        return this.http.delete<Player>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Player id=${id}`)),
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
      
    /** Log a PlayerService message with the MessageService */
    private log(message: string) {
        console.log('PlayerService: ' + message);
    }
}
