import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Company } from '../domain/company';
import { isUndefined } from 'util';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CompanyService {
    private torneoUrl = 'api/tornei';  // URL to web api

    selectedCompany : Company;

    tornei: Company[];

    newCompany : boolean = false;

    firstTime : boolean = true;

    constructor(private http: HttpClient) { 
        console.log("Constructor of CompanyService");
    }

    loadCompanySmall (): Observable<Company[]> {
 
        return this.http.get<Company[]>(this.torneoUrl)
        .pipe(
            tap(_ => this.log(`fetched all tornei`)),
            catchError(this.handleError('loadCompanySmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getCompany(id: number): Observable<Company> {
        const url = `${this.torneoUrl}/${id}`;
        return this.http.get<Company>(url).pipe(
            tap(_ => this.log(`fetched Company id=${id}`)),
            catchError(this.handleError<Company>(`getCompany id=${id}`))
        );
    }

    /** POST: add a new torneo to the server */
    addCompany (torneo: Company): Observable<Company> {
        return this.http.post<Company>(this.torneoUrl, torneo, httpOptions).pipe(
            tap((torneo: Company) => this.log(`added Company w/ id=${torneo.id}`)),
            catchError(this.handleError<Company>('addCompany'))
        );
    }

    /** PUT: update the torneo on the server */
    updateCompany (torneo: Company ): Observable<Company> {
        const id =  torneo.id;
        const url = `${this.torneoUrl}/${torneo.id}`;

        return this.http.put(url, torneo, httpOptions).pipe(
            tap(_ => this.log(`updated Company id=${id}`)),
            catchError(this.handleError<Company>('updateCompany'))
        );
    }
    
    /** DELETE: delete the torneo from the server */
    deleteCompany (torneo: Company | number): Observable<Company> {
        const id = typeof torneo === 'number' ? torneo : torneo.id;
        const url = `${this.torneoUrl}/${id}`;

        return this.http.delete<Company>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Company id=${id}`)),
            catchError(this.handleError<Company>('deleteClient'))
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
        console.log('ClientService: ' + message);
    }
    
    // getCarsSmall() {
    //     return this.http.get<any>('assets/showcase/data/tornei-small.json')
    //       .toPromise()
    //       .then(res => <Company[]>res.data)
    //       .then(data => { return data; });
    //   }
  
    //   getCarsMedium() {
    //     return this.http.get<any>('assets/showcase/data/tornei-medium.json')
    //       .toPromise()
    //       .then(res => <Company[]>res.data)
    //       .then(data => { return data; });
    //   }
  
    //     getCarsLarge() {
    //   return this.http.get<any>('assets/showcase/data/tornei-large.json')
    //     .toPromise()
    //     .then(res => <Company[]>res.data)
    //     .then(data => { return data; });
    // }

    // getCarsHuge() {
    //   return this.http.get<any>('assets/showcase/data/tornei-huge.json')
    //     .toPromise()
    //     .then(res => <Company[]>res.data)
    //     .then(data => { return data; });
    // }
}
