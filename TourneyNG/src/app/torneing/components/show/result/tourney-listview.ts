import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Calendar } from '../../../domain/calendar';
import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { CalTourneyListView } from '../calendar/tourney-listview';

const redirect = '/result/lv';

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
export class ResultTourneyListView extends CalTourneyListView {

    onRowSelect(event) {
        super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }
}
