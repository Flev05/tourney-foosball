import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';
import { ClientVO } from 'app/tourneyonline/domain/client-vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { AbstractListView } from '../common/abstract-listview';

const redirect = '/admintourney';

@Component({
    templateUrl: './client-listview.html'
})
export class ClientLoginListView extends AbstractListView {

    selectedClient: ClientVO;

    clients: ClientVO[];

    cols:  TableCols[] = ClientService.clientCols;
    
    onLoadClientError: boolean;

    constructor(
        protected tourneyService: TourneyService,
        private   loginService  : LoginService,
        protected clientService : ClientService,
        protected router        : Router,
        protected location      : Location
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("ClientListView.ngOnInit()");
        this.clientService.newClient = false;

        this.onLoadClientError = false;
        let loggedUserId = this.loginService.userLogged.id;

        const subsrciber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subsrciber.subscribe(cs => this.clients = cs, e => this.onError(e), () => this.onComplete());
    }

    private onComplete(): void {
        console.log("onComplete()");

        this.clientService.setSelectClients(this.clients);
        
        if( this.clients.length == 1 ) {
            this.selectedClient = this.clients.length[0];
            this.gotoListView();
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
 
    onError(e:any) {
        console.log("onError()");
        console.log(e);
    }

    onRowSelect(event) {
        console.log(event.data);
        this.gotoListView();
    }
 
    private gotoListView() {
        this.clientService.setSelectedClient(this.selectedClient);
        this.clientService.newClient = false;
        this.gotoDetailView();
    }
}
