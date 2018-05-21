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
    private clientsUrl = 'api/clients';  // URL to web api

    selectedCompany : Company;

    newCompany : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of CompanyService");
    }

    loadCompanySmall (): Observable<Company[]> {
 
        return this.http.get<Company[]>(this.clientsUrl)
        .pipe(
            tap(_ => this.log(`fetched all tornei`)),
            catchError(this.handleError('loadCompanySmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getCompany(id: number): Observable<Company> {
        const url = `${this.clientsUrl}/${id}`;
        return this.http.get<Company>(url).pipe(
            tap(_ => this.log(`fetched Company id=${id}`)),
            catchError(this.handleError<Company>(`getCompany id=${id}`))
        );
    }

    /** POST: add a new torneo to the server */
    addCompany (company: Company): Observable<Company> {
        return this.http.post<Company>(this.clientsUrl, company, httpOptions).pipe(
            tap((company: Company) => this.log(`added Company w/ id=${company.id}`)),
            catchError(this.handleError<Company>('addCompany'))
        );
    }

    /** PUT: update the torneo on the server */
    updateCompany (company: Company ): Observable<Company> {
        const id =  company.id;
        const url = `${this.clientsUrl}/${company.id}`;

        return this.http.put(url, company, httpOptions).pipe(
            tap(_ => this.log(`updated Company id=${id}`)),
            catchError(this.handleError<Company>('updateCompany'))
        );
    }
    
    /** DELETE: delete the torneo from the server */
    deleteCompany (company: Company | number): Observable<Company> {
        const id = typeof company === 'number' ? company : company.id;
        const url = `${this.clientsUrl}/${id}`;

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
      
    /** Log a CompanyService message with the MessageService */
    private log(message: string) {
        console.log('CompanyService: ' + message);
    }
}
