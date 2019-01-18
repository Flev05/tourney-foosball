import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'primeng/api';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Player } from 'app/tourneyonline/domain/player';
import { AbstractListView } from '../../common/abstract-listview';
import { Router } from '@angular/router';
import { TeamListView } from '../team/team-listview';

@Component({
    templateUrl: './add-team-listview.html',
})
export class AddTeamListView extends AbstractListView {

    selectedTeam: Team;

    msgs: Message[] = [];

    toggleable: boolean = false;

    availablePlayers: Player[] = [];
    targetPlayers: Player[] = [];

    fullAddress: string;
    availableTeams: Team[];
    selectedTeams: Team[];
    poolTeams: Team[];
    teamCols: { field: string; header: string; }[];

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

        this.teamCols = TeamService.cols;

        this.selectedTeam = this.teamService.selectedTeam;

        this.teamCols = TeamService.cols;
        this.teamService.loadAllTeams().subscribe(t => this.poolTeams = t, e => this.onError(e), () => this.onTeamComplete());
    }

    private onTeamComplete(): void {
        this.availableTeams = [...this.poolTeams];
        this.selectedTeams = [];

        for(let pt of this.poolTeams) {            
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

    save(value: string) {
 
        if(this.teamService.newTeam) {
            this.selectedTourney.teams.push(this.selectedTeam);
        }

        for(let t of this.selectedTeams) {
            this.selectedTourney.teams.push(t);
        }

        this.teamService.updateTeam(this.selectedTeam).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    newTeam() {
        this.selectedTeam={id:0, teamName:""};
        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = true;
        this.router.navigate([TeamListView.redirect]);
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.teamService.newTeam) {
            msgerr = 'Creazione nuova squadra fallita';
        } else {
            msgerr = 'Modifica squadra fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
