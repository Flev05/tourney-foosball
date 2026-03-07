import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamDetailView } from '../team/team-detailview';
import { Observable, of } from 'rxjs';
import { Table } from 'primeng/table';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';

const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.css']
})
export class TeamTableComponent extends AbstractListView {
    @Input() addTeamEnabled: boolean | undefined;
    @Input() tourneyTeams: boolean | undefined;
    @ViewChild('table') table: Table; // This gives us access to the #table from HTML
    
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
        private   teamService: TeamService,
        private clientService: ClientService,
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
            this.teamService.tourneyTeams = this.tourneyTeams;
        }
        this.teamCount = this.teams.length;

        setTimeout(() => {
            if (this.table) {
                this.table.filter(this.teamService.storedTeamFilter, 'teamName', 'contains');
            }
        }, 5);
    }
  
    // 2. Save the filter as the user types
    onFilterChange(value: string, table: Table) {
        this.teamService.storedTeamFilter = value;
        table.filter(value, 'teamName', 'contains');
    }

    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV], { 
            queryParams: { tourneyTeams: this.tourneyTeams }
        });
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
    
    protected gotoDetailView(): void {
        this.router.navigate([this.redirect], { 
            queryParams: { tourneyTeams: this.tourneyTeams }
        });
    }

    doDelete(team: Team) {
        console.log(team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName ;
        this.deleteTeam = team;
        if(confirm(popup)) {
            let index: number = this.teams.indexOf(this.deleteTeam);
            if( this.tourneyTeams ) { // the DELETE will apply only on the teams belonging to the tourney, not the one in the pool
                if(index > -1) {
                    this.teams = [...this.teams.filter(item => item !== team)];
                    this.tourneyService.selectedTourney.teams = this.teams;
                    // If the user has a search/filter active, update the filtered list too
                    if (this.table.filteredValue) {
                        this.table.filteredValue = this.table.filteredValue.filter(t => t.id !== team.id);
                    }
                    this.tourneyService.selectedTourney.teamsChanged = true;
                    // this.teamService.onTeamOperationChange(ETeamOperation.DELETE); // fire the DELETE event for Subscribed listeners
                    
                    let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.tourneyService.selectedTourney, this.clientService.selectedClient);
                    const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
                    subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => {});
                }
                return;
            }
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
            this.teams = [...this.teams.filter(p => p.id !== this.deleteTeam.id)];
        }
    }
}
