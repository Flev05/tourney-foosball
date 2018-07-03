import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Tourney } from '../../domain/tourney';
import { Calendar } from '../../domain/calendar';
import { Meeting } from '../../domain/meeting';
import { TourneyService } from '../../service/tourneyservice';
import { CalendarDetailView } from '../calendar/calendar-detailview';

@Component({
    templateUrl: './round-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class RoundListView extends CalendarDetailView {
    constructor( public router: Router) { 
        super(null, null);
        console.log("CalTourneyListView.constructor()");
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneCalendar(event.data);

        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        let redirect = '/round/dv';
        this.router.navigate([redirect]);
    }
}

