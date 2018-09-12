import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractTourneyListView } from '../../common/tourney-listview';

const redirect: string = '/admintourney/dv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView extends AbstractTourneyListView {

    selectedTourney: Tourney;

    tourneys: Tourney[];
    toggleable: boolean = false;

    cols: any[];

    constructor(protected tourneyService: TourneyService, public router: Router) { 
        super(redirect, tourneyService, router);
    }

    ngOnInit() {
        console.log("TourneyListView.ngOnInit()");

        this.tourneyService.loadTourneySmall().subscribe(cs => this.tourneys = cs);

        this.tourneyService.newTourney = false;

        this.cols = [
            { field: 'tourneyName', header: 'Nome' },
            { field: 'dateAsString', header: 'Data' },
            { field: 'timeAsString', header: 'Ora' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    create() {
        this.selectedTourney={id: 0, tourneyName: "", address: "", rounds:[{}], phases:[""]};
        this.tourneyService.selectedTourney = this.selectedTourney;
        this.tourneyService.newTourney = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.cloneTourney(event.data);
        this.tourneyService.newTourney = false;

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
