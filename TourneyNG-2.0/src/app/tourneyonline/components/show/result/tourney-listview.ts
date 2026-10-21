import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

@Component({
    templateUrl: './tourney-listview.html',
    standalone: false
})
export class ResultTourneyListView extends AbstractTourneyListView {
    static redirect: string = '/result/lv';

    constructor(protected override tourneyService: TourneyService
        , protected override countryService: CountryService
        , protected override playerService : PlayerService
        , protected override teamService : TeamService
        , public override router: Router
        , public override location: Location
        , protected dfp: DateFormatPipe
        , protected override disciplineService: DisciplineService) 
    { 
        super(ResultTourneyListView.redirect, tourneyService, countryService, playerService, teamService, disciplineService, router, location, dfp);
    }

    // protected filter(tourneys: Tourney[]): Tourney[] {
    //     return tourneys;
    // }

    onRowSelect(event : any) {
        console.log("Entering onRowSelect()");
        console.log(event.data);
        this.tourneyService.loadTourneyById(event.data.id, () => this.gotoDetailView(), e => this.serverUnreachableHandler(e));
    }
}
