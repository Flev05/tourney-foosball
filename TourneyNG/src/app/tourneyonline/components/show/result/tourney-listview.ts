import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';

@Component({
      templateUrl: './tourney-listview.html'   
})
export class ResultTourneyListView extends AbstractTourneyListView {
    static redirect: string = '/result/lv';

    constructor(protected tourneyService: TourneyService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , public router: Router
        , public location: Location
        , protected dfp: DateFormatPipe
        , protected disciplineService: DisciplineService) 
    { 
        super(ResultTourneyListView.redirect, tourneyService, playerService, teamService, router, location, dfp, disciplineService);
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
