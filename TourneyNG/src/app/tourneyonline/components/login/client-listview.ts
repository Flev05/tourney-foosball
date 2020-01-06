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
        public loginService  : LoginService,
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

        this.loginService.blockedDocument = true;

        const subsrciber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subsrciber.subscribe(cs => this.onNext(cs), e => this.onError(e));
    }

    private onNext(clients: ClientVO[]): void {
        console.log("onNext()");

        this.clients = clients;
        
        this.clientService.setSelectClients(this.clients);

        this.loginService.blockedDocument = false;
    }

    private loadClientsErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.loginService.blockedDocument = false;
            
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

        this.loginService.blockedDocument = true;

        const sc = this.clientService.selectedClients.find(c => c.id == this.selectedClient.id);

        this.clientService.setSelectedClient(sc);

        this.gotoListView();
    }
 
    private gotoListView() {
        this.clientService.newClient = false;
        this.gotoDetailView();
    }
}
