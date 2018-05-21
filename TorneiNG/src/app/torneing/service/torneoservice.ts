import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Torneo } from '../domain/torneo';
import { isUndefined } from 'util';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TorneoService {
    private torneoUrl = 'api/tornei';  // URL to web api

    selectedTorneo : Torneo;

    tornei: Torneo[];

    newTorneo : boolean = false;

    firstTime : boolean = true;

    constructor(private http: HttpClient) { 
        console.log("Constructor of TorneoService");
    }

    loadTorneoSmall (): Observable<Torneo[]> {
 
        return this.http.get<Torneo[]>(this.torneoUrl)
        .pipe(
            tap(_ => this.log(`fetched all tornei`)),
            catchError(this.handleError('loadTorneoSmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getTorneo(id: number): Observable<Torneo> {
        const url = `${this.torneoUrl}/${id}`;
        return this.http.get<Torneo>(url).pipe(
            tap(_ => this.log(`fetched Torneo id=${id}`)),
            catchError(this.handleError<Torneo>(`getTorneo id=${id}`))
        );
    }

    /** POST: add a new torneo to the server */
    addTorneo (torneo: Torneo): Observable<Torneo> {
        return this.http.post<Torneo>(this.torneoUrl, torneo, httpOptions).pipe(
            tap((torneo: Torneo) => this.log(`added Torneo w/ id=${torneo.id}`)),
            catchError(this.handleError<Torneo>('addTorneo'))
        );
    }

    /** PUT: update the torneo on the server */
    updateTorneo (torneo: Torneo ): Observable<Torneo> {
        const id =  torneo.id;
        const url = `${this.torneoUrl}/${torneo.id}`;

        return this.http.put(url, torneo, httpOptions).pipe(
            tap(_ => this.log(`updated Torneo id=${id}`)),
            catchError(this.handleError<Torneo>('updateTorneo'))
        );
    }
    
    /** DELETE: delete the torneo from the server */
    deleteTorneo (torneo: Torneo | number): Observable<Torneo> {
        const id = typeof torneo === 'number' ? torneo : torneo.id;
        const url = `${this.torneoUrl}/${id}`;

        return this.http.delete<Torneo>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Torneo id=${id}`)),
            catchError(this.handleError<Torneo>('deleteTorneo'))
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
      
    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log('TorneoService: ' + message);
    }

}
