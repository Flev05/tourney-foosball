import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from 'app/tourneyonline/domain/client';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from '../../common/abstract-listview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

const redirect = '/clients/dv';

@Component({
    templateUrl: './client-listview.html'
})
export class ClientListView extends AbstractListView {

    selectedClient: Client;

    clients: Client[];

    cols:  TableCols[] ;

    constructor(
        protected tourneyService: TourneyService,
        protected clientService:   ClientService,
        protected router:    Router,
        protected location: Location
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("ClientListView.ngOnInit()");

        this.clientService.loadAllClients().subscribe(cs => this.clients = cs);

        this.clientService.newClient = false;

        this.cols = [
            { field: 'firstname',    header: 'Nome' },
            { field: 'lastname',     header: 'Cognome' },
            { field: 'businessName', header: 'Ragione Sociale' },
            { field: 'phoneNumber',  header: 'Telefono' }
        ];
    }

    create() {
        this.selectedClient={
              firstname: "<Nome Cliente>"
            , lastname: "<Cognome Cliente>"
            , businessName: "<Ragione Sociale>"
            , phoneNumber: "<Numero di cellulare>"
        };
        this.clientService.selectedClient = this.selectedClient;
        this.clientService.newClient = true;
        this.gotoDetailView();
    }

    
    doDelete(client: Client) {
        console.log(client);

        let name = client.firstname != "" ? client.firstname + " " + client.lastname: client.businessName;
        let popup = 'Sicuro di voler rimuovere il cliente: [' + name + "]?";

        if(confirm(popup)) {
            this.clientService.deleteClient(client).subscribe(n => this.next(n));
        
            let index: number = this.clients.indexOf(client);
            if(index > -1) {
                this.clients.splice(index, 1);
            }
        }
    }

    onRowSelect(event) {
        console.log(event.data);

        this.clientService.selectedClient = this.cloneClient(event.data);
        this.clientService.newClient = false;

        this.gotoDetailView();
    }
  
    cloneClient(c: Client): Client {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
