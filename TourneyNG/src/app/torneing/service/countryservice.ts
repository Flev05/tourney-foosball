import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Country } from '../domain/country';
import { isUndefined } from 'util';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CountryService {
    private countryUrl = 'api/countries';  // URL to web api

    selectedCountry : Country;

    newCountry : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of CountryService");
    }

    loadCountries (): Observable<Country[]> {
 
        return this.http.get<Country[]>(this.countryUrl)
        .pipe(
            tap(_ => this.log(`fetched all countries`)),
            catchError(this.handleError('loadCountries', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getCountry(id: number): Observable<Country> {
        const url = `${this.countryUrl}/${id}`;
        return this.http.get<Country>(url).pipe(
            tap(_ => this.log(`fetched Country id=${id}`)),
            catchError(this.handleError<Country>(`getCountry id=${id}`))
        );
    }

    /** POST: add a new torneo to the server */
    addCountry (country: Country): Observable<Country> {
        return this.http.post<Country>(this.countryUrl, country, httpOptions).pipe(
            tap((country: Country) => this.log(`added Country w/ id=${country.id}`)),
            catchError(this.handleError<Country>('addCountry'))
        );
    }

    /** PUT: update the torneo on the server */
    updateCountry (country: Country ): Observable<Country> {
        const id =  country.id;
        // const url = `${this.countryUrl}/${country.id}`;
        const url = `${this.countryUrl}`;

        console.log(country);

        return this.http.put(url, country, httpOptions).pipe(
            tap(_ => this.log(`updated Country id=${id}`)),
            catchError(this.handleError<Country>('updateCountry'))
        );
    }
    
    /** DELETE: delete the torneo from the server */
    deleteCountry (country: Country | number): Observable<Country> {
        const id = typeof country === 'number' ? country : country.id;
        const url = `${this.countryUrl}/${id}`;

        return this.http.delete<Country>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Country id=${id}`)),
            catchError(this.handleError<Country>('deleteCountry'))
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
      
    /** Log a CountryService message with the MessageService */
    private log(message: string) {
        console.log('CountryService: ' + message);
    }
}
