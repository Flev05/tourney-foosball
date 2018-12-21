import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

 
import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { CalendarTourneyListView } from '../calendar/tourney-listview';

const redirect = '/round/lv';

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
export class RoundTourneyListView extends CalendarTourneyListView {
    cols: any[];
    rows: any[];
    selectedRow: any;
    
    onRowSelect(event) {
        super.onRowSelect(event);

        this.tourneyService.selectedTourney = this.selectedRow.t;

        this.gotoDetailView();
    }
  
    onComplete(): any {

        this.rows = [];
        for(let i=0;i<this.tourneys.length; i++) {
            let t = this.tourneys[i];
            this.rows.push({t:t, rowNumber: i+1, tourneyName: t.tourneyName, datetime: t.datetime});
        }
    }
}
