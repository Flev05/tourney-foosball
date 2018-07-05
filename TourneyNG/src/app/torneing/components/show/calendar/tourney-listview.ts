import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Calendar } from '../../../domain/calendar';
import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';

const redirect = '/calendar/dv';

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
export class CalTourneyListView implements OnInit {

    selectedTourney: Tourney;

    tourneys: Tourney[];

    cols: any[];

    constructor(private tourneyService: TourneyService, public router: Router) { 
        console.log("CalTourneyListView.constructor()");
    }

    ngOnInit() {
        console.log("CalTourneyListView.ngOnInit()");

        this.tourneyService.loadTourneySmall().subscribe(t => this.tourneys = t);

        this.cols = [
            { field: 'tourneyName', header: 'Torneo' },
            { field: 'date', header: 'Data' },
            { field: 'time', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneCalendar(event.data);

        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }

    cloneCalendar(c: Tourney): Tourney {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
