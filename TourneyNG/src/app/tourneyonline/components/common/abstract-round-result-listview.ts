import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { AbstractListView } from './abstract-listview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Team } from 'app/tourneyonline/domain/team';
import { MeetingRoundService } from '../admin/round/meeting-round-service';
import { DateFormatPipe } from './date-format-pipe';

const REDIRECT_TEAM_DV      = 'admintourney/dv/team';

export abstract class  AbstractRoundResultListView extends AbstractListView {
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

    constructor( protected redirect: string 
        , public tourneyService: TourneyService
        , protected meetingRoundService: MeetingRoundService
        , protected meetingService: MeetingService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected teamService: TeamService
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        
        super.ngOnInit();
        this.cols = this.tourneyService.resultCols;

        this.classificationCols = this.tourneyService.classificationCols;

        this.selectedRound = this.tourneyService.selectedRound;
        this.roundTeams = TeamService.getTeamsByNames(this.selectedTourney, this.selectedRound.teamNames);

        this.isRoundTrip = true;

        const subsbr = this.meetingRoundService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subsbr.subscribe(t => this.onCompleteLoad(t), e => this.onError(e) );
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.tourneyService.selectedRoundTabIndex = index;
        if( index == 2 ) {
            this.ngOnInit();
        }
    }

    private onCompleteLoad(mdbList: MeetingDb[]): void {
        this.mdbList = mdbList;
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.meetingRoundService.onCompleteLoad(this.selectedRound, this.mdbList);

        this.pageSize = this.selectedRound.pageSize;
        this.allDaysNo = this.selectedRound.daysNo;

        this.onewayMeetings = this.selectedRound.onewayMeetings.map( (m, index, ms) => this.mapCallback(m, index, ms));
        this.onewayMeetings.forEach(m => m.containerId = this.selectedRound.id);
        this.onewayMeetings.sort((m1,m2) => this.sortMeeting(m1,m2))
        this.roundtripMeetings = this.selectedRound.roundtripMeetings.map( (m, index, ms) => this.mapCallback(m, index, ms) );
        this.roundtripMeetings.forEach(m => m.containerId = this.selectedRound.id);
        this.roundtripMeetings.sort((m1,m2) => this.sortMeeting(m1,m2))

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

    private sortMeeting(m1: Meeting, m2: Meeting): number {
        if( m1.day > m2.day ) {
            return 1;
        }
        if( m1.day < m2.day ) {
            return -1;
        }
        if( m1.datetime > m2.datetime ) {
            return 1;
        }
        if( m1.datetime < m2.datetime ) {
            return -1;
        }
        if( m1.teamName1 > m2.teamName1 ) {
            return 1;
        }
        if( m1.teamName1 < m2.teamName1 ) {
            return -1;
        }
        if( m1.teamName2 > m2.teamName2 ) {
            return 1;
        }
        if( m1.teamName2 < m2.teamName2 ) {
            return -1;
        }
        return 0;
    }

    private mapCallback (m: Meeting, index: number, array: Meeting[]): Meeting {
        if(m.isSkiping) {
            if( m.teamName1 == "" ) {
                m.points1 = 0;
            } else {
                m.points1 = this.selectedTourney.pointsNeededToWin;
            }
            if( m.teamName2 == "" ) {
                m.points2 = 0;
            } else {
                m.points2 = this.selectedTourney.pointsNeededToWin;
            }
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
        this.selectedRound.classification = this.tourneyService.createClassification(this.selectedRound, allMeetings);

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

