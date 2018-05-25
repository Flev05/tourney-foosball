import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Client } from '../../domain/client';
import { ClientService } from '../../service/clientservice';

@Component({
    templateUrl: './client-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class ClientDetailView implements OnInit {

    selectedClient: Client;

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
        private location: Location
    ) {}

    ngOnInit() {

        this.getClient();
    }

    getClient(): void {
        this.selectedClient = this.clientService.selectedClient;
    }

    save(): void {
        if(this.clientService.newClient) {
            this.clientService.addClient(this.selectedClient).subscribe(() => this.goBack());  
        } else  {
            this.clientService.updateClient(this.selectedClient).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.clientService.deleteClient(this.selectedClient)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
