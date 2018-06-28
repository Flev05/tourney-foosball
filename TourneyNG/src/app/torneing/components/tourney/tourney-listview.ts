import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView implements OnInit {

    selectedTourney: Tourney;

    tourneys: Tourney[];

    cols: any[];

    constructor(private carService: TourneyService, public router: Router) { 
        console.log("TourneyListView.constructor()");
    }

    ngOnInit() {
        console.log("TourneyListView.ngOnInit()");

        this.carService.loadTourneySmall().subscribe(cs => this.tourneys = cs);

        this.carService.newTourney = false;

        this.cols = [
            { field: 'tourneyName', header: 'Nome' },
            { field: 'date', header: 'Data' },
            { field: 'time', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    create() {
        this.selectedTourney={id: 0, tourneyName: "", address: "", rounds:[{}]};
        this.carService.selectedTourney = this.selectedTourney;
        this.carService.newTourney = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.carService.selectedTourney = this.cloneTourney(event.data);
        this.carService.newTourney = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
        let redirect = '/tourney/dv';
        this.router.navigate([redirect]);
    }

    cloneTourney(c: Tourney): Tourney {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
