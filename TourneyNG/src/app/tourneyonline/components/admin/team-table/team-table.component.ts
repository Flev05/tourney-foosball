import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamDetailView } from '../team/team-detailview';
import { Observable, of } from 'rxjs';
import { ETeamOperation } from 'app/tourneyonline/domain/enumerations';

const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.css']
})
export class TeamTableComponent extends AbstractListView {
    @Input() addTeamEnabled: boolean | undefined;
    @Input() tourneyTeams: boolean | undefined;
    
    cols: TableCols[] = TeamService.cols;
    selectedTeam: Team;
    teams: Team[] = [];
    deleteTeam: Team;
    onDeleteTeamError: boolean;

    teamNameFilter: string;
    teamCount : number = 0;

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
        this.addTeamEnabled = !this.teamService.readOnly;
        this.teamService.loadAllTeams( () => this.onLoadTeamsComplete());
    }
  
    private onLoadTeamsComplete(): any {
        this.teams = this.teamService.teamPool.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
        console.log("Loaded [" + this.teams.length + "] pool teams");
        if( this.tourneyTeams ) {
            this.teams = this.tourneyService.selectedTourney.teams.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
        }
        this.teamCount = this.teams.length;
    }
  
    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }

    create() {
        this.selectedTeam={id: null, teamName: ""};
        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.teamService.newTeam = false;
        this.teamService.selectedTeam = this.selectedTeam;
        this.gotoDetailView();
    }

    doDelete(team: Team) {
        console.log(team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName ;
        this.deleteTeam = team;
        if(confirm(popup)) {
            if( this.tourneyTeams ) {
                let index: number = this.teams.indexOf(this.deleteTeam);
                if(index > -1) {
                    this.teams.splice(index, 1);
                    this.teamService.onTeamOperationChange(ETeamOperation.DELETE);
                }
                return;
            }
            let index: number = this.teams.indexOf(team);
            if(index > -1) {
                const observer = this.teamService.deleteTeam(team, this.deleteTeamErrorHandler("Team player operation"));
                observer.subscribe(n => this.next(n), e => this.subscribeErrorHandler(e), () => this.onDeleteComplete());
            }
        }
    }

    private deleteTeamErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering deleteTeamErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            this.onDeleteTeamError = true;
            return of(result as T);
        };
    }

    protected subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onDeleteTeamError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    private onDeleteComplete() {
        console.log("Entering onDeleteComplete()");
        if( !this.onDeleteTeamError ) {
            let index: number = this.teams.indexOf(this.deleteTeam);
            if(index > -1) {
                this.teams.splice(index, 1);
            }
        }
    }
}
