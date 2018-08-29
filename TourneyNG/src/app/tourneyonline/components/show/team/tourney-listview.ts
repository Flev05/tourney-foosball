import { Component } from '@angular/core';

import { CalendarTourneyListView } from '../calendar/tourney-listview';

const redirect = '/team/lv';

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
export class TeamTourneyListView extends CalendarTourneyListView {

    onRowSelect(event) {
        super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }
}
