import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';


@Component({
    templateUrl: './team-listview.html'
})
export class TeamListView extends AbstractListView {
    public static redirect: string = "adminteam/dv";

    cols: any[];
    rows: any[];
    selectedRow: any;
    selectedTeam: Team;

    teams: Team[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        private   teamService: TeamService
    ) {
        super(TeamListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.cols = TeamService.cols;
        this.teamService.loadAllTeams().subscribe(t => this.teams = t, e => this.onError(e), () => this.onComplete());
    }

    onComplete(): void {
        this.rows = this.teams;
    }

    doDelete(team: any) {
        console.log(team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName;

        if(confirm(popup + "?")) {
            this.teamService.deleteTeam(team).subscribe(n => this.next(n), e => this.onError(e));

            let index: number = this.teams.indexOf(team);
            if(index > -1) {
                this.teams.splice(index, 1);
                this.rows.splice(index, 1);
            }
        }
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.teams = this.tourneyService.selectedTourney.teams;
        this.teamService.newTeam = false;
    }

    create() {
        this.selectedTeam={id:0, teamName:""};
        this.selectedRow = this.selectedTeam;
        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedRow;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

