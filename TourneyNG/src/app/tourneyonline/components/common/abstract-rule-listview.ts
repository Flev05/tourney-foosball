import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from './abstract-listview';
import { Router } from '@angular/router';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

export abstract class AbstractRuleListView extends AbstractListView {

    constructor(protected redirect: string,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location
    ) {
        super(redirect, tourneyService, router, location);
    }

}
