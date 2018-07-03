import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Calendar } from '../../domain/calendar';
import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { TourneyListView } from '../calendar/tourney-listview';

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
export class ResultListView extends TourneyListView {

    onRowSelect(event) {
        super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        let redirect = '/result/dv';
        this.router.navigate([redirect]);
    }
}
