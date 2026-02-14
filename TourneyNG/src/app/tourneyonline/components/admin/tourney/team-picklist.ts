import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Router } from '@angular/router';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamDetailView } from 'app/tourneyonline/components/admin/team/team-detailview';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Observable, of } from 'rxjs';

@Component({
    templateUrl: './team-picklist.html'
})
export class TeamPickList extends AbstractListView {

    teamCols: TableCols[] = TeamService.cols;

    availableTeams: string[] = [];
    targetTeams: string[] = [];
    returnLabel: string;
    isTeamsOrderedGroupname : boolean = false;

    constructor( protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private teamService: TeamService
        , private clientService: ClientService) 
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
        if( this.teamService.newTeam && this.teamService.selectedTeam != undefined ) {
            let tn = this.selectedTourney.teams.find(x => x.teamName.trim() == this.teamService.selectedTeam.teamName.trim() );
            if( tn == undefined && this.teamService.selectedTeam != undefined) {
                this.selectedTourney.teams.push(this.teamService.selectedTeam);
            }
        }

        this.teamService.newTeam = false;
        this.targetTeams = [];
        for(let t of this.selectedTourney.teams) {
            this.targetTeams.push(t.teamName.trim());
        }
        let targetTeamsSet: Set<string> = new Set(this.targetTeams);
        this.targetTeams = Array.from(targetTeamsSet);

        this.availableTeams = [];
        for(let t of this.teamService.teamPool) {
            let tn = this.targetTeams.find(x => x.trim() == t.teamName.trim());
            if( tn == undefined) {
                this.availableTeams.push(t.teamName.trim());
            }
        }
        let uniqueTeamsSet: Set<string> = new Set(this.availableTeams);
        this.availableTeams = Array.from(uniqueTeamsSet);
        this.availableTeams.sort((t1, t2) =>{
            if(t1 < t2) {
                return -1;
            }
            if( t1 > t2) {
                return 1;
            }
            return 0;
        });
    }
    
    onTargetReorder(event) {
        console.log("Entering onTargetReorder()");
        this.returnLabel = "Salva e torna";
        this.teamService.isTeamsChanged=true;
        this.resetAll();
        
        let teams = [...this.selectedTourney.teams];
        this.selectedTourney.teams = [];

        for (let tn of this.targetTeams) {
            let index = teams.findIndex(e => e.teamName === tn);
            if( index !== -1 ) {
                this.selectedTourney.teams.push(teams[index]);
            }
        }
        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        const subscriber = this.tourneyService.saveTourney(tvo,  this.saveTourneyErrorHandler("Team update failed"));
        subscriber.subscribe(cs => this.next(cs));
    }

    onMoveToTarget(event) {
        console.log("Entering onMoveToTarget()");
        this.returnLabel = "Salva e torna";
        this.teamService.isTeamsChanged=true;
        this.resetAll();
    }

    onMoveToSource(event) {
        console.log("Entering onMoveToSource()" );
        this.returnLabel = "Salva e torna";
        this.teamService.isTeamsChanged=true;
        this.resetAll();

        let missingTeams : Team[] = [];
        for(let at of this.availableTeams) {
            let tn = this.teamService.teamPool.find(x => x.teamName == at);
            if( tn == undefined) {
                let tt =  this.selectedTourney.teams.find(x => x.teamName == at);
                missingTeams.push(tt);
                this.teamService.addMissingTeam( tt );
                this.teamService.isTeamsChanged = true;
            }
        }
    }
 
    newTeam() {
        this.teamService.newTeam = true;
        this.returnLabel = "Salva e torna";
        
        this.router.navigate([TeamDetailView.redirect]);
    }
    
    /**
     * Before to return to the previous page, verifies if we added o removed some teams
     * and, if so, align all the teams list in the tourney
     */
    goBack(): void {
        this.alignTourneyTeams();
        super.goBack();
    }

    private resetAll(): void {
        if( this.isRoundTabEnabled() ) {
            this.cleanRoundMeetings();
        }
        if( this.isPlayoffTabEnabled() ) {
            this.cleanPlayoffMeetings();
        }
        if( this.isEliminatoryTabEnabled() ) {
            this.cleanEliminatoryMeetings();
        }   
        let tvo: TourneyVO = this.prepareTourneyVOForRound();
        this.tourneyService.updateTourneyDeleteAllMeetings(tvo);
    }
 
    private prepareTourneyVOForRound() {
        this.cleanRoundMeetings();
        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        return tvo;
    }

    private cleanRoundMeetings() {
        for (let r of this.selectedTourney.roundVO.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }
        this.selectedTourney.roundVO.rounds = [];
    }

    private cleanPlayoffMeetings() {
        for (let p of this.selectedTourney.playoffVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        this.selectedTourney.playoffVO.playoffs = [];
    }
    
    private cleanEliminatoryMeetings( ) {
        for (let el of this.selectedTourney.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        for (let el of this.selectedTourney.eliminatoryLevels) {
            el.eliminatories = [];
        }
        this.selectedTourney.eliminatoryLevels = [];
    }
 
    private isRoundTabEnabled(): boolean {
        if( !this.containsRound() ) {
            return false;
        }
        return this.teamService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isPlayoffTabEnabled(): boolean {
        if( !this.containsPlayoff() ) {
            return false;
        }
        return this.teamService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private isEliminatoryTabEnabled(): boolean {
        if( !this.containsEliminatory() ) {
            return false;
        }
        return this.teamService.selectedTabIndex <= this.selectedTourney.wizardModeIndex  ? true : false;
    }

    private alignTourneyTeams() {
        if(!this.teamService.isTeamsChanged) {
            return;
        }

        for (let tn of this.targetTeams) {
            let index = this.selectedTourney.teams.findIndex(e => e.teamName === tn);
            if( index === -1 ) {
                let t: Team = this.teamService.teamPool.find(e => e.teamName === tn);
                if( t == undefined || t == null) {
                    continue;
                }
                if(t.operators == undefined) {
                    t.operators = [];
                }
                this.selectedTourney.teams.push(t);
            }
        }    
        console.log("targetTeams.length="+this.targetTeams.length);   
        console.log("selectedTourney.teams.length="+this.selectedTourney.teams.length);   
        let remTeams = [...this.selectedTourney.teams];
        for (let tn of remTeams) {
            console.log("TourneyTeam: " + tn.teamName);
            let found = this.targetTeams.find(e => e === tn.teamName);
            if( found == undefined ) {
                let index = this.selectedTourney.teams.findIndex(e => e.teamName === tn.teamName);
                console.log("FindIndex: " + index);
                let rt :Team[] = this.selectedTourney.teams.splice(index, 1);
                for(let t of rt) {
                    console.log("Removed Team: " + t.teamName);
                }
            } else {
                console.log("Not Removed Team: " + tn.teamName);
            }
        }

        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        const subscriber = this.tourneyService.saveTourney(tvo,  this.saveTourneyErrorHandler("Team update failed"));
        subscriber.subscribe(cs => this.next(cs));
    }

    protected saveTourneyErrorHandler<T> (operation = 'operation', result?: T): any {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                return of(result as T);
            } 
            if( res.error.errorCode == "TourneyAlreadyExists" ) {
                return of(result as T);
            }
      
            return of(result as T);
        };
    }
}
