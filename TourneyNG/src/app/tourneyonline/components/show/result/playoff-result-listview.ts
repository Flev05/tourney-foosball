import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DateFormatPipe } from '../../common/date-format-pipe';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingDetailView } from './meeting-detailview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractRuleListView } from '../../common/abstract-rule-listview';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';

const REDIRECT_TEAM_DV      = 'admintourney/dv/team';

@Component({
    templateUrl: './playoff-result-listview.html'
})
export class PlayoffResultListView extends AbstractRuleListView {
    static redirect: string = "result/lv/meetingLv/dv";
    cols: TableCols[] ;
    
    selectedRow: Meeting;

    selectedPlayoff: Playoff;
    
    meetingsNoMsg: string;
    onewayDaysNo: number;
    roundtripDaysNo: number;
    
    onewayDays: any[];

    roundtripMeetingDaysMap: Map<number, Meeting[]>;
    roundtripDays: any[];

    isRoundTrip: boolean;
    allDaysNo: number;
    daysNoMsg: string;
    
    mdbList: MeetingDb[];
   
    classificationCols: any[];
    playoffClassification: any[];

    teamsCols = TeamService.cols;

    playoffTeams: Team[];
    pageSize: number = 10;
    onewayMeetings: Meeting[];
    roundtripMeetings: Meeting[];

    constructor( public tourneyService: TourneyService
        , private meetingPlayoffService: MeetingPlayoffService
        , private meetingService: MeetingService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , private teamService: TeamService
        , private playerService: PlayerService
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.meetingPlayoffService.selectedTourney = this.selectedTourney;
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
     
        this.classificationCols = this.tourneyService.classificationCols;
        this.cols = this.tourneyService.resultCols;

        this.playoffTeams = TeamService.getTeamsByNames(this.selectedTourney, this.selectedPlayoff.round.teamNames);

        this.allDaysNo = this.selectedPlayoff.round.daysNo;
        this.pageSize  = this.selectedPlayoff.round.pageSize;
        this.onewayMeetings    = this.selectedPlayoff.round.onewayMeetings;
        this.roundtripMeetings = this.selectedPlayoff.round.roundtripMeetings;

        console.log("[Meetings " + this.onewayMeetings.length + "]");
        console.log("[Days     " + this.allDaysNo + "]");
        console.log("[PageSize " + this.pageSize + "]");

        if (this.selectedTourney.isOnewayPlayoff == "true") {
            this.meetingsNoMsg = "" + this.onewayMeetings.length + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + this.onewayMeetings.length * 2 + " in " + this.allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
        
        this.preparePlayoffClassification(this.selectedPlayoff);
    }

    /**
     * Prepares the classification relatid to the selected playoff
     */
    private preparePlayoffClassification(playoff : Playoff): void {
        this.playoffClassification = this.tourneyService.prepareRoundsGui([playoff.round]);
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.tourneyService.selectedPlayoffTabIndex = index;
    }
  
    onRowSelect(event) {
        console.log(event.data);

        this.meetingPlayoffService.selectedMeeting = this.selectedRow;
        this.meetingService.selectedMeeting = this.selectedRow;
        this.meetingService = this.meetingPlayoffService;

        if( this.selectedRow.isDummy) {
            return;
        }

        this.gotoDetailView();
    }

    onTeamRowSelect(event) {
        console.log("Entering onTeamRowSelect()");
        console.log(event.data);

        this.teamService.selectedTeam = event.data;

        this.playerService.addPlayerButton = false;
        this.router.navigate([REDIRECT_TEAM_DV]);
    }
}

