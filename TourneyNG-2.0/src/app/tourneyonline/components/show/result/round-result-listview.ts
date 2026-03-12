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
    styleUrls: ['../classification/classification-view.css'],
    standalone: false
})
export class RoundResultListView extends AbstractRoundResultListView {
    selectedClassificationRow: Classification = new Classification();
    onewayCurrentDay: number = 1;
    roundtripCurrentDay: number = 1;
    
    constructor( public override tourneyService: TourneyService
        , protected override meetingRoundService: MeetingRoundService
        , public override meetingService: MeetingService
        , protected override router: Router 
        , protected override location: Location
        , protected override dfp: DateFormatPipe
        , protected override teamService: TeamService
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

    override ngOnInit() {
        super.ngOnInit();
        this.onewayCurrentDay = this.selectedRound.onewayCurrentDay;
        this.roundtripCurrentDay = this.selectedRound.roundtripCurrentDay;
        this.meetingService.blockedDocument = false;

        this.teamService.setMeetingAddress(this.onewayMeetings, this.roundtripMeetings);
    }

    public getWeekOneway() : string {
        if( this.onewayMeetings.length == 0 ) {
            return "";
        }
        let ii = 0;
        if( this.onewayMeetings[0].isSkiping) {
            if( this.onewayMeetings.length <= 1 ) {
                return "";
            }
            ii = 1;
        }
        let day : Date = new Date(this.onewayMeetings[ii].datetime);
        return this.meetingService.getWeekDaysRange(day);
    }

    public getWeekRoundtrip() : string {
        if( this.roundtripMeetings.length == 0 ) {
            return "";
        }
        let ii = 0;
        if( this.roundtripMeetings[0].isSkiping) {
            if( this.roundtripMeetings.length <= 1 ) {
                return "";
            }
            ii = 1;
        }
        let day : Date = new Date(this.roundtripMeetings[ii].datetime);
        return this.meetingService.getWeekDaysRange(day);
    }

    /**
     * Shows this token composition:
     * 
     * @returns {{selectedRound.name}} {{onewayCurrentDay}}/{{allDaysNo}} 
     */
    public getHeaderOneway() : string {
        let rn = this.selectedRound.name;
        return this.onewayCurrentDay + "/" + this.roundDaysNo + "(" + (this.onewayCurrentDay ) + "/" + this.allDaysNo + ") " + rn;
    }

    /**
     * Shows this token composition:
     * 
     * @returns {{selectedRound.name}} {{roundtripCurrentDay}}/{{roundDaysNo}} ({{roundDaysNo + roundtripCurrentDay}}/{{allDaysNo}})
     */
    public getHeaderRoundtrip() : string {
        let rn = this.selectedRound.name;
        return this.roundtripCurrentDay + "/" + this.roundDaysNo + "(" + (this.roundDaysNo + this.roundtripCurrentDay) + "/" + this.allDaysNo + ") " + rn;
    }

    prevOnewayDay() : void {
        this.onewayCurrentDay--;
        if( this.onewayCurrentDay < 1 ) {
            this.onewayCurrentDay = 1;
        }
        this.setOnewayCurrentDay(this.onewayCurrentDay);
        if( this.onewayMeetings[0].name.indexOf ('(Riposo)') != -1 ) {
            this.onewayMeetings[0].datetime = this.onewayMeetings[1].datetime;
        }
    }
    nextOnewayDay() : void {
        this.onewayCurrentDay++;
        if( this.onewayCurrentDay > this.selectedRound.daysNo ) {
            this.onewayCurrentDay = this.selectedRound.daysNo;
        }
        this.setOnewayCurrentDay(this.onewayCurrentDay);
        if( this.onewayMeetings[0].name.indexOf ('(Riposo)') != -1 ) {
            this.onewayMeetings[0].datetime = this.onewayMeetings[1].datetime;
        }
    }

    prevRoundtripDay() : void {
        this.roundtripCurrentDay--;
        if( this.roundtripCurrentDay < 1 ) {
            this.roundtripCurrentDay = 1;
        }
        this.setRoundtripCurrentDay(this.roundtripCurrentDay);
         if( this.roundtripMeetings[0].name.indexOf ('(Riposo)') != -1 ) {
            this.roundtripMeetings[0].datetime = this.roundtripMeetings[1].datetime;
        }
    }
    nextRoundtripDay() : void {
        this.roundtripCurrentDay++;
        if( this.roundtripCurrentDay > this.selectedRound.daysNo ) {
            this.roundtripCurrentDay = this.selectedRound.daysNo;
        }
        this.setRoundtripCurrentDay(this.roundtripCurrentDay);
         if( this.roundtripMeetings[0].name.indexOf ('(Riposo)') != -1 ) {
            this.roundtripMeetings[0].datetime = this.roundtripMeetings[1].datetime;
        }
    }

    onClassifcationRowSelect(event : any) {
        console.log(event.data);
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.selectedRound.name);
        this.router.navigate([ClassificationDetailView.redirect]);
    }  
}

