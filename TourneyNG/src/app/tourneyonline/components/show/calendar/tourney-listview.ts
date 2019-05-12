import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

@Component({
    templateUrl: './tourney-listview.html'
})
export class CalendarTourneyListView extends AbstractTourneyListView  {
    static redirect = '/calendar/lv';

    constructor(protected tourneyService: TourneyService
        , protected countryService: CountryService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe
        , protected disciplineService: DisciplineService) 
    { 
        super(CalendarTourneyListView.redirect, tourneyService, countryService, playerService, teamService, disciplineService, router, loc, dfp);
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }

    protected onComplete(): any {
        super.onLoadAllTourneysComplete();

        if( this.tourneyService.selectedTourney != undefined ) {
            this.router.navigate([this.redirect]);
        }
    }
}
