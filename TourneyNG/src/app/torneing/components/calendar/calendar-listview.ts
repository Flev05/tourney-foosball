import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Calendar } from '../../domain/calendar';
import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';

@Component({
    templateUrl: './calendar-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
    `]
})
export class CalendarListView implements OnInit {

    selectedTourney: Tourney;

    tourneys: Tourney[];

    cols: any[];

    constructor(private tourneyService: TourneyService, public router: Router) { 
        console.log("CalendarListView.constructor()");
    }

    ngOnInit() {
        console.log("CalendarListView.ngOnInit()");

        this.tourneyService.loadTourneySmall().subscribe(t => this.tourneys = t);

        this.cols = [
            { field: 'name', header: 'Torneo' },
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
  
    private gotoDetailView() {
        let redirect = '/calendar/dv';
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
