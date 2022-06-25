import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {
    public static redirect: string = "adminteam/dv";
    public static CHANGE_TEAM_NAME_POPUP: string = 'ATTENZIONE! Se si cambia il nome della squadra, si perdono tutte le impostazioni preesistenti. Confermi?';

    selectedTeam: Team;
    previousTeamName: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        public teamService: TeamService
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
        this.previousTeamName = this.selectedTeam.teamName;
        this.teamService.teamAlreadyExists = false;
    }

    saveTourneyTeam() {     
        if(this.teamService.newTeam) {
            this.teamService.saveTourneyTeam(this.selectedTourney, true, this.selectedTeam, () => super.goBack());
            return;
        }
        if( this.previousTeamName != this.selectedTeam.teamName ) {
            if(!confirm(TeamDetailView.CHANGE_TEAM_NAME_POPUP)) {
                return;
            }
            this.teamService.saveTourneyTeam(this.selectedTourney, true, this.selectedTeam, () => super.goBack());
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
