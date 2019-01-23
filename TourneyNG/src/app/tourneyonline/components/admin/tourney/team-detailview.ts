import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Player } from 'app/tourneyonline/domain/player';

@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {

    selectedTeam: Team;

    toggleable: boolean = false;

    availablePlayers: Player[] = [];

    fullAddress: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        private   teamService: TeamService,
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedTeam = this.teamService.selectedTeam;

        if(this.teamService.newTeam) {
            this.selectedTeam.id = this.tourneyService.getSequenceNumber(); 
            this.selectedTeam.players = [];
            this.teamService.newTeam = false;
        }

        this.availablePlayers = [];

        let alreadyInTeam: Player[] = [];
        for(let i=0; i<this.selectedTourney.teams.length; i++ ) {
            let t = this.selectedTourney.teams[i];
            let p = t.players;
            for(let j=0; j<p.length; j++ ) {
                alreadyInTeam.push(p[j]);
            }
        }

        for(let i=0; i<this.selectedTourney.players.length; i++ ) {
            let ap = this.selectedTourney.players[i];

            let found: boolean = false;
            for(let j=0; j<alreadyInTeam.length; j++ ) {
                let tp = alreadyInTeam[j];
        
                if(ap.id == tp.id) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.availablePlayers.push(ap);
            }
        }

        if(this.selectedTeam.country!=undefined) {
            this.fullAddress = this.selectedTeam.address + " - " 
                + this.selectedTeam.country.zipCode + " " + this.selectedTeam.country.city
                + " (" + this.selectedTeam.country.provinceCode +")";
        }
    }
 
    onError(n:any) {
        let msgerr: string = 'Creazione/Modifica nuova squadra fallita';
        console.log(msgerr);
    }
}
