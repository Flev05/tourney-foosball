import { Component } from '@angular/core';
 
import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { Tourney } from 'app/tourneyonline/domain/tourney';

const redirect = '/match/meetinglv';

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
export class MatchTourneyListView extends AbstractTourneyListView {

    onRowSelect(event) {
        super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
