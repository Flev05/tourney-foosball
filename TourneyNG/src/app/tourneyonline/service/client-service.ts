

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ClientVO } from '../domain/client-vo';
import { Combobox } from '../domain/tourney-combobox';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const clientUrl = 'api/clients';  // URL to web api

@Injectable()
export class ClientService {

    selectedClientOption : Combobox;
    clientOptions : Combobox[];
    selectedClients : ClientVO[];
    selectedClient : ClientVO;

    newClient : boolean = false;

    constructor(private http: HttpClient) { 
        console.log("Constructor of ClientService");
    }

    setSelectClients(clients: ClientVO[]): any {
        this.selectedClients = clients;

        this.selectedClient = clients[0];
        this.selectedClientOption = {label: this.selectedClient.businessName, value: this.selectedClient.id};
        this.clientOptions = [];

        for(let c of clients ) {
            this.clientOptions.push({label: c.businessName, value: c.id});
        }
    }

    loadAllClients (userId: number, selector: (err: any, caught: Observable<ClientVO[]> ) => Observable<ClientVO[]>): Observable<ClientVO[]> {
        const url = clientUrl + "/findByUserId/" + userId;
        console.log(url);
 
        return this.http.get<ClientVO[]>(url).pipe(
              tap(_ => this.log("fetched all clients by user id: " + userId))
            , catchError(selector)
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getClient(id: number, selector: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO>): Observable<ClientVO> {
        const url = `${clientUrl}/find/${id}`;
        console.log(url);
        return this.http.get<ClientVO>(url).pipe(
            tap(_ => this.log(`fetched Client id=${id}`)),
            catchError(selector)
        );
    }

    /** POST: add a new Client to the server */
    private createClient (client: ClientVO, selector: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO>): Observable<ClientVO> {
        let url = clientUrl + "/insert";
        console.log(url);

        return this.http.post<ClientVO>(url, client, httpOptions).pipe(
              tap((client: ClientVO) => this.log(`added Client w/ id=${client.id}`))
            , catchError(selector)
        );
    }

    /** PUT: update the Client on the server */
    private updateClient (client: ClientVO, selector: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO> ): Observable<ClientVO> {
        const url = clientUrl + "/update";
        console.log(url);
        
        return this.http.put(url, client, httpOptions).pipe(
            tap(_ => this.log(`updated Client id=${client.id}`)),
            catchError(selector)
        );
    }
    
    saveClient (client: ClientVO, selector: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO> ): Observable<ClientVO> {
        if(client.id == null) {
            return this.createClient(client, selector);
        }
        return this.updateClient(client, selector);
    }
      
    /** DELETE: delete the Client from the server */
    deleteClient (clientId: number, selector: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO> ): Observable<ClientVO> {
        const id = clientId;
        const url = `${clientUrl}/delete/${id}`;
        console.log(url);

        return this.http.delete<ClientVO>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Client id=${id}`)),
            catchError(selector)
        );
    }
      
    /** Log a ClientService message with the MessageService */
    private log(message: any) {
        console.log('ClientService: ' + message);
    }
}
