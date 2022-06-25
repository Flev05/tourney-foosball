import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

const redirect = '/match/meetinglv';

@Component({
    templateUrl: './tourney-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
    `]
})
export class MatchTourneyListView extends AbstractTourneyListView {
    constructor(protected tourneyService: TourneyService
        , protected countryService: CountryService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , public router: Router
        , public location: Location
        , protected dfp: DateFormatPipe
        , protected disciplineService: DisciplineService) 
    { 
        super(redirect, tourneyService, countryService, playerService, teamService, disciplineService, router, location, dfp);
    }

    onRowSelect(event) {
        // super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
