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
import { Direction } from 'app/tourneyonline/domain/enumerations';

const REDIRECT_TEAM_DV      = 'admintourney/dv/team';

export abstract class  AbstractRoundResultListView extends AbstractListView {
    cols: TableCols[];
    
    selectedRow: Meeting;

    selectedRound: Round;
    
    onewayDaysNo: number;
    roundtripDaysNo: number;
    
    onewayMeetingDaysMap: Map<number, Meeting[]>;
    onewayDays: any[];

    roundtripMeetingDaysMap: Map<number, Meeting[]>;
    roundtripDays: any[];

    isRoundTrip: boolean;
    roundDaysNo: number;
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

        // const subsbr = this.meetingRoundService.loadRoundMeeting(this.selectedTourney, this.selectedRound );
        this.meetingService.goBackFromMeeting = false;
        this.onCompleteLoad();
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.tourneyService.selectedRoundTabIndex = index;
        if( index == 2 ) {
            this.ngOnInit();
        }
    }

    private onCompleteLoad(): void {
        this.mdbList = this.meetingRoundService.mdbList;
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        // this.meetingRoundService.onCompleteLoad(this.selectedRound, this.mdbList);
        this.meetingRoundService.prepareMeetingsMap(this.selectedRound, false);

        this.pageSize = this.selectedRound.pageSize;
        this.roundDaysNo = this.selectedRound.daysNo;

        let key = this.selectedRound.onewayCurrentDay;
        this.setOnewayCurrentDay(key);

        key = this.selectedRound.roundtripCurrentDay;
        this.setRoundtripCurrentDay(key);

        console.log("[OnewayMeetings    " + this.onewayMeetings.length + "]");
        console.log("[RoundtripMeetings " + this.roundtripMeetings.length + "]");
        console.log("[Days              " + this.roundDaysNo + "]");
        console.log("[PageSize          " + this.pageSize + "]");

        if (this.selectedTourney.isOnewayRound == "true") {
            this.isRoundTrip = false;
            this.allDaysNo = this.roundDaysNo;
        } else {
            this.isRoundTrip = true;
            this.allDaysNo = 2 * this.roundDaysNo;
        }
        this.meetingService.allDaysNo = this.allDaysNo;

        this.prepareRoundGuiClassification();
    }

    protected setOnewayCurrentDay(key: number) {
        this.onewayMeetingDaysMap = this.meetingRoundService.onewayMeetingDaysMap;
        this.onewayMeetings = this.onewayMeetingDaysMap.get(key);
        this.onewayMeetings = this.onewayMeetings.map((m, index, ms) => this.mapCallback(m, index, ms));
        this.onewayMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
        this.selectedRound.onewayCurrentDay = key;
        return key;
    }

    protected setRoundtripCurrentDay(key: number) {
        this.roundtripMeetingDaysMap = this.meetingRoundService.roundtripMeetingDaysMap;
        this.roundtripMeetings = this.roundtripMeetingDaysMap.get(key);
        this.roundtripMeetings = this.roundtripMeetings.map((m, index, ms) => this.mapCallback(m, index, ms));
        this.roundtripMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
        this.selectedRound.roundtripCurrentDay = key;
    }

    private mapCallback (m: Meeting, index: number, array: Meeting[]): Meeting {
        if(m.isSkiping) {
            if( m.teamName1 == "" ) {
                m.points1 = 0;
            } else {
                m.points1 = 0;
            }
            if( m.teamName2 == "" ) {
                m.points2 = 0;
            } else {
                m.points2 = 0;
            }
        }
        return m;
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

        this.meetingService.selectedRound = this.selectedRound;
        this.meetingService.selectedRound.direction = this.selectedRow.direction;
        this.tourneyService.selectedRound.name = this.selectedRound.name;

        let currentDay = this.selectedRound.onewayCurrentDay;
        if( this.selectedRound.direction == Direction.RoundTrip) {
            currentDay =  this.selectedRound.daysNo + this.selectedRound.roundtripCurrentDay;
        }
        this.meetingService.selectedRound.label = this.tourneyService.selectedRound.name + " - " + currentDay + "/" + this.allDaysNo;

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

