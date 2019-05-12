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
import { Observable, of } from 'rxjs';
import { CountryService } from 'app/tourneyonline/service/country-service';

@Component({
    templateUrl: './team-listview.html'
})
export class TeamListView extends AbstractListView {

    cols: TableCols[] = TeamService.cols;
    selectedTeam: Team;

    teams: Team[];
    deleteTeam: Team;
    onDeleteTeamError: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected countryService: CountryService,
        private   teamService: TeamService
    ) {
        super(TeamDetailView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.countryService.loadAllCountries();
        this.teamService.loadAllTeams( () => this.onComplete() );
    }

    private onComplete(): any {
        console.log("Entering onComplete()");
        this.teamService.teamPool = [];

        for( let pvo of this.teamService.teamPoolVO ) {
            let ppo: TeamVO = JSON.parse(pvo.json);
            ppo.id = pvo.id;
            ppo.country = pvo.country;
            ppo.clientId = pvo.clientId;
            ppo.teamName = pvo.teamName;

            this.teamService.teamPool.push(ppo);
        }
        this.teams = this.teamService.teamPool;
    }
    
    doDelete(team: Team) {
        console.log(team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName ;
        this.deleteTeam = team;
        
        if(confirm(popup)) {            
            let index: number = this.teams.indexOf(team);
            if(index > -1) {
                const observer = this.teamService.deleteTeam(team, this.deleteTeamErrorHandler("Team player operation"));
                observer.subscribe(n => this.next(n), e => this.subscribeErrorHandler(e), () => this.onDeleteComplete());
            }
        }
    }

    protected updateRowGroupMetaData() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.teams = this.tourneyService.selectedTourney.teams;
        this.teamService.newTeam = false;
    }

    create() {
        this.selectedTeam={id:null, teamName:"", isDummy: false};
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

    private deleteTeamErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering deleteTeamErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onDeleteTeamError = true;
      
            return of(result as T);
        };
    }

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
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

