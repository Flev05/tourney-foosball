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
    cols: any[];
    rows: any[];
    selectedRow: any;
    selectedTeam: Team;

    teams: Team[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
        this.cols = [
            { field: 'rowNumber',  header: 'N°' },
            { field: 'teamName',   header: 'Nome' },
            { field: 'address',    header: 'Indirizzo' },
        ];

        this.rows = [];
        for(let i=0;i<this.teams.length; i++) {
            let t = this.teams[i];
            this.rows.push({t:t, rowNumber: i+1, teamName: t.teamName, address: t.address});
        }
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.teams = this.tourneyService.selectedTourney.teams;
        this.tourneyService.newTeam = false;
    }

    create() {
        this.selectedTeam={id:0, teamName:""};
        this.selectedRow = {t:this.selectedTeam, rowNumber: 1, teamName: "", address: ""};
        this.tourneyService.selectedTeam = this.selectedTeam;
        this.tourneyService.newTeam = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTeam = this.selectedRow.t;

        this.gotoDetailView();
    }

    goBack(): void {
        this.location.back();
    }
}

