

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Client } from '../domain/client';
import { Combobox } from '../domain/tourney-combobox';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const clientUrl = 'api/clients';  // URL to web api

@Injectable()
export class ClientService {

    selectedClientOption : Combobox;
    clientOptions : Combobox[];
    selectedClients : Client[];
    selectedClient : Client;

    newClient : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of ClientService");
    }

    setSelectClients(clients: Client[]): any {
        this.selectedClients = clients;

        this.selectedClient = clients[0];
        this.selectedClientOption = {label: this.selectedClient.businessName, value: this.selectedClient.id};
        this.clientOptions = [];

        for(let c of clients ) {
            this.clientOptions.push({label: c.businessName, value: c.id});
        }
    }

    loadAllClients (): Observable<Client[]> {
        const url = `${clientUrl}/findAll`;
 
        return this.http.get<Client[]>(url)
        .pipe(
            tap(_ => this.log(`fetched all tornei`)),
            catchError(this.handleError('loadClientSmall', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getClient(id: number): Observable<Client> {
        const url = `${clientUrl}/find/${id}`;
        return this.http.get<Client>(url).pipe(
            tap(_ => this.log(`fetched Client id=${id}`)),
            catchError(this.handleError<Client>(`getClient id=${id}`))
        );
    }

    /** POST: add a new Client to the server */
    addClient (client: Client): Observable<Client> {
        let url = clientUrl + "/insert";

        return this.http.post<Client>(url, client, httpOptions).pipe(
            tap((client: Client) => this.log(`added Client w/ id=${client.id}`)),
            catchError(this.handleError<Client>('addClient'))
        );
    }

    /** PUT: update the Client on the server */
    updateClient (client: Client ): Observable<Client> {
        const url = clientUrl + "/update";
        
        console.log(client);

        return this.http.put(url, client, httpOptions).pipe(
            tap(_ => this.log(`updated Client id=${client.id}`)),
            catchError(this.handleError<Client>('updateClient'))
        );
    }
    
    /** DELETE: delete the Client from the server */
    deleteClient (client: Client | number): Observable<Client> {
        const id = typeof client === 'number' ? client : client.id;
        const url = `${clientUrl}/delete/${id}`;

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
