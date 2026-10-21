import { Component, OnInit } from '@angular/core';
import { TourneyService } from '../../../service/tourney-service';
import { Router } from '@angular/router';
import { TourneyDetailView } from './tourney-detailview';
import { CountryService } from '../../../service/country-service';
import { DisciplineService } from '../../../service/discipline-service';
import { PlayerService } from '../../../service/player-service';
import { TeamService } from '../../../service/team-service';

@Component({
    template: "",
    standalone: false
})
export class NewTourneyDetailView implements OnInit {
    static redirect: string = 'admintourney/newdv';

    constructor(
        protected tourneyService: TourneyService
        , protected countryService: CountryService
        , protected disciplineService: DisciplineService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , private router: Router 
    ) { 
    }

    ngOnInit() {
        console.log("NewTourneyDetailView.ngOnInit() "); 
        
        this.tourneyService.newTourney = true;
        this.playerService.loadAllPlayers();
        // this.teamService.readOnly = false;
        this.teamService.loadAllTeams();
        this.disciplineService.loadAllDisciplines( () => this.loadAllDisciplinesComplete() );            
    }

    private loadAllDisciplinesComplete(): void {
        this.countryService.loadAllCountries( () => this.onLoadAllCountriesComplete() );
    }

    private onLoadAllCountriesComplete():  void {
        this.router.navigate([TourneyDetailView.redirect]);
    }
}


