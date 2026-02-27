import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractListView } from '../../../../components/common/abstract-listview';
import { TourneyService } from '../../../../service/tourney-service';

const redirect: string = "adminplayer/dv";
const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
    templateUrl: './player-listview.html'
})
export class PlayerListView extends AbstractListView {
    playerLv : boolean = false;
    addPlayerEnabled : boolean = true;
    constructor(
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();
    }

    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }
}

