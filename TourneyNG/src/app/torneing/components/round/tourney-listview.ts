import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

 
import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { TourneyListView } from '../calendar/tourney-listview';

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
export class RoundTourneyListView extends TourneyListView {

    onRowSelect(event) {
        super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        let redirect = '/round/dv';
        this.router.navigate([redirect]);
    }
}
