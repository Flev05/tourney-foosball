import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from '../../common/abstract-listview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { UserService } from 'app/tourneyonline/service/user-service';
import { LoginService } from 'app/tourneyonline/service/login-service';

const redirect = '/clients/dv';

@Component({
    templateUrl: './client-listview.html'
})
export class ClientListView extends AbstractListView {

    selectedClient: ClientVO;

    clients: ClientVO[];

    cols:  TableCols[] = ClientService.clientCols;
    
    onLoadClientError: boolean;
    onDeleteError: boolean;
    isUserDeveloper: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected userService   : UserService,
        private   loginService  : LoginService,
        protected clientService : ClientService,
        protected router        : Router,
        protected location      : Location
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("ClientListView.ngOnInit()");
        this.loginService.blockedDocument = false;
        this.clientService.newClient = false;

        this.onLoadClientError = false;
        let loggedUserId = this.loginService.userLogged.id;

        const subsrciber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subsrciber.subscribe(cs => this.clients = cs, e => this.onError(e), () => this.onComplete());
    }

    private onComplete(): void {
        console.log("onComplete()");
        this.isUserDeveloper = this.loginService.isDeveloper();

        if( this.clients.length == 1 ) {
            this.selectedClient = this.clients.length[0];
            this.onRowSelect(null);
        }
    }

    private loadClientsErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.onLoadClientError = true;

            console.log(`${operation} failed!`);

            console.error(error); // log to console instead     
      
            return of(result as T);
        };
    }

    create() {
        this.clientService.newClient = true;
        this.gotoDetailView();
    }
    
    doDelete(client: ClientVO) {
        console.log(client);
        this.selectedClient= client;
        let name =  client.businessName;
        let popup = 'Sicuro di voler rimuovere il cliente: [' + name + "]?";

        this.onDeleteError = false;
        if(confirm(popup)) {

            const subscr = this.clientService.deleteClient(this.selectedClient.id, this.deleteErrorHandler('postDeleteClient()'));

            subscr.subscribe(n => this.next(n), e => this.onError(e), () => this.onDeleteComplete());
        }
    }
    
    private onDeleteComplete(): void {
        console.log("onDeleteComplete()");

        let index: number = this.clients.indexOf(this.selectedClient);
        if(index > -1 ) {
            this.clients.splice(index, 1);
        }
    }

    private deleteErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onDeleteError = true;

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
      
            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);
      
            // Let the app keep running by returning an empty result.
          return of(result as T);
        };
    }

    next(n:any) {
        console.log("next()");
        console.log(n);
    }

    onError(e:any) {
        console.log("onError()");
        console.log(e);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.clientService.setSelectedClient(this.selectedClient);
        this.clientService.newClient = false;

        this.gotoDetailView();
    }
 
}
