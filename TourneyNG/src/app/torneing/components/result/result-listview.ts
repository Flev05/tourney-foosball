import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Calendar } from '../../domain/calendar';
import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { CalendarListView } from '../calendar/calendar-listview';

@Component({
    templateUrl: './result-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
    `]
})
export class ResultListView extends CalendarListView {

    onRowSelect(event) {
        super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        let redirect = '/result/dv';
        this.router.navigate([redirect]);
    }
}
