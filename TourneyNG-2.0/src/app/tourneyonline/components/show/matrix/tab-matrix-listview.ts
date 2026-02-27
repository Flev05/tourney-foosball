import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { AbstractTabResultListView } from 'app/tourneyonline/components/common/abstract-tab-result-listview';
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { MeetingPlayoffService } from 'app/tourneyonline/components/admin/playoff/meeting-playoff-service';
import { TourneyResultListView } from '../tourney/tourney-listview';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

const REDIRECT_ROUND_MATRIX_LV   = 'matrix/lv/roundLv/dv';
const REDIRECT_PLAYOFF_MATRIX_LV = 'matrix/lv/playoffLv/dv';
const REDIRECT_ELIMINATORY       = 'matrix/lv/eliminatoryLv/dv';

@Component({
    templateUrl: './tab-matrix-listview.html'
})
export class TabMatrixListView extends AbstractTabResultListView {
    constructor(
        public override tourneyService: TourneyService,
        public override meetingService: MeetingService,
        protected override meetingRoundService: MeetingRoundService,
        protected override meetingPlayoffService: MeetingPlayoffService,
        protected override router: Router,
        protected override location: Location,
        protected override dfp: DateFormatPipe,
        protected override levelService: LevelService,
        protected override clientService: ClientService,
    ) {
        super(""
            , tourneyService
            , meetingService
            , meetingRoundService
            , meetingPlayoffService
            , router
            , location
            , dfp
            , levelService
            , clientService
            );
    }

    override ngOnInit() {
        super.ngOnInit();
    }
      
    onRoundRowSelect(event : any) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.meetingService.selectedMeetingDb = new MeetingDb();
        
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id;
        this.meetingService.selectedMeetingDb.roundId = this.selectedRound.id;
        this.meetingService.selectedMeetingDb.eliminatoryId = null;
        this.meetingService.selectedMeetingDb.eliminatoryBId = null;
             
        this.router.navigate([REDIRECT_ROUND_MATRIX_LV]);
    }

    onPlayoffRowSelect(event : any) {
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.meetingService.selectedMeetingDb = new MeetingDb();
        
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id;
        this.meetingService.selectedMeetingDb.playoffId = this.selectedPlayoff.id;
        this.meetingService.selectedMeetingDb.roundId = null;
        this.meetingService.selectedMeetingDb.eliminatoryId = null;
        this.router.navigate([REDIRECT_PLAYOFF_MATRIX_LV]);
    }
    
    onEliminatoryRowSelect(event : any) {
        console.log("Entering onEliminatoryRowSelect()");
        this.meetingService.selectedMeetingDb = new MeetingDb();
        
        this.meetingService.selectedMeetingDb.id = null;
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id,
        this.meetingService.selectedMeetingDb.roundId = null;
        this.meetingService.selectedMeetingDb.playoffId = null;
        this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedEliminatoryLevel.eliminatoryLevel.id;
 
        let indexOf = this.eliminatoryLevelRows.indexOf( this.selectedEliminatoryLevel );
        this.tourneyService.selectedEliminatoryLevelIndex  = indexOf;

        this.tourneyService.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[indexOf];
         
        this.router.navigate([REDIRECT_ELIMINATORY]);
    }

    override goBack(): void {        
        this.router.navigate([TourneyResultListView.REDIRECT_TOURNEY_LV]);
    }
}

