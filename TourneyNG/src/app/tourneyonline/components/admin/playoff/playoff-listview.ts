import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Playoff } from '../../../domain/playoff';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect: string = "adminplayoff/lv/dv";

@Component({
    templateUrl: './playoff-listview.html'
})
export class PlayoffListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        private location: Location,
    ) {
        super(redirect, tourneyService, router);
    }

    selectedTourney: Tourney;
    selectedPlayoff: Playoff;

    playoffs: [Playoff];

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.playoffs = this.tourneyService.selectedTourney.playoffs;
        this.tourneyService.newPlayoff = false;
    }

    create() {
        this.selectedPlayoff={};
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.tourneyService.newPlayoff = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        let sp = this.cloneObject(event.data);

        for(let i=0; i<this.selectedTourney.playoffs.length; i++ ) {
            if(this.selectedTourney.playoffs[i].id == sp.id) {
                this.selectedPlayoff = this.selectedTourney.playoffs[i];
                this.tourneyService.selectedPlayoff = this.selectedPlayoff;
                break;
            }
        }

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

