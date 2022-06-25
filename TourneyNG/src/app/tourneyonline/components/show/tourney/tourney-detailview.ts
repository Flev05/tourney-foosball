import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Router } from '@angular/router';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';

@Component({
    templateUrl: './tourney-detailview.html'
})
export class TourneyDetailView extends AbstractDetailView {
    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected router: Router,
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("MatrixDetailView.ngOnInit() ");

        super.ngOnInit();
    }
}
