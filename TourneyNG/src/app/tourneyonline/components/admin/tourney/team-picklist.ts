import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { Router } from '@angular/router';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamDetailView } from '../team/team-detailview';

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
        , private teamService: TeamService) 
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

    onMoveToTarget(event) {
        console.log("Entering onMoveToTarget()");
        this.returnLabel = "Salva e torna";
    }

    onMoveToSource(event) {
        console.log("Entering onMoveToSource()");
        this.returnLabel = "Salva e torna";
    }
 
    newTeam() {
        this.teamService.newTeam = true;
        this.returnLabel = "Salva e torna";
        
        this.router.navigate([TeamDetailView.redirect]);
    }
    
    goBack(): void {
        this.returnLabel = "Salva e torna";
        this.alignTourneyTeams();
        super.goBack();
    }

    private alignTourneyTeams() {
        let tempTeams : Team[] = [...this.selectedTourney.teams];
        for( let t of tempTeams ) {
            let tn = this.targetTeams.find( tt => tt == t.teamName );
            if( tn == undefined ) {
                let index = this.selectedTourney.teams.indexOf(t);
                if( index > -1 ) {
                    this.selectedTourney.teams.splice(index, 1);
                }
            }
        }

        for (let pn of this.targetTeams) {
            let team : Team = this.selectedTourney.teams.find( t => t.teamName == pn );
            if( team == undefined ) {
                let t: Team = this.teamService.teamPool.find(x => x.teamName == pn);
                this.selectedTourney.teams.push(t);
            }
        }
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
