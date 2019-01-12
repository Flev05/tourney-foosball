import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/teamService';
import { AbstractListView } from '../../common/abstract-listview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';

const redirect: string = "adminteam/dv";

@Component({
    templateUrl: './team-listview.html'
})
export class TeamListView extends AbstractListView {
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
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.cols = [
            { field: 'rowNumber',  header: 'N°' },
            { field: 'teamName',   header: 'Nome' },
            { field: 'address',    header: 'Indirizzo' },
        ];

        this.teamService.loadAllTeams().subscribe(p => this.teams = p, e => this.onError(e), () => this.onComplete());
    }

    onComplete(): void {
        this.rows = [];
        for(let i=0;i<this.teams.length; i++) {
            let t = this.teams[i];
            this.rows.push({t:t, rowNumber: i+1, teamName: t.teamName, address: t.address});
        }
    }

    doDelete(team: any) {
        console.log(team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName;

        if(confirm(popup + "?")) {
            this.teamService.deleteTeam(team.t).subscribe(n => this.next(n), e => this.onError(e));

            let index: number = this.teams.indexOf(team.t);
            if(index > -1) {
                this.teams.splice(index, 1);
            }
            this.onComplete();
        }
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.teams = this.tourneyService.selectedTourney.teams;
        this.teamService.newTeam = false;
    }

    create() {
        this.selectedTeam={id:0, teamName:""};
        this.selectedRow = {t:this.selectedTeam, rowNumber: 1, teamName: "", address: ""};
        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedRow.t;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

