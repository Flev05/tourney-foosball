import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';
import { AbstractTabResultListView } from '../../common/abstract-tab-result-listview';
import { TourneyResultListView } from '../tourney/tourney-listview';
import { LoginService } from 'app/tourneyonline/service/login-service';

const REDIRECT_ROUND_RESULT_LV   = 'result/lv/round';
const REDIRECT_PLAYOFF_RESULT_LV = 'result/lv/playoff';
const REDIRECT_ELIMINATORY       = 'result/lv/eliminatoryLv/dv';

@Component({
    templateUrl: './tab-result-listview.html'
})
export class TabResultListView extends AbstractTabResultListView {

    constructor(
        public tourneyService: TourneyService,
        public meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe,
        protected levelService: LevelService,
        public loginService: LoginService
    ) {
        super(MeetingDetailView.meetingDvRedirect
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
        this.meetingService.selectedRound = this.selectedRound;

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
        this.meetingService.selectedRound = this.selectedPlayoff.round;

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
        this.router.navigate([TourneyResultListView.REDIRECT_TOURNEY_LV]);
    }

    refresh(): void {        
        this.ngOnInit();
    }
}

