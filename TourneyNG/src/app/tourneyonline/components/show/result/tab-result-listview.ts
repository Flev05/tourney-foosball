import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { MeetingPlayoffService } from 'app/tourneyonline/components/admin/playoff/meeting-playoff-service';
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { AbstractTabResultListView } from 'app/tourneyonline/components/common/abstract-tab-result-listview';
import { TourneyResultListView } from '../tourney/tourney-listview';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { ClientService } from 'app/tourneyonline/service/client-service';

const REDIRECT_ROUND_RESULT_LV   = 'result/lv/round';
const REDIRECT_PLAYOFF_RESULT_LV = 'result/lv/playoff';
const REDIRECT_ELIMINATORY       = 'result/lv/eliminatoryLv/dv';
const REDIRECT_ELIMINATORY_B     = 'result/lv/eliminatoryBLv/dv';

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
        public loginService: LoginService,
        protected clientService: ClientService,
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
            , clientService
            );
    }

    ngOnInit() {
        super.ngOnInit();
    }
     
    onRoundRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;
        this.meetingService.selectedRound = this.selectedRound;
        
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

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

        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

        this.meetingService.selectedMeetingDb = {
              id: null
            , tourneyId: this.selectedTourney.id
            , roundId: null
            , playoffId: this.selectedPlayoff.id
            , playoutId: null
            , eliminatoryId: null
            , eliminatoryBId: null
        };     
        this.router.navigate([REDIRECT_PLAYOFF_RESULT_LV]);
    }
    
    onPlayoutRowSelect(event) {
        this.tourneyService.selectedPlayout = this.selectedPlayout;
        this.meetingService.selectedRound = this.selectedPlayout.round;

        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

        this.meetingService.selectedMeetingDb = {
              id: null
            , tourneyId: this.selectedTourney.id
            , roundId: null
            , playoffId: null
            , playoutId: this.selectedPlayout.id
            , eliminatoryId: null
            , eliminatoryBId: null
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
          , playoutId: null
          , eliminatoryId: this.selctedEliminatoryLevel.eliminatoryLevel.id
          , eliminatoryBId: null
        };     
        
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;
        
        let indexOf = this.eliminatoryLevelRows.indexOf( this.selctedEliminatoryLevel );
        this.tourneyService.selectedEliminatoryLevelIndex  = indexOf;

        this.tourneyService.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[indexOf];
        this.router.navigate([REDIRECT_ELIMINATORY]);
    }
        
    onEliminatoryBRowSelect(event) {
        console.log("Entering onEliminatoryBRowSelect()");
        this.meetingService.selectedMeetingDb = {
            id: null
          , tourneyId: this.selectedTourney.id
          , roundId: null
          , playoffId: null
          , playoutId: null
          , eliminatoryId: null
          , eliminatoryBId: this.selctedEliminatoryBLevel.eliminatoryLevel.id
        };     
        
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;
        
        let indexOf = this.eliminatoryBLevelRows.indexOf( this.selctedEliminatoryBLevel );
        this.tourneyService.selectedEliminatoryBLevelIndex  = indexOf;

        this.tourneyService.selectedEliminatoryBLevel = this.selectedTourney.eliminatoryBLevels[indexOf];
        this.router.navigate([REDIRECT_ELIMINATORY_B]);
    }

    goBack(): void {        
        this.router.navigate([TourneyResultListView.REDIRECT_TOURNEY_LV]);
    }

    refresh(): void {        
        this.ngOnInit();
    }
}

