

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Player } from '../domain/player';
import { TableCols } from '../domain/table-cols';
import { LoginService } from './login-service';
import { ClientService } from './client-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const playerUrl = 'api/players';  // URL to web api

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

        let url = playerUrl;

        if(this.loginService.userLogged) {
            url = playerUrl + "?" + "clientId=" + this.clientService.selectedClient.id;
        }

        return this.http.get<Player[]>(url)
        .pipe(
            tap(_ => this.log(`fetched all players`)),
            catchError(this.handleError('loadAllPlayers', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getPlayer(id: number): Observable<Player> {
        const url = `${playerUrl}/${id}`;
        return this.http.get<Player>(url).pipe(
            tap(_ => this.log(`fetched Player id=${id}`)),
            catchError(this.handleError<Player>(`getPlayer id=${id}`))
        );
    }

    /** POST: add a new Player to the server */
    addPlayer (player: Player): Observable<Player> {
        return this.http.post<Player>(playerUrl, player, httpOptions).pipe(
            tap((player: Player) => this.log(`added Player w/ id=${player.id}`)),
            catchError(this.handleError<Player>('addPlayer'))
        );
    }

    /** PUT: update the Player on the server */
    updatePlayer (player: Player ): Observable<Player> {
        const url = `${playerUrl}`;
        
        console.log(player);

        return this.http.put(url, player, httpOptions).pipe(
            tap(_ => this.log(`updated Player id=${player.id}`)),
            catchError(this.handleError<Player>('updatePlayer'))
        );
    }
    
    /** DELETE: delete the Player from the server */
    deletePlayer (player: Player) : Observable<Player> {
        const id = player.id;
        const url = `${playerUrl}/${id}`;

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
