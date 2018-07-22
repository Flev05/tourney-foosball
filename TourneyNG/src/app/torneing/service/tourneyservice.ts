import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Tourney } from '../domain/tourney';
import { Meeting } from '../domain/meeting';
import { Typology } from '../domain/typology';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const tourneyUrl = 'api/tourneys';  // URL to web api
const tourneyPlayoffUrl = 'api/tourneys';  // URL to web api
const tourneyEliminationUrl = 'api/tourneys';  // URL to web api
const typologiesUrl = 'api/typologies';  // URL to web api

@Injectable()
export class TourneyService {

    selectedTourney : Tourney;
    selectedMeeting : Meeting;

    tourneys: Tourney[];

    newTourney : boolean = false;

    firstTime : boolean = true;

    constructor(private http: HttpClient) { 
        console.log("Constructor of TourneyService");
    }

    loadTourneySmall (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(tourneyUrl)
        .pipe(
            tap(_ => this.log(`fetched all tourneys`)),
            catchError(this.handleError('loadTourneySmall', []))
          );
    }

    loadTypologies (): Observable<Typology[]> {
 
        return this.http.get<Typology[]>(typologiesUrl)
        .pipe(
            tap(_ => this.log(`fetched all typologies of the tourney`)),
            catchError(this.handleError('loadTypologies', []))
          );
    }

    loadTourneyPlayoff (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(tourneyPlayoffUrl)
        .pipe(
            tap(_ => this.log(`fetched all Playoff tourneys`)),
            catchError(this.handleError('loadTourneyPlayoff', []))
          );
    }

    loadTourneyElimination (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(tourneyEliminationUrl)
        .pipe(
            tap(_ => this.log(`fetched all Elimination tourneys`)),
            catchError(this.handleError('loadTourneyElimination', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getTourney(id: number): Observable<Tourney> {
        const url = `${tourneyUrl}/${id}`;
        return this.http.get<Tourney>(url).pipe(
            tap(_ => this.log(`fetched Tourney id=${id}`)),
            catchError(this.handleError<Tourney>(`getTourney id=${id}`))
        );
    }

    /** POST: add a new tourney to the server */
    addTourney (tourney: Tourney): Observable<Tourney> {
        return this.http.post<Tourney>(tourneyUrl, tourney, httpOptions).pipe(
            tap((tourney: Tourney) => this.log(`added Tourney w/ id=${tourney.id}`)),
            catchError(this.handleError<Tourney>('addTourney'))
        );
    }

    /** PUT: update the tourney on the server */
    updateTourney (tourney: Tourney ): Observable<Tourney> {
        const id =  tourney.id;
        const url = `${tourneyUrl}/${tourney.id}`;

        return this.http.put(url, tourney, httpOptions).pipe(
            tap(_ => this.log(`updated Tourney id=${id}`)),
            catchError(this.handleError<Tourney>('updateTourney'))
        );
    }
    
    /** DELETE: delete the tourney from the server */
    deleteTourney (tourney: Tourney | number): Observable<Tourney> {
        const id = typeof tourney === 'number' ? tourney : tourney.id;
        const url = `${tourneyUrl}/${id}`;

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
