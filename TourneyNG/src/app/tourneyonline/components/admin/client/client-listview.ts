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
import { LoginService } from 'app/tourneyonline/service/login-service';
import { UserService } from 'app/tourneyonline/service/user-service';

const redirect = '/clients/dv';

@Component({
    templateUrl: './client-listview.html'
})
export class ClientListView extends AbstractListView {

    selectedClient: ClientVO;

    clients: ClientVO[];

    cols:  TableCols[] ;
    onLoadClientError: boolean;
    onDeleteError: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected userService   : UserService,
        protected clientService : ClientService,
        protected router        : Router,
        protected location      : Location
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("ClientListView.ngOnInit()");
        this.clientService.newClient = false;

        this.cols = [
            { field: 'businessName', header: 'Nominativo' },
            { field: 'phoneNumber',  header: 'Telefono' }
        ];

        this.onLoadClientError = false;
        let userId = this.userService.selectedUser.id;

        const subsrciber = this.clientService.loadAllClients(userId, this.loadClientsErrorHandler('loadAllClients()'));

        subsrciber.subscribe(cs => this.clients = cs, e => this.onError(e), () => this.onComplete());
    }

    private onComplete(): void {
        console.log("onComplete()");

        for(let cvo of  this.clients ) {
            cvo.cuvo = 
                {id : this.userService.selectedUser.id,
                username : this.userService.selectedUser.username,
                password : this.userService.selectedUser.password,
                firstname: this.userService.selectedUser.firstname,
                lastname: this.userService.selectedUser.lastname,
                address: this.userService.selectedUser.address,
                email: this.userService.selectedUser.email,
                phoneNumber: this.userService.selectedUser.phoneNumber,
                description: this.userService.selectedUser.description,
                country: this.userService.selectedUser.country
            }
        }
    }


    private loadClientsErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onLoadClientError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }

    create() {
        this.selectedClient={
              id: null
            , businessName: ""
            , phoneNumber: ""
        };
        this.clientService.selectedClient = this.selectedClient;
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

            const subscr = this.clientService.postDeleteClient(this.selectedClient, this.deleteErrorHandler('postDeleteClient()'));

            subscr.subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
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

        this.clientService.selectedClient = this.selectedClient;
        this.clientService.newClient = false;

        this.gotoDetailView();
    }
 
}
