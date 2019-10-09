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

    constructor( protected tourneyService: TourneyService
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

        this.roundTeams = this.selectedTourney.teams;

        this.selectedRound = this.tourneyService.selectedRound;
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
        this.meetingRoundService.onCompleteLoad(this.selectedRound, this.mdbList, false);
        this.pageSize = this.meetingRoundService.onewayDays.length;

        this.prepareRoundGuiClassification();
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

        this.meetingRoundService.selectedMeeting = this.selectedRow;
        this.meetingService.selectedMeeting = this.selectedRow;
        this.meetingService = this.meetingRoundService;

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

