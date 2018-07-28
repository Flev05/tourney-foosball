import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';

const redirect: string = '/admintourney/dv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView implements OnInit {

    selectedTourney: Tourney;

    tourneys: Tourney[];

    cols: any[];

    constructor(private tourneyService: TourneyService, public router: Router) { 
        console.log("TourneyListView.constructor()");
    }

    ngOnInit() {
        console.log("TourneyListView.ngOnInit()");

        this.tourneyService.loadTourneySmall().subscribe(cs => this.tourneys = cs);

        this.tourneyService.newTourney = false;

        this.cols = [
            { field: 'tourneyName', header: 'Nome' },
            { field: 'date', header: 'Data' },
            { field: 'time', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    create() {
        this.selectedTourney={id: 0, tourneyName: "", address: "", rounds:[{}], phases:[""]};
        this.tourneyService.selectedTourney = this.selectedTourney;
        this.tourneyService.newTourney = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneTourney(event.data);
        this.tourneyService.newTourney = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
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
