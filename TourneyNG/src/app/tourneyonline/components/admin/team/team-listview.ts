import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Team } from '../../../domain/team';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';

const redirect: string = "adminteam/lv/dv";

@Component({
    templateUrl: './team-listview.html'
})
export class TeamListView extends AbstractListView {
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    selectedTourney: Tourney;
    selectedTeam: Team;

    teams: Team[];

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.teams = this.tourneyService.selectedTourney.teams;
        this.tourneyService.newTeam = false;
    }

    create() {
        this.selectedTeam={id:0, teamName:""};
        this.tourneyService.selectedTeam = this.selectedTeam;
        this.tourneyService.newTeam = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        let sp = this.cloneObject(event.data);

        for(let i=0; i<this.selectedTourney.teams.length; i++ ) {
            if(this.selectedTourney.teams[i].id == sp.id) {
                this.selectedTeam = this.selectedTourney.teams[i];
                this.tourneyService.selectedTeam = this.selectedTeam;
                break;
            }
        }

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

