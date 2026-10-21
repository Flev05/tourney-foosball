import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from './abstract-listview';
import { Router } from '@angular/router';

export abstract class AbstractRuleListView extends AbstractListView {

    constructor(protected override redirect: string,
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location
    ) {
        super(redirect, tourneyService, router, location);
    }

}
