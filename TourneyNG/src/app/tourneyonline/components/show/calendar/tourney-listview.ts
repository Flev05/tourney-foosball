import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';

const redirect = '/calendar/lv';

@Component({
    templateUrl: './tourney-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
    `]
})
export class CalendarTourneyListView implements OnInit {

    protected tourneys: Tourney[];

    cols: any[];

    constructor(protected tourneyService: TourneyService, public router: Router) { 
        console.log("CalendarTourneyListView.constructor()");
    }

    ngOnInit() {
        console.log("CalendarTourneyListView.ngOnInit()");

        this.loadTourney();

        this.cols = [
            { field: 'tourneyName', header: 'Torneo' },
            { field: 'date', header: 'Data' },
            { field: 'time', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    protected loadTourney() {
        console.log("Entering CalendarTourneyListView.loadTourney()");
        this.tourneyService.loadTourneySmall().subscribe(t => this.tourneys = t);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneTourney(event.data);

        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }

    cloneTourney(c: any): any {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
