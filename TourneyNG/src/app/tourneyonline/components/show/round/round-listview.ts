import { Component } from '@angular/core';
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
 
}

