

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
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

    loadAllClients (selector: (err: any, caught: Observable<Client[]> ) => Observable<Client[]>): Observable<Client[]> {
        const url = `${clientUrl}/findAll`;
 
        return this.http.get<Client[]>(url).pipe(
              tap(_ => this.log(`fetched all tornei`))
            , catchError(selector)
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getClient(id: number, selector: (err: any, caught: Observable<Client> ) => Observable<Client>): Observable<Client> {
        const url = `${clientUrl}/find/${id}`;
        return this.http.get<Client>(url).pipe(
            tap(_ => this.log(`fetched Client id=${id}`)),
            catchError(selector)
        );
    }

    /** POST: add a new Client to the server */
    createClient (client: Client, selector: (err: any, caught: Observable<Client> ) => Observable<Client>): Observable<Client> {
        console.log(client);
        let url = clientUrl + "/insert";

        return this.http.post<Client>(url, client, httpOptions).pipe(
              tap((client: Client) => this.log(`added Client w/ id=${client.id}`))
            , catchError(selector)
        );
    }

    /** PUT: update the Client on the server */
    updateClient (client: Client, selector: (err: any, caught: Observable<Client> ) => Observable<Client> ): Observable<Client> {
        console.log(client);
        const url = clientUrl + "/update";
        
        return this.http.put(url, client, httpOptions).pipe(
            tap(_ => this.log(`updated Client id=${client.id}`)),
            catchError(selector)
        );
    }
    
    /** DELETE: delete the Client from the server */
    deleteClient (client: Client | number, selector: (err: any, caught: Observable<Client> ) => Observable<Client> ): Observable<Client> {
        console.log(client);
        const id = typeof client === 'number' ? client : client.id;
        const url = `${clientUrl}/delete/${id}`;

        return this.http.delete<Client>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Client id=${id}`)),
            catchError(selector)
        );
    }

    /** POST: to delete a Client from the server */
    postDeleteClient (client: Client, selector: (err: any, caught: Observable<Client> ) => Observable<Client>): Observable<Client> {
        console.log(client);
        let url = clientUrl + "/delete";

        return this.http.post<Client>(url, client, httpOptions).pipe(
              tap((client: Client) => this.log(`added Client w/ id=${client.id}`))
            , catchError(selector)
        );
    }
      
    /** Log a ClientService message with the MessageService */
    private log(message: string) {
        console.log('ClientService: ' + message);
    }
}
