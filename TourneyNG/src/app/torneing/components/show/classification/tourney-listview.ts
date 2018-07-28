import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Classification } from '../../../domain/classification';
import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';

const redirect = '/classification/lv';

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
export class ClassificationTourneyListView implements OnInit {

    selectedTourney: Tourney;

    tourneys: Tourney[];

    cols: any[];

    constructor(private tourneyService: TourneyService, public router: Router) { 
        console.log("ClassificationTourneyListView.constructor()");
    }

    ngOnInit() {
        console.log("ClassificationTourneyListView.ngOnInit()");

        this.tourneyService.loadTourneySmall().subscribe(t => this.tourneys = t);

        this.cols = [
            { field: 'tourneyName', header: 'Torneo' },
            { field: 'date', header: 'Data' },
            { field: 'time', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneClassification(event.data);

        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }

    cloneClassification(c: Tourney): Tourney {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
