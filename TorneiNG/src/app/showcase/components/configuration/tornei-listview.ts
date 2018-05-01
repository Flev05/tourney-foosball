import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Torneo } from '../../domain/torneo';
import { TorneoService } from '../../service/torneoservice';

@Component({
    templateUrl: './tornei-listview.html'
})
export class TorneiListView implements OnInit {

    selectedTorneo: Torneo;

    tornei: Torneo[];

    cols: any[];

    constructor(private carService: TorneoService, public router: Router) { 
        console.log("TorneiListView.constructor()");
    }

    ngOnInit() {
        console.log("TorneiListView.ngOnInit()");

        this.carService.loadTorneoSmall().subscribe(cs => this.tornei = cs);

        this.carService.newTorneo = false;

        // for (let entry of this.tornei) {
        //     console.log("List View tornei: " + entry.name + ")");
        // }

        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'name', header: 'Nome' },
            { field: 'when', header: 'Data' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    create() {
        this.selectedTorneo={id: 0, name: "<Nome Torneo>", when: "<data inizio torneo>", address: "<indirizzo luogo torneo>"};
        this.carService.selectedTorneo = this.selectedTorneo;
        this.carService.newTorneo = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.carService.selectedTorneo = this.cloneTorneo(event.data);
        this.carService.newTorneo = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
        let redirect = '/configuration/dv';
        this.router.navigate([redirect]);
    }

    cloneTorneo(c: Torneo): Torneo {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
