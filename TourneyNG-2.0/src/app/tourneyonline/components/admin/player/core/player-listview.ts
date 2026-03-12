import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractListView } from '../../../../components/common/abstract-listview';
import { TourneyService } from '../../../../service/tourney-service';

const redirect: string = "adminplayer/dv";
const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
    templateUrl: './player-listview.html',
    standalone: false
})
export class PlayerListView extends AbstractListView {
    playerLv : boolean = false;
    addPlayerEnabled : boolean = true;
    tourneyTeams: boolean | undefined;

    constructor(
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location,
        private route: ActivatedRoute
    ) {
        super(redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.route.queryParams.subscribe(params => {
            // Note: Query params are strings, so we convert back to boolean
            this.tourneyTeams = params['tourneyTeams'] === 'true';
        });
    }

    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }
}

