import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MatrixDetailView } from './matrix-detailview';
import { LevelService } from '../../admin/eliminatory/level-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { AbstractTabResultListView } from '../../common/abstract-tab-result-listview';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';

const REDIRECT_TOURNEY_LV        = 'matrix/';
const REDIRECT_ROUND_RESULT_LV   = 'matrix/lv/roundLv/dv';
const REDIRECT_PLAYOFF_RESULT_LV = 'matrix/lv/playoffLv/dv';
const REDIRECT_ELIMINATORY       = 'matrix/lv/eliminatoryLv/dv';

@Component({
    templateUrl: './tab-matrix-listview.html'
})
export class TabMatrixListView extends AbstractTabResultListView {
    constructor(
        public tourneyService: TourneyService,
        public meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe,
        protected levelService: LevelService
    ) {
        super(MatrixDetailView.matrixDvRedirect
            , tourneyService
            , meetingService
            , meetingRoundService
            , meetingPlayoffService
            , router
            , location
            , dfp
            , levelService
            );
    }

    ngOnInit() {
        super.ngOnInit();
    }
      
    onRoundRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.meetingService.selectedMeetingDb = {id: null
            , tourneyId: this.selectedTourney.id
            , roundId: this.selectedRound.id
            , playoffId: null
            , eliminatoryId: null
        };     
        this.router.navigate([REDIRECT_ROUND_RESULT_LV]);
    }

    onPlayoffRowSelect(event) {
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.meetingService.selectedMeetingDb = {
              id: null
            , tourneyId: this.selectedTourney.id
            , roundId: null
            , playoffId: this.selectedPlayoff.id
            , eliminatoryId: null
        };     
        this.router.navigate([REDIRECT_PLAYOFF_RESULT_LV]);
    }
    
    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");
        this.meetingService.selectedMeetingDb = {
            id: null
          , tourneyId: this.selectedTourney.id
          , roundId: null
          , playoffId: null
          , eliminatoryId: this.selctedEliminatoryLevel.eliminatoryLevel.id
        };     
        
        let indexOf = this.eliminatoryLevelRows.indexOf( this.selctedEliminatoryLevel );
        this.tourneyService.selectedEliminatoryLevelIndex  = indexOf;

        this.tourneyService.selectedEliminatoryLevel = this.selctedEliminatoryLevel.eliminatoryLevel;
         
        this.router.navigate([REDIRECT_ELIMINATORY]);
    }

    goBack(): void {        
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }
}

