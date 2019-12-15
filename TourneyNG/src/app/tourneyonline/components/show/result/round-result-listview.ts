import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';
import { AbstractRoundResultListView } from '../../common/abstract-round-result-listview';

@Component({
    templateUrl: './round-result-listview.html'
})
export class RoundResultListView extends AbstractRoundResultListView {
    constructor( public tourneyService: TourneyService
        , protected meetingRoundService: MeetingRoundService
        , protected meetingService: MeetingService
        , protected router: Router 
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected teamService: TeamService
    ) {
        super(MeetingDetailView.meetingDvRedirect
            , tourneyService
            , meetingRoundService
            , meetingService
            , router
            , location
            , dfp
            , teamService
        );
    }

    ngOnInit() {
        super.ngOnInit();
    }
}

