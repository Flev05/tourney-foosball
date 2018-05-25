import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Client } from '../domain/client';
import { isUndefined } from 'util';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ClientService {
    private clientUrl = 'api/clients';  // URL to web api

    selectedClient : Client;

    newClient : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of ClientService");
    }

    loadClientSmall (): Observable<Client[]> {
 
        return this.http.get<Client[]>(this.clientUrl)
        .pipe(
            tap(_ => this.log(`fetched all tornei`)),
            catchError(this.handleError('loadClientSmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getClient(id: number): Observable<Client> {
        const url = `${this.clientUrl}/${id}`;
        return this.http.get<Client>(url).pipe(
            tap(_ => this.log(`fetched Client id=${id}`)),
            catchError(this.handleError<Client>(`getClient id=${id}`))
        );
    }

    /** POST: add a new torneo to the server */
    addClient (client: Client): Observable<Client> {
        return this.http.post<Client>(this.clientUrl, client, httpOptions).pipe(
            tap((client: Client) => this.log(`added Client w/ id=${client.id}`)),
            catchError(this.handleError<Client>('addClient'))
        );
    }

    /** PUT: update the torneo on the server */
    updateClient (client: Client ): Observable<Client> {
        const id =  client.id;
        const url = `${this.clientUrl}/${client.id}`;

        return this.http.put(url, client, httpOptions).pipe(
            tap(_ => this.log(`updated Client id=${id}`)),
            catchError(this.handleError<Client>('updateClient'))
        );
    }
    
    /** DELETE: delete the torneo from the server */
    deleteClient (client: Client | number): Observable<Client> {
        const id = typeof client === 'number' ? client : client.id;
        const url = `${this.clientUrl}/${id}`;

        return this.http.delete<Client>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Client id=${id}`)),
            catchError(this.handleError<Client>('deleteClient'))
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
      
    /** Log a ClientService message with the MessageService */
    private log(message: string) {
        console.log('ClientService: ' + message);
    }
}
