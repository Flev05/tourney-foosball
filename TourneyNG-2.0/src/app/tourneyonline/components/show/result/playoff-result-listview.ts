import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingPlayoffService } from 'app/tourneyonline/components/admin/playoff/meeting-playoff-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { AbstractPlayoffResultListView } from 'app/tourneyonline/components/common/abstract-playoff-result-listview';
import { ClassificationDetailView } from '../classification/classification-detailview';
import { Classification } from 'app/tourneyonline/domain/classification';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { TeamService } from 'app/tourneyonline/service/team-service';

@Component({
    templateUrl: './playoff-result-listview.html',
    styleUrls: ['../classification/classification-view.css']
})
export class PlayoffResultListView extends AbstractPlayoffResultListView {
    addTeamEnabled = false;
    tourneyTeams = true;
    selectedClassificationRow: Classification = new Classification();
    onewayCurrentDay: number = 1;
    roundtripCurrentDay: number = 1;

    constructor( public override tourneyService: TourneyService
        , protected override meetingPlayoffService: MeetingPlayoffService
        , protected override meetingService: MeetingService
        , protected override router: Router
        , protected override location: Location
        , protected override dfp: DateFormatPipe
        , protected override levelService: LevelService
        , public loginService: LoginService
        , private teamService: TeamService
    ) {
        super(MeetingDetailView.meetingDvRedirect
            , tourneyService
            , meetingPlayoffService
            , meetingService
            , router
            , location
            , dfp
            , levelService
            );
    }

    override ngOnInit() {
        super.ngOnInit();
        this.onewayCurrentDay = this.selectedPlayoff.round.onewayCurrentDay;
        this.roundtripCurrentDay = this.selectedPlayoff.round.roundtripCurrentDay;

        this.teamService.setMeetingAddress(this.onewayMeetings,this.roundtripMeetings);
    }

    prevOnewayDay() : void {
        this.onewayCurrentDay--;
        if( this.onewayCurrentDay < 1 ) {
            this.onewayCurrentDay = 1;
        }
        this.setOnewayCurrentDay(this.onewayCurrentDay);
    }

    nextOnewayDay() : void {
        this.onewayCurrentDay++;
        if( this.onewayCurrentDay > this.selectedPlayoff.round.daysNo  ) {
            this.onewayCurrentDay = this.selectedPlayoff.round.daysNo;
        }
        this.setOnewayCurrentDay(this.onewayCurrentDay);
    }

    prevRoundtripDay() : void {
        this.roundtripCurrentDay--;
        if( this.roundtripCurrentDay < 1 ) {
            this.roundtripCurrentDay = 1;
        }
        this.setRoundtripCurrentDay(this.roundtripCurrentDay);
    }
    nextRoundtripDay() : void {
        this.roundtripCurrentDay++;
        if( this.roundtripCurrentDay > this.selectedPlayoff.round.daysNo  ) {
            this.roundtripCurrentDay = this.selectedPlayoff.round.daysNo;
        }
        this.setRoundtripCurrentDay(this.roundtripCurrentDay);
    }
     
    onClassifcationRowSelect(even : any) {
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.selectedPlayoff.round.name);
        this.router.navigate([ClassificationDetailView.redirect]);
    }
}

