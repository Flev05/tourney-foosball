import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'primeng/api';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Observable, of } from 'rxjs';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TeamVO } from 'app/tourneyonline/domain/team-vo';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { CountryService } from 'app/tourneyonline/service/country-service';

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
    tdbs: TourneyVO[];

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        private   teamService: TeamService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();
        this.countries = this.countryService.countries;

        this.selectedTeam = this.teamService.selectedTeam;
        
        if(this.teamService.newTeam) {
            this.selectedTeam={id: null, teamName:""};
            this.selectedTeam.players = [];
        }
        this.teamAlreadyExists = false;
    }

    onSubmit() {        
        this.selectedTeam.clientId = this.clientService.selectedClient == undefined ? null : this.clientService.selectedClient.id;

        let tvo : TeamVO = {
            id: this.selectedTeam.id
          , teamName: this.selectedTeam.teamName
          , country: this.selectedTeam.country
          , clientId: this.selectedTeam.clientId
          , json: JSON.stringify(this.selectedTeam)
        };

        this.teamAlreadyExists = false;
        this.onSaveTeamError = false;

        const subscriber = this.teamService.saveTeam(tvo, this.saveTeamErrorHandler('Create team operation'));
        subscriber.subscribe(cs => this.newTeamNext(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete());

        // this.tourneyService.loadAllTourneys().subscribe(t => this.tdbs = t, e => this.onError(e), () => this.onLoadAllTourneysComplete());
    } 
    
    // private onLoadAllTourneysComplete(): void {
    //     let tourneys: Tourney[] = [];
    //     for(let tvo of this.tdbs) {
    //         let t: Tourney = JSON.parse(tvo.json);
    //         t.id = tvo.id;
    //         t.tourneyName = tvo.tourneyName;
    //         t.country = tvo.country;
    //         t.clientVO = tvo.clientVO;
    //         tourneys.push(t);
    //     }
    //     for( let tourney of tourneys ) {
    //         if( tourney.tourneyStatus != TourneyStatus.Terminated ) {
    //             let foundTeam: Team = tourney.teams.find(t => t.teamName == this.selectedTeam.teamName);
    //             if( foundTeam != undefined ) {
    //                 let index = tourney.teams.indexOf(foundTeam);
    //                 if( index != -1 ) {
    //                     tourney.teams[index] = this.selectedTeam;
    //                     let tvo: TourneyVO = {
    //                         id: tourney.id,
    //                         tourneyName: tourney.tourneyName,
    //                         country: tourney.country,
    //                         clientVO: this.clientService.selectedClient,
    //                         json: JSON.stringify(tourney)
    //                     };
    //                     const obs = this.tourneyService.saveTourney(tvo,  this.saveTourneyErrorHandler("Tourney update failed"));
    //                     obs.subscribe(cs => this.next(cs));
    //                 }
    //             }
    //         }
    //     }
    // }
    
    // private saveTourneyErrorHandler<T> (operation = 'operation', result?: T): any {
    //     return (res: any): Observable<T> => {
    //         console.log("Entering saveTourneyErrorHandler()");
    //         console.log(`${operation} failed!`);
    //         console.error(res); // log to console instead
    //         if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
    //             this.badRequest = true;
    //             return of(result as T);
    //         } 
    //         if( res.error.errorCode == "TourneyAlreadyExists" ) {
    //             return of(result as T);
    //         }
    //         return of(result as T);
    //     };
    // }

    private newTeamNext(tvo:TeamVO) {
        console.log("newTeamNext()");
        console.log(tvo);
        this.selectedTeam.id = tvo.id;
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

    onError(message:any): any {
        console.error(message);
    }
}
