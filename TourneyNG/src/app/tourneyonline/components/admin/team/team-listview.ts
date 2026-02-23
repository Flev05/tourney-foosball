import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';

const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
    templateUrl: './team-listview.html'
})
export class TeamListView extends AbstractListView {
    addTeamEnabled = false;
    tourneyTeams = false;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router
    ) {
        super(null, tourneyService, router, null);
    }
     
    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }
}
