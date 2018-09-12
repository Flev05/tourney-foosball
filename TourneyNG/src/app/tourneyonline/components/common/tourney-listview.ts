import { Router } from '@angular/router';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { AbstractListView } from './abstract-listview';
 
export abstract class AbstractTourneyListView extends AbstractListView {

    protected tourneys: Tourney[];

    cols: any[];

    constructor(protected redirect: string, protected tourneyService: TourneyService, public router: Router) { 
        super(redirect, tourneyService, router);
    }

    ngOnInit() {
        console.log("TourneyListView.ngOnInit()");

        this.loadTourney();

        this.cols = [
            { field: 'tourneyName', header: 'Torneo' },
            { field: 'dateAsString', header: 'Data' },
            { field: 'timeAsString', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    protected loadTourney() {
        console.log("Entering TourneyListView.loadTourney()");
        this.tourneyService.loadTourneySmall().subscribe(t => this.tourneys = t);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneTourney(event.data);

        this.gotoDetailView();
    }
  
    cloneTourney(c: Tourney): Tourney {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
