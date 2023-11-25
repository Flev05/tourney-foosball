import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { AbstractRoundResultListView } from 'app/tourneyonline/components/common/abstract-round-result-listview';
import { Classification } from 'app/tourneyonline/domain/classification';
import { ClassificationDetailView } from '../classification/classification-detailview';
import { LoginService } from 'app/tourneyonline/service/login-service';

@Component({
    templateUrl: './round-result-listview.html',
    styleUrls: ['../classification/classification-view.css']
})
export class RoundResultListView extends AbstractRoundResultListView {
    addTeamEnabled = false;
    tourneyTeams = true;    
    selectedClassificationRow: Classification;
    onewayCurrentDay: number = 1;
    roundtripCurrentDay: number = 1;
    
    constructor( public tourneyService: TourneyService
        , protected meetingRoundService: MeetingRoundService
        , public meetingService: MeetingService
        , protected router: Router 
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected teamService: TeamService
        , public loginService: LoginService
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
        this.onewayCurrentDay = this.selectedRound.onewayCurrentDay;
        this.roundtripCurrentDay = this.selectedRound.roundtripCurrentDay;
        this.meetingService.blockedDocument = false;

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
        if( this.onewayCurrentDay > this.selectedRound.daysNo  ) {
            this.onewayCurrentDay = this.selectedRound.daysNo;
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
        if( this.roundtripCurrentDay > this.selectedRound.daysNo  ) {
            this.roundtripCurrentDay = this.selectedRound.daysNo;
        }
        this.setRoundtripCurrentDay(this.roundtripCurrentDay);
    }

    onClassifcationRowSelect(event) {
        console.log(event.data);
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.selectedRound.name);
        this.router.navigate([ClassificationDetailView.redirect]);
    }
}

