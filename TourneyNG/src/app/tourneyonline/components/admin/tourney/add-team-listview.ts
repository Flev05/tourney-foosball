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
    templateUrl: './add-team-listview.html',
})
export class AddTeamListView extends AbstractListView {

    teamPool: Team[];
    teamCols: TableCols[] = TeamService.cols;
    availableTeams: Team[] = [];

    constructor( protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private teamService: TeamService) 
    { 
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        console.log("AddTeamListView.ngOnInit() ");
        super.ngOnInit();
        this.prepareAvailableTeams();
    }
    
    private prepareAvailableTeams(): void {
        this.teamPool = this.teamService.teamPool;
        this.availableTeams = [...this.teamPool];

        for(let pt of this.teamPool) {            
            for(let t of this.selectedTourney.teams) {
                if( pt.id == t.id ) {
                    let index: number = this.availableTeams.indexOf(pt);
                    if(index > -1) {
                        this.availableTeams.splice(index, 1);
                    }
                }
            }
        }
    }

    // save(value: string) {
 
    //     if(this.teamService.newTeam) {
    //         this.teamService.newTeam = false;
    //     }

    //     for(let t of this.selectedTourney.selectedTeams) {
    //         this.selectedTourney.teams.push(t);
    //     }

    //     this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );
    // }
 
    newTeam() {
        this.teamService.newTeam = true;
        this.router.navigate([TeamListView.redirect]);
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
