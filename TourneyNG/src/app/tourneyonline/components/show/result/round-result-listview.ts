import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingDetailView } from './meeting-detailview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { AbstractListView } from '../../common/abstract-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';

const REDIRECT_TEAM_DV      = 'admintourney/dv/team';

@Component({
    templateUrl: './round-result-listview.html'
})
export class RoundResultListView extends AbstractListView {
    static redirect: string = "result/lv/meetingLv/dv";
    cols: TableCols[];
    
    selectedRow: Meeting;

    selectedRound: Round;
    
    meetingsNoMsg: string;
    onewayDaysNo: number;
    roundtripDaysNo: number;
    
    onewayMeetingDaysMap: Map<number, Meeting[]>;
    onewayDays: any[];

    roundtripMeetingDaysMap: Map<number, Meeting[]>;
    roundtripDays: any[];

    isRoundTrip: boolean;
    allDaysNo: number;
    daysNoMsg: string;
    
    mdbList: MeetingDb[];
    incompleteRoundConfiguration: boolean;
    
    classificationCols: any[];
    classificationRows: any[];
    
    teamsCols = TeamService.cols;
    roundTeams: Team[];
    pageSize: number = 10;
    onewayMeetings: Meeting[];
    roundtripMeetings: Meeting[];

    constructor( public tourneyService: TourneyService
        , private meetingRoundService: MeetingRoundService
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
        this.cols = this.tourneyService.resultCols;

        this.selectedRound = this.tourneyService.selectedRound;
        
        this.classificationCols = this.tourneyService.classificationCols;

        this.selectedRound = this.tourneyService.selectedRound;
        this.roundTeams = TeamService.getTeamsByNames(this.selectedTourney, this.selectedRound.teamNames);

        this.isRoundTrip = true;

        const subsbr = this.meetingRoundService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onCompleteLoad());
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.tourneyService.selectedRoundTabIndex = index;
    }

    private onCompleteLoad(): void {
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.meetingRoundService.onCompleteLoad(this.selectedRound, this.mdbList);

        this.pageSize = this.selectedRound.pageSize;
        this.allDaysNo = this.selectedRound.daysNo;

        this.onewayMeetings = this.selectedRound.onewayMeetings.map( (m, index, ms) => this.mapCallback(m, index, ms));
        this.onewayMeetings.forEach(m => m.containerId = this.selectedRound.id);
        this.roundtripMeetings = this.selectedRound.roundtripMeetings.filter( (m, index, ms) => this.filterCallback(m, index, ms) );
        this.roundtripMeetings.forEach(m => m.containerId = this.selectedRound.id);

        console.log("[OnewayMeetings    " + this.onewayMeetings.length + "]");
        console.log("[RoundtripMeetings " + this.roundtripMeetings.length + "]");
        console.log("[Days              " + this.allDaysNo + "]");
        console.log("[PageSize          " + this.pageSize + "]");

        if (this.selectedTourney.isOnewayRound == "true") {
            this.isRoundTrip = false;
            this.meetingsNoMsg = "" + this.onewayMeetings.length + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + this.onewayMeetings.length * 2 + " in " + this.allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }

        this.prepareRoundGuiClassification();
    }

    private mapCallback (m: Meeting, index: number, array: Meeting[]): Meeting {
        if(m.isSkiping) {
            m.points1 = 0;
            m.points2 = 0;
        }
        return m;
    } 
    
    private filterCallback (m: Meeting, index: number, array: Meeting[]): boolean   {
        return true;
    }

    /**
     * Prepares the classification relatid to the selected round
     */
    private prepareRoundGuiClassification(): void {
        let allMeetings = this.selectedRound.onewayMeetings.concat(this.selectedRound.roundtripMeetings);
        this.selectedRound.classification = this.tourneyService.createClassification(allMeetings);

        this.classificationRows = this.tourneyService.prepareRoundsGui([this.selectedRound]);
    }
  
    onRowSelect(event) {
        console.log(event.data);
        if( this.selectedRow.isSkiping ) {
            return;
        }

        this.meetingRoundService.selectedMeeting = this.selectedRow;
        this.meetingService.selectedMeeting = this.selectedRow;
        this.meetingService = this.meetingRoundService;

        this.gotoDetailView();
    }
    
    onTeamRowSelect(event) {
        console.log("Entering onTeamRowSelect()");
        console.log(event.data);

        this.teamService.selectedTeam = event.data;

        let teamName = this.teamService.selectedTeam.teamName;
        let team = TeamService.getTeamByName(this.selectedTourney, teamName);
        this.teamService.selectedTeam.players = team.players;

        this.router.navigate([REDIRECT_TEAM_DV]);
    }
}

