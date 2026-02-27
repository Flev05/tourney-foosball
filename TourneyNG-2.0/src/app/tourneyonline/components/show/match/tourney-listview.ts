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
    constructor(protected override tourneyService: TourneyService
        , protected override countryService: CountryService
        , protected override playerService : PlayerService
        , protected override teamService : TeamService
        , public override router: Router
        , public override location: Location
        , protected dfp: DateFormatPipe
        , protected override disciplineService: DisciplineService) 
    { 
        super(redirect, tourneyService, countryService, playerService, teamService, disciplineService, router, location, dfp);
    }

    onRowSelect(event : any) {
        // super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected override gotoDetailView() {
        this.router.navigate([redirect]);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
