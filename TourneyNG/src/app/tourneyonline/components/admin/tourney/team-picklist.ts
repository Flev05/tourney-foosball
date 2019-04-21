import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Router } from '@angular/router';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamDetailView } from '../team/team-detailview';
import { MeetingRoundService } from '../round/meeting-round-service';

@Component({
    templateUrl: './team-picklist.html',
})
export class TeamPickList extends AbstractListView {

    teamCols: TableCols[] = TeamService.cols;

    avalilableTeams: string[];
    targetTeams: string[];
    returnLabel: string;

    constructor( protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private teamService: TeamService
        , private meetingRoundService: MeetingRoundService) 
    { 
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        console.log("TeamPickList.ngOnInit() ");
        super.ngOnInit();

        this.returnLabel = "Indietro";

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
    
    onRandomTeamChange(event) {
        console.log("Entering onRandomTeamChange()");
        console.log(event);
        if(event) {
            this.selectedTourney.teamsWeightEnabled = true;
        } else {
            this.selectedTourney.teamsWeightEnabled = false;
        }
    }

    onMoveToTarget(event) {
        console.log("Entering onMoveToTarget()");
        this.returnLabel = "Salva e torna";
        this.teamService.isTeamsChanged = true;
    }

    onMoveToSource(event) {
        console.log("Entering onMoveToSource()");
        this.returnLabel = "Salva e torna";
        this.teamService.isTeamsChanged = true;
    }
 
    newTeam() {
        this.teamService.newTeam = true;
        this.returnLabel = "Salva e torna";
        this.teamService.isTeamsChanged = true;
        
        this.router.navigate([TeamDetailView.redirect]);
    }
    
    goBack(): void {
        this.returnLabel = "Salva e torna";
        this.alignTourneyTeams();
        super.goBack();
    }

    private alignTourneyTeams() {
        this.selectedTourney.teams = [];
        for (let pn of this.targetTeams) {
            let t: Team = this.teamService.teamPool.find(x => x.teamName == pn);
            this.selectedTourney.teams.push(t);
        }
        
        this.meetingRoundService.saveEliminatoryMeetings(this.selectedTourney);
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
