import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of} from 'rxjs';
import { Location } from '@angular/common';
import { ClientVO } from '../../domain/client-vo';
import { ClientService } from '../../service/client-service';
import { TourneyService } from '../../service/tourney-service';
import { TableCols } from '../../domain/table-cols';
import { LoginService } from '../../service/login-service';
import { AbstractListView } from '../common/abstract-listview';
import { LoginDetailView } from './login-detailview';

@Component({
    templateUrl: './client-listview.html',
    standalone: false
})
export class ClientLoginListView extends AbstractListView {
    selectedClient: ClientVO = new ClientVO();
    clients: ClientVO[] = [];
    cols:  TableCols[] = ClientService.clientCols;
    
    onLoadClientError: boolean = false;
    loggedUsername: string = "";

    constructor(
        protected override tourneyService: TourneyService,
        public loginService  : LoginService,
        protected clientService : ClientService,
        protected override router        : Router,
        protected override location      : Location
    ) {
        super("", tourneyService, router, location);
    }

    override ngOnInit() {
        console.log("ClientListView.ngOnInit()");

        this.clientService.newClient = false;

        this.onLoadClientError = false;
        let loggedUserId = this.loginService.userLogged.id;
        this.loggedUsername = this.loginService.userLogged.username;

        // this.loginService.blockedDocument = true;

        const subsrciber = this.clientService.loadAllClients(loggedUserId, this.loadClientsErrorHandler('loadAllClients()'));
        subsrciber.subscribe(cs => this.onNext(cs), e => this.onError(e));
    }

    private onNext(clients: ClientVO[]): void {
        console.log("onNext()");
        this.clients = clients;
        this.clientService.clients = this.clients;
        this.clientService.setSelectClients(this.clients);
    }

    private loadClientsErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // this.loginService.blockedDocument = false;
            
            this.onLoadClientError = true;

            console.log(`${operation} failed!`);

            console.error(error); // log to console instead     
      
            return of(result as T);
        };
    }
 
    override onError(e:any) {
        console.log("onError()");
        console.log(e);
    }

    onRowSelect(event : any ) {
        console.log(event.data);
        // this.loginService.blockedDocument = true;
        const sc = this.clientService.selectedClients.find(c => c.id == this.selectedClient.id);
        if( sc == undefined ) return;
        this.clientService.setSelectedClient(sc);
        this.gotoListView();
    }
 
    private gotoListView() {
        this.clientService.newClient = false;
        if( this.loginService.isAtLeastAdmin() ) {
            this.router.navigate([LoginDetailView.redirectToAdminTourney]);
        } else {
            this.router.navigate([LoginDetailView.redirectToShowTourney]);
        }
    }
}
