import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Router } from '@angular/router';
import { TeamListView } from '../team/team-listview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './team-picklist.html',
})
export class TeamPickList extends AbstractListView {

    teamCols: TableCols[] = TeamService.cols;

    avalilableTeams: string[];
    targetTeams: string[];

    constructor( protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private teamService: TeamService) 
    { 
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        console.log("TeamPickList.ngOnInit() ");
        super.ngOnInit();
        this.prepareAvailableTeams();
    }
    
    private prepareAvailableTeams(): void {
        
        this.targetTeams = [];
        for(let t of this.selectedTourney.teams) {
            this.targetTeams.push(t.teamName);
        }
        
        this.avalilableTeams = [];
        for(let t of this.teamService.teamPool) {
            let tn = this.targetTeams.find(x => x == t.teamName);
            if( tn == undefined) {
                this.avalilableTeams.push(t.teamName);
            }
        }
    }
 
    newTeam() {
        this.teamService.newTeam = true;
        this.router.navigate([TeamListView.redirect]);
    }
    
    goBack(): void {
        this.selectedTourney.teams = [];
        for(let pn of this.targetTeams) {
            let t: Team = this.teamService.teamPool.find(x => x.teamName == pn);
            this.selectedTourney.teams.push(t);
        }
        this.location.back();
    }

    onError(n:any) {
        let msgerr : string;

        if(this.teamService.newTeam) {
            msgerr = 'Creazione nuova squadra fallita';
        } else {
            msgerr = 'Modifica squadra fallita';
        }
        console.log(msgerr);
    }
}
