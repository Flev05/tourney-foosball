import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

const redirect = '/matrix/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class MatrixTourneyListView extends AbstractTourneyListView {
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

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");
        console.log(event.data);
        this.tourneyService.loadTourneyById(event.data.id, () => this.gotoDetailView());
    }
}
