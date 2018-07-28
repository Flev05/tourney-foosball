import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Client } from '../../../domain/client';
import { ClientService } from '../../../service/clientservice';

@Component({
    templateUrl: './client-listview.html'
})
export class ClientListView implements OnInit {

    selectedClient: Client;

    clients: Client[];

    cols: any[];

    constructor(private clientService: ClientService, public router: Router) { 
        console.log("ClientListView.constructor()");
    }

    ngOnInit() {
        console.log("ClientListView.ngOnInit()");

        this.clientService.loadClientSmall().subscribe(cs => this.clients = cs);

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

    onRowSelect(event) {
        console.log(event.data);

        this.clientService.selectedClient = this.cloneClient(event.data);
        this.clientService.newClient = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
        let redirect = '/clients/dv';
        this.router.navigate([redirect]);
    }

    cloneClient(c: Client): Client {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
