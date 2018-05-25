import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Tourney } from '../domain/tourney';
import { isUndefined } from 'util';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TourneyService {
    private torneoUrl = 'api/tourneys';  // URL to web api

    selectedTourney : Tourney;

    tourneys: Tourney[];

    newTourney : boolean = false;

    firstTime : boolean = true;

    constructor(private http: HttpClient) { 
        console.log("Constructor of TourneyService");
    }

    loadTourneySmall (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(this.torneoUrl)
        .pipe(
            tap(_ => this.log(`fetched all tourneys`)),
            catchError(this.handleError('loadTourneySmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getTourney(id: number): Observable<Tourney> {
        const url = `${this.torneoUrl}/${id}`;
        return this.http.get<Tourney>(url).pipe(
            tap(_ => this.log(`fetched Tourney id=${id}`)),
            catchError(this.handleError<Tourney>(`getTourney id=${id}`))
        );
    }

    /** POST: add a new torneo to the server */
    addTourney (torneo: Tourney): Observable<Tourney> {
        return this.http.post<Tourney>(this.torneoUrl, torneo, httpOptions).pipe(
            tap((torneo: Tourney) => this.log(`added Tourney w/ id=${torneo.id}`)),
            catchError(this.handleError<Tourney>('addTourney'))
        );
    }

    /** PUT: update the torneo on the server */
    updateTourney (torneo: Tourney ): Observable<Tourney> {
        const id =  torneo.id;
        const url = `${this.torneoUrl}/${torneo.id}`;

        return this.http.put(url, torneo, httpOptions).pipe(
            tap(_ => this.log(`updated Tourney id=${id}`)),
            catchError(this.handleError<Tourney>('updateTourney'))
        );
    }
    
    /** DELETE: delete the torneo from the server */
    deleteTourney (torneo: Tourney | number): Observable<Tourney> {
        const id = typeof torneo === 'number' ? torneo : torneo.id;
        const url = `${this.torneoUrl}/${id}`;

        return this.http.delete<Tourney>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Tourney id=${id}`)),
            catchError(this.handleError<Tourney>('deleteTourney'))
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
        console.log('TourneyService: ' + message);
    }

}
