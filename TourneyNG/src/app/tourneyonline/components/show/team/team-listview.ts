import { Component } from '@angular/core';
import { Team } from '../../../domain/team';
import { CalendarDetailView } from '../calendar/calendar-detailview';

@Component({
    templateUrl: './team-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class TeamListView extends CalendarDetailView {
    rows: any[] = [];

    teams: Team[];

    ngOnInit() {
        super.ngOnInit();
    }

    protected updateRowGroupMetaData() {
        if(this.selectedTourney.players==undefined) {
            return;
        }
        this.teams = this.selectedTourney.teams;

        for (let row = 0; row < this.teams.length; row++) {
            this.rows.push(this.teams[row]);
        }
    }
}

