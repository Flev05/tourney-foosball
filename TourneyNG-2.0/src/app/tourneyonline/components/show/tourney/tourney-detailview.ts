import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Router } from '@angular/router';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';

@Component({
    templateUrl: './tourney-detailview.html',
    standalone: false
})
export class TourneyDetailView extends AbstractDetailView {
    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected router: Router,
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        console.log("TourneyDetailView.ngOnInit() ");

        super.ngOnInit();
    }
}
