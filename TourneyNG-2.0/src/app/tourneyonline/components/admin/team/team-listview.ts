import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractListView } from '../../../components/common/abstract-listview';
import { TourneyService } from '../../../service/tourney-service';
import { Location } from '@angular/common';

const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
    templateUrl: './team-listview.html'
})
export class TeamListView extends AbstractListView {
    addTeamEnabled = false;
    tourneyTeams = false;

    constructor(protected override tourneyService: TourneyService
        , protected override router: Router
        , protected override redirect: string
        , protected override location: Location
    ) {
        super(redirect, tourneyService, router, location);
    }
     
    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }
}
