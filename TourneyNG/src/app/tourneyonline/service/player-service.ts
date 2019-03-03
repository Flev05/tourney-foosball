

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Player } from '../domain/player';
import { TableCols } from '../domain/table-cols';
import { LoginService } from './login-service';
import { ClientService } from './client-service';

const playerUrl = 'api/players';  
const loadPlayerByClientIdUrl = playerUrl + "/loadByClientId";
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
    
    static cols: TableCols[]  = [
        { field: 'playerName',   header: 'Nome' },
        { field: 'phoneNumber', header: 'Telefono' },
        { field: 'email',       header: 'Email' }
    ];

    constructor(private http: HttpClient, private loginService: LoginService, private clientService: ClientService) { 
        console.log("Constructor of PlayerService");
    }

    loadAllPlayers (): Observable<Player[]> {

        let url = loadPlayerByClientIdUrl + "/" + this.clientService.selectedClient.id;

        return this.http.get<Player[]>(url)
        .pipe(
            tap(_ => this.log(`fetched all players`)),
            catchError(this.handleError('loadAllPlayers', []))
          );
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
    private addPlayer (player: Player): Observable<Player> {
        const url = insertPlayerUrl;

        return this.http.post<Player>(url, player, httpOptions).pipe(
            tap((player: Player) => this.log(`added Player w/ id=${player.id}`)),
            catchError(this.handleError<Player>('addPlayer'))
        );
    }

    /** PUT: update the Player on the server */
    private updatePlayer (player: Player ): Observable<Player> {
        const url = updatePlayerUrl;
        
        console.log(url);

        return this.http.put(url, player, httpOptions).pipe(
            tap(_ => this.log(`updated Player url=` + url)),
            catchError(this.handleError<Player>('updatePlayer'))
        );
    }

    savePlayer(player: Player): Observable<Player> {
        if(player.id == null) {
            return this.addPlayer(player);
        }
        return this.updatePlayer(player);
    }
    
    /** DELETE: delete the Player from the server */
    deletePlayer (player: Player) : Observable<Player> {
        const id = player.id;
        const url = deletePlayerUrl + "/" + id;

        return this.http.delete<Player>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Player id=${id}`)),
            catchError(this.handleError<Player>('deletePlayer'))
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
