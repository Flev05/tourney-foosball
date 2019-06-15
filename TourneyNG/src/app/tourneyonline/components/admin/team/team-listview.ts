import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamDetailView } from './team-detailview';

@Component({
    templateUrl: './team-listview.html'
})
export class TeamListView extends AbstractListView {

    cols: TableCols[] = TeamService.cols;
    selectedTeam: Team;
    teams: Team[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        private   teamService: TeamService
    ) {
        super(TeamDetailView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.teams = [];

        for(let t of this.tourneyService.selectedRound.teams ) {
            this.teams.push(t);
        }
    }

    onRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedTeam;
        this.gotoDetailView();
    }
}

