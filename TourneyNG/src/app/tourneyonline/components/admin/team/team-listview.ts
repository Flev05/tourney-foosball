import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamDetailView } from './team-detailview';
import { TeamVO } from 'app/tourneyonline/domain/team-vo';

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
        
        this.teamService.loadAllTeams( () => this.onComplete() );
    }

    private onComplete(): any {
        console.log("Entering onComplete()");
        this.teamService.teamPool = [];

        for( let pvo of this.teamService.teamPoolVO ) {
            let ppo: TeamVO = JSON.parse(pvo.json);
            ppo.id = pvo.id;
            ppo.country = pvo.country;
            ppo.clientVO = pvo.clientVO;
            ppo.teamName = pvo.teamName;

            this.teamService.teamPool.push(ppo);
        }
        this.teams = this.teamService.teamPool;
    }
    
    doDelete(team: Team) {
        console.log(team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName ;

        if(confirm(popup)) {            
            let index: number = this.teams.indexOf(team);
            if(index > -1) {
                this.teamService.deleteTeam(team).subscribe(n => this.next(n), e => this.onError(e));
            }
        }
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.teams = this.tourneyService.selectedTourney.teams;
        this.teamService.newTeam = false;
    }

    create() {
        this.selectedTeam={id:null, teamName:""};
        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = false;
        this.gotoDetailView();
    }
}

