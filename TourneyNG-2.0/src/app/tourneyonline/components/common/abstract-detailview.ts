import { Location } from '@angular/common';

import { AbstractView } from './abstract-view';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class AbstractDetailView extends AbstractView {

    constructor(
        protected override tourneyService: TourneyService,
        protected override location: Location,
    ) {
        super(tourneyService, location);
    }

    override ngOnInit() {
        super.ngOnInit();
    }

    protected initClassification(r : Round) {
        r.classification = [];
        for(let t of r.teamNames) {
            let c = new Classification();
            c.id = this.tourneyService.getSequenceNumber();
            c.teamName = t;
            r.classification.push(c);
        }
    }

    onError(e:any) {
        console.log("onError()");
        console.log(e);
    }

}
