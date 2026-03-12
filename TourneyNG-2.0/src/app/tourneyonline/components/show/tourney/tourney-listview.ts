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
import { EResultTool } from 'app/tourneyonline/domain/enumerations';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';

const MAXTRIX_LV  = '/matrix/lv';
const RESULT_LV = '/result/lv';

@Component({
    templateUrl: './tourney-listview.html',
    standalone: false
})
export class TourneyResultListView extends AbstractTourneyListView {
    public static REDIRECT_TOURNEY_LV  = 'showtourney/';

    constructor(protected override tourneyService: TourneyService
        , protected override countryService: CountryService
        , protected override playerService : PlayerService
        , protected override teamService : TeamService
        , protected meetingRoundService: MeetingRoundService
        , public override router: Router
        , public override location: Location
        , protected dfp: DateFormatPipe
        , protected override disciplineService: DisciplineService) 
    { 
        super(RESULT_LV, tourneyService, countryService, playerService, teamService, disciplineService, router, location, dfp);
    }

    override ngOnInit() {
        super.ngOnInit();
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }

    onRowSelect(event : any) {
        console.log("Entering onRowSelect()");
        console.log(event.data);
        this.teamService.readOnly = true;
        this.tourneyService.loadTourneyById(event.data.id, () => this.onTourneyLoadComplete(), e => this.serverUnreachableHandler(e));
    }

    private onTourneyLoadComplete(): void {
        if( this.tourneyService.selectedTourney.resultTool == EResultTool.C ) {
            this.router.navigate([RESULT_LV]);
        } else {
            this.router.navigate([MAXTRIX_LV]);
        }
    }

    openPdf(url: string) {
        window.open(url, '_blank');
    }
    
    public printPdfMeeting(tId : number) {
        console.log("printPdfMeeting(" + tId + ")");
        this.tourneyService.loadTourneyById(tId, () => this.onTourneyForPrintLoadComplete(), e => this.serverUnreachableHandler(e));
    }

    private onTourneyForPrintLoadComplete(): void {
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.meetingRoundService.printPdfMeeting(this.selectedTourney);
    }
}
