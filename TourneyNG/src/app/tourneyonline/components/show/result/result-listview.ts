import { Component } from '@angular/core';

import { CalendarDetailView } from '../calendar/calendar-detailview';

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
export class ResultListView extends CalendarDetailView {
}
