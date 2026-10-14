

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ClientVO } from '../domain/client-vo';
import { Combobox } from '../domain/tourney-combobox';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const clientUrl = 'api/clients';   
const loadClientByUserIDUrl = clientUrl   + '/loadByUserId';   
const loadClientUrl = clientUrl   + '/load';   
const insertClientUrl = clientUrl + '/insert';   
const updateClientUrl = clientUrl + '/update';   
const deleteClientUrl = clientUrl + '/delete';   

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    selectedClientOption : Combobox = {label:"", value: 0};
    clientOptions : Combobox[] = [];
    selectedClients : ClientVO[] = [];
    clients: ClientVO[] = [];
    selectedClient : ClientVO = new ClientVO();
    selectedClientName: string = "";
    newClient : boolean = false;
    
    static clientCols = [
        { field: 'businessName', header: 'Nominativo' },
        { field: 'phoneNumber',  header: 'Telefono' }
    ];

    constructor(private http: HttpClient) { 
        console.log("Constructor of ClientService");
    }

    setSelectedClient(cvo : ClientVO) {
        this.selectedClient = cvo;
        this.selectedClientName = "" + cvo.businessName;
        if( cvo.id != null ) {
            this.selectedClientOption = {label: ""+ cvo.businessName, value: cvo.id};
        }        
        this.clientOptions = [];
        for(let c of this.selectedClients ) {
            if( c.id != null ) {
                this.clientOptions.push({label: "" + c.businessName, value: c.id});
            }        
        }
    }

    setSelectClients(clients: ClientVO[]): any {
        this.selectedClients = clients;
        this.setSelectedClient(clients[0]);
    }

    loadAllClients (userId: number, selector: (err: any, caught: Observable<ClientVO[]> ) => Observable<ClientVO[]>): Observable<ClientVO[]> {
        const url = loadClientByUserIDUrl +  "/" + userId;
        console.log(url);
 
        return this.http.get<ClientVO[]>(url).pipe(
              tap(_ => this.log("fetched all clients by user id: " + userId))
            , catchError(selector)
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getClient(clientId: number, error: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO>): Observable<ClientVO> {
        const url = `${loadClientUrl}/${clientId}`;
        console.log(url);
        return this.http.get<ClientVO>(url).pipe(
            tap(_ => this.log(`fetched Client url=` + url)),
            catchError(error)
        );
    }

    /** POST: add a new Client to the server */
    private createClient (client: ClientVO, error: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO>): Observable<ClientVO> {
        let url = insertClientUrl;
        console.log(url);

        return this.http.post<ClientVO>(url, client, httpOptions).pipe(
              tap((client: ClientVO) => this.log(`added Client w/ id=${client.id}`))
            , catchError(error)
        );
    }

    /** PUT: update the Client on the server */
    private updateClient (client: ClientVO, error: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO> ): Observable<ClientVO> {
        const url = updateClientUrl;
        console.log(url);
        const oo : Observable<ClientVO> = this.http.put<ClientVO>(url, client, httpOptions);
        return oo.pipe(
            tap(_ => this.log(`updated Client id=` + client.id)),
            catchError(error)
        );
    }
    
    saveClient (client: ClientVO, selector: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO> ): Observable<ClientVO> {
        if(client.id == null) {
            return this.createClient(client, selector);
        }
        return this.updateClient(client, selector);
    }
      
    /** DELETE: delete the Client from the server */
    deleteClient (clientId: number, error: (err: any, caught: Observable<ClientVO> ) => Observable<ClientVO> ): Observable<ClientVO> {
        const id = clientId;
        const url = `${deleteClientUrl}/${id}`;
        console.log(url);

        return this.http.delete<ClientVO>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted Client id=${id}`)),
            catchError(error)
        );
    }
      
    /** Log a ClientService message with the MessageService */
    private log(message: any) {
        console.log('ClientService: ' + message);
    }
}
