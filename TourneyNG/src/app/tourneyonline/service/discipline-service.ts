

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable  } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Discipline } from '../domain/discipline';
import { Combobox } from '../domain/tourney-combobox';

const disciplineUrl = 'api/disciplines';  
const loadDisciplineUrl = disciplineUrl + "/loadAll";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DisciplineService {

    selectedDiscipline : Discipline;

    newDiscipline : boolean = false;
    disciplineOptions : Combobox[];
    private disciplines: Discipline[];

    constructor(private http: HttpClient) { 
        console.log("Constructor of DisciplineService");
    }

    loadAllDisciplines ( complete?: () => void ): void {
        let url: string = loadDisciplineUrl;

        const obs = this.http.get<Discipline[]>(url).pipe(
            tap(_ => this.log(`fetched all disciplines`))
            , catchError(this.handleError('loadAllDisciplines failure', [])
            )
        );

        obs.subscribe(t => {this.disciplines = t}, (error) => this.onError(error), () => this.onLoadDisciplineComplete(complete));
    }
    
    private onError(msgerr:any): any {
        console.error(msgerr);
    }

    private onLoadDisciplineComplete(complete?: () => void) {
        this.disciplineOptions = [];
        for( let d of this.disciplines ) {
            let cb : Combobox = {label: d.name, value: d.id};
            this.disciplineOptions.push(cb);
        }
        complete != null ? complete() : console.log();
    }

    /** GET hero by id. Will 404 if id not found */
    getDiscipline(id: number): Observable<Discipline> {
        const url = `${disciplineUrl}/${id}`;
        return this.http.get<Discipline>(url).pipe(
            tap(_ => this.log(`fetched Discipline id=${id}`)),
            catchError(this.handleError<Discipline>(`getDiscipline id=${id}`))
        );
    }

    /** POST: add a new Discipline to the server */
    private addDiscipline (discipline: Discipline): Observable<Discipline> {
        return this.http.post<Discipline>(disciplineUrl, discipline, httpOptions).pipe(
            tap((discipline: Discipline) => this.log(`added Discipline w/ id=${discipline.id}`)),
            catchError(this.handleError<Discipline>('addDiscipline'))
        );
    }

    /** PUT: update the Discipline on the server */
    private updateDiscipline (discipline: Discipline ): Observable<Discipline> {
        const id =  discipline.id;
        // const url = `${disciplineUrl}/${discipline.id}`;
        const url = `${disciplineUrl}`;

        console.log(discipline);

        return this.http.put(url, discipline, httpOptions).pipe(
            tap(_ => this.log(`updated Discipline id=${id}`)),
            catchError(this.handleError<Discipline>('updateDiscipline'))
        );
    }

    saveDiscipline (discipline: Discipline ): Observable<Discipline> {
        if( discipline.name == null ) {
            return this.addDiscipline(discipline);
        }
        return this.updateDiscipline(discipline);
    }
    
    /** DELETE: delete the Discipline from the server */
    deleteDiscipline (discipline: Discipline | number): Observable<Discipline> {
        const id = typeof discipline === 'number' ? discipline : discipline.id;
        const url = `${disciplineUrl}/${id}`;

        return this.http.delete<Discipline>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Discipline id=${id}`)),
            catchError(this.handleError<Discipline>('deleteDiscipline'))
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
      
    /** Log a DisciplineService message with the MessageService */
    private log(message: string) {
        console.log('DisciplineService: ' + message);
    }
}
