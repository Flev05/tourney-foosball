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
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Match } from 'app/tourneyonline/domain/match';
import { AbstractRoundVO } from 'app/tourneyonline/domain/abstract-round-vo';
import { MeetingStatus, TourneyType } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';

@Component({
    templateUrl: './round-result-listview.html',
    styleUrls: ['../classification/classification-view.css'],
    standalone: false
})
export class RoundResultListView extends AbstractRoundResultListView {
    selectedClassificationRow: Classification = new Classification();
    onewayCurrentDay: number = 1;
    roundtripCurrentDay: number = 1;
     
    private selectedMeeting: Meeting = new Meeting();
    private matches: Match[] = [];
    fullOnewayMeetings : Meeting[] = [];
    abstractRoundVO: AbstractRoundVO = new AbstractRoundVO();
    detachedClassificationRows: any[] = [];
    normalizedClassificationRows: any[] = [];
    qualifiedTeamNum : number = 0;
    normalizesRound: boolean = false;
    
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
        this.abstractRoundVO = this.meetingService.abstractRoundVO;
        this.teamService.setMeetingAddress(this.onewayMeetings, this.roundtripMeetings);

        if( this.isDaily() ) {
            this.meetingRoundService.reloadRoundMeeting(this.selectedTourney, this.selectedRound, () => this.onReloadRoundMeetingsComplete() );
        }
    }

    private onReloadRoundMeetingsComplete(): void {
        this.tourneyService.createClassification(this.selectedRound, true);
        this.detachedClassificationRows = this.tourneyService.prepareDetachedRoundsGui(this.selectedRound, this.selectedTourney.roundVO.maxMatchesPerMeeting);
        let topEl : EliminatoryLevel = this.selectedTourney.eliminatoryLevels[0];
        let selectedTeamsNo = topEl.topLevelTeamNo;
        const R : number = this.selectedTourney.roundVO.rounds.length; // R: the number of rounds, ex = 5
        const q : number = Math.floor(selectedTeamsNo / R);
        this.qualifiedTeamNum = q; // powerOf2 / roundNo 
        let minTeamsPerRound : number = this.selectedTourney.roundVO.rounds[R-1].classification.length;
        this.normalizesRound = this.selectedRound.classification.length > minTeamsPerRound;
        this.normalizedClassificationRows = [];
        if( this.normalizesRound ) {
            this.tourneyService.normalizeClassificationList(this.selectedRound, this.qualifiedTeamNum);
            this.normalizedClassificationRows = this.tourneyService.prepareNormalizedRoundsGui(this.selectedTourney.roundVO.maxMatchesPerMeeting, [this.selectedRound]);
        }
        this.selectedRound.status = this.tourneyService.setRoundStatus(this.selectedRound);

        this.meetingRoundService.prepareMeetingsMap(this.selectedRound);
        const daysNo = this.selectedRound.daysNo;
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();
        for (let md = 1; md <= daysNo; md++) {
            let meetings: Meeting[] = this.meetingRoundService.getOnewayMeetingsOfDay(md)  ;
            const filteredMeetings = meetings.filter(meeting => 
                !meeting.teamName1?.includes('Riposo') && 
                !meeting.teamName2?.includes('Riposo')
            );
            // Only add the day to the map if it still has matches after filtering
            if (filteredMeetings.length > 0) {
                this.roundtripMeetingDaysMap.set(md, filteredMeetings);
            }
        }
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
        return this.onewayCurrentDay + "°/" + this.roundDaysNo + "(" + (this.onewayCurrentDay ) + "°/" + this.allDaysNo + ") " + rn;
    }

    /**
     * Shows this token composition:
     * 
     * @returns {{selectedRound.name}} {{roundtripCurrentDay}}/{{roundDaysNo}} ({{roundDaysNo + roundtripCurrentDay}}/{{allDaysNo}})
     */
    public getHeaderRoundtrip() : string {
        let rn = this.selectedRound.name;
        return this.roundtripCurrentDay + "°/" + this.roundDaysNo + "(" + (this.roundDaysNo + this.roundtripCurrentDay) + "°/" + this.allDaysNo + ") " + rn;
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
        this.router.navigate([ClassificationDetailView.redirect], { 
            queryParams: { detachedClassificationPoint: -1 }
        });
    }  

    onDetachedClassifcationRowSelect(event : any) {
        console.log(event.data);
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.selectedRound.name);
        this.tourneyService.detachedClassificationRows = this.detachedClassificationRows;
        this.router.navigate([ClassificationDetailView.redirect], { 
            queryParams: { detachedClassificationPoint: this.selectedClassificationRow.dpoints }
        });
    }  
    
    public isDaily() : boolean {
        return this.selectedTourney.isDaily === 'true';
    }
     
    updateScore(meeting: Meeting, field: string, value: number) {
        this.selectedMeeting = meeting;
        this.matches = meeting.matches;
        if( field === 'score1') {
            this.matches[0].score1 = value;
            this.selectedMeeting.vpoints1 = value;
            this.matches[0].score2 = this.abstractRoundVO.pointsNeededToWin;     
            this.selectedMeeting.vpoints2 = this.abstractRoundVO.pointsNeededToWin;
        }
        if( field === 'score2') {
            this.matches[0].score2 = value;     
            this.selectedMeeting.vpoints2 = value;
            this.matches[0].score1 = this.abstractRoundVO.pointsNeededToWin;
            this.selectedMeeting.vpoints1 = this.abstractRoundVO.pointsNeededToWin;
        }
        this.selectedMeeting.status = MeetingStatus.InProgress;
        if( this.matches[0].score1 >= this.abstractRoundVO.matchWinnerScores || this.matches[0].score2 >= this.abstractRoundVO.matchWinnerScores) {
            this.selectedMeeting.status = MeetingStatus.Terminated;
        }
        if( this.matches[0].score1 == 0 && this.matches[0].score2 == 0) {
            this.selectedMeeting.status = MeetingStatus.ToPlay;
        }

        this.saveMeeting();
    }

    private saveMeeting() {
        this.selectedMeeting.points1 = 0;
        this.selectedMeeting.points2 = 0;
        let goals1 = 0;
        let goals2 = 0;

        for(let i=0; i<this.matches.length; i++) {
            let m = this.matches[i];
            m.status = this.selectedMeeting.status;
            goals1 = m.score1;
            goals2 = m.score2;

            if (goals1 > goals2) {
                if (this.selectedTourney.tourneyType == TourneyType.Score) {
                    if (goals1==this.abstractRoundVO.pointsNeededToWin && (goals1 == goals2 + 1)) {
                        this.selectedMeeting.points1 += this.abstractRoundVO.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.points2 += this.abstractRoundVO.pointsGoldenGoalTieBreakDefeat;
                    } else {
                        this.selectedMeeting.points1 += this.abstractRoundVO.matchWinnerScores;
                    }
                } else {
                    this.selectedMeeting.points1 += this.abstractRoundVO.matchWinnerScores;
                } 
                this.selectedMeeting.matches1++;
            } 
                        
            if (goals2 > goals1) {
                this.selectedMeeting.matches2++;
                if (this.selectedTourney.tourneyType == TourneyType.Score) {
                    if (goals2==this.abstractRoundVO.pointsNeededToWin && (goals2 == goals1 + 1)) {
                        this.selectedMeeting.points2 += this.abstractRoundVO.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.points1 += this.abstractRoundVO.pointsGoldenGoalTieBreakDefeat;
                    } else {
                        this.selectedMeeting.points2 += this.abstractRoundVO.matchWinnerScores;
                    }
                } else {
                    this.selectedMeeting.points2 += this.abstractRoundVO.matchWinnerScores;
                }
            }

            if (goals1 == goals2) {
                if (this.selectedTourney.tourneyType == TourneyType.Score ) {
                    if (goals1 != 0) {
                        this.selectedMeeting.points2 += this.abstractRoundVO.matchBalanceScores;
                        this.selectedMeeting.points1 += this.abstractRoundVO.matchBalanceScores;        
                    }
                } else {
                    this.selectedMeeting.points2 += this.abstractRoundVO.matchBalanceScores;
                    this.selectedMeeting.points1 += this.abstractRoundVO.matchBalanceScores;        
                }
            }
        }

        // this.tourneyService.cleanRoundMeeting(this.selectedTourney);
        const observer = this.meetingService.saveRoundMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedRound.id, e => this.serverUnreachableHandler(e));
        observer.subscribe(m => this.saveMeetingNextCallback(m), e => this.serverUnreachableHandler(e));
    }
    
    private saveMeetingNextCallback(m: MeetingDb) {   
        console.log("Entering saveMeetingNextCallback("+m+")");  
    }

    public isInWizardMode() {
        return this.selectedTourney.wizardModeIndex >= 0;
    }
}
