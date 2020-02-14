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
import { EResultTool } from 'app/tourneyonline/domain/enumerations';

const REDUCED_LV  = '/matrix/lv';
const COMPLETE_LV = '/result/lv';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyResultListView extends AbstractTourneyListView {
    public static REDIRECT_TOURNEY_LV  = 'showtourney/';

    constructor(protected tourneyService: TourneyService
        , protected countryService: CountryService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , public router: Router
        , public location: Location
        , protected dfp: DateFormatPipe
        , protected disciplineService: DisciplineService) 
    { 
        super(COMPLETE_LV, tourneyService, countryService, playerService, teamService, disciplineService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");
        console.log(event.data);
        
        this.tourneyService.loadTourneyById(event.data.id, () => this.onTourneyLoadComplete());
    }

    private onTourneyLoadComplete(): void {
        if( this.tourneyService.selectedTourney.resultTool == EResultTool.C ) {
            this.router.navigate([COMPLETE_LV]);
        } else {
            this.router.navigate([REDUCED_LV]);
        }
    }
}
