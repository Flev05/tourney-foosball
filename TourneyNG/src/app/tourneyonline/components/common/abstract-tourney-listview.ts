import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { AbstractListView } from './abstract-listview';
 
export abstract class AbstractTourneyListView extends AbstractListView {

    protected tourneys: Tourney[];
    protected selectedTourney: Tourney;
    protected cols: any[];
    toggleable: boolean = false;

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location) { 
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("AbstractTourneyListView.ngOnInit()");

        this.loadTourney();

        this.cols = [
            { field: 'tourneyName', header: 'Torneo' },
            { field: 'dateAsString', header: 'Data' },
            { field: 'timeAsString', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    protected loadTourney() {
        console.log("Entering AbstractTourneyListView.loadTourney()");
        this.tourneyService.loadTourneySmall().subscribe(t => this.tourneys = t);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneObject(event.data);

        this.gotoDetailView();
    }
}
