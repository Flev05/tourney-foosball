import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'primeng/api';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Observable, of } from 'rxjs';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TeamVO } from 'app/tourneyonline/domain/team-vo';

@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {
    public static redirect: string = "adminteam/dv";

    selectedTeam: Team;

    msgs: Message[] = [];

    toggleable: boolean = false;
    onSaveTeamError: boolean;
    teamAlreadyExists: boolean;
    badRequest: boolean;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        private   teamService: TeamService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedTeam = this.teamService.selectedTeam;
        
        if(this.teamService.newTeam) {
            this.selectedTeam={id: null, teamName:""};
            this.selectedTeam.players = [];
        }
        this.teamAlreadyExists = false;
    }

    onSubmit() {        
        this.selectedTeam.clientVO = this.clientService.selectedClient;

        let tvo : TeamVO = {
            id: this.selectedTeam.id
          , teamName: this.selectedTeam.teamName
          , country: this.selectedTeam.country
          , clientVO: this.selectedTeam.clientVO
          , json: JSON.stringify(this.selectedTeam)
        };

        this.teamAlreadyExists = false;
        this.onSaveTeamError = false;

        const subscriber = this.teamService.saveTeam(tvo, this.saveTeamErrorHandler('Create team operation'));
        subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());
    }

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");

            this.onSaveTeamError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }
 
    private saveTeamErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveTeamErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveTeamError = true;

            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            if( res.error.errorCode == "TeamAlreadyExists" ) {
                this.teamAlreadyExists = true;
                return of(result as T);
            }
      
            return of(result as T);
        };
    }
    
    private onSaveComplete() {
        console.log("Entering onSaveComplete()");
        if( !this.onSaveTeamError ) {
            if(this.teamService.newTeam) {
                this.teamService.teamPool.push(this.selectedTeam);
            }

            this.teamService.newTeam = false;
            super.goBack();
        }
    }

    enableSaveButton() : string {
        let n : String = this.selectedTeam.teamName;

        if( n == undefined ) {
            return  "disabled";
        }

        return  n.trim() == "" ? "disabled" : "";
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
