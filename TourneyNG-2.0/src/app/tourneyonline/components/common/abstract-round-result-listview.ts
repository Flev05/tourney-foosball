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

import { Injectable } from '@angular/core';
 
@Injectable()
export abstract class  AbstractRoundResultListView extends AbstractListView {
    cols: TableCols[] = [];
    
    selectedRow: Meeting = new Meeting();

    selectedRound: Round = new Round();
    
    onewayDaysNo: number = 0;
    roundtripDaysNo: number = 0;
    
    onewayMeetingDaysMap: Map<number, Meeting[]> = new Map<number, Meeting[]>();
    onewayDays: any[] = [];

    roundtripMeetingDaysMap: Map<number, Meeting[]> = new Map<number, Meeting[]>();
    roundtripDays: any[] = [];

    isRoundTrip: boolean = false;
    roundDaysNo: number = 0;
    allDaysNo: number = 0 ;
    daysNoMsg: string = "";
    
    mdbList: MeetingDb[] = [];
    incompleteRoundConfiguration: boolean = true;
    
    classificationCols: any[] = [];
    classificationRows: any[] = [];
    
    teamsCols = TeamService.cols;
    roundTeams: Team[] = [];
    pageSize: number = 10;
    onewayMeetings: Meeting[] = [];
    roundtripMeetings: Meeting[] = [];

    constructor( protected override redirect: string 
        , public override tourneyService: TourneyService
        , protected meetingRoundService: MeetingRoundService
        , public meetingService: MeetingService
        , protected override router: Router
        , protected override location: Location
        , protected dfp: DateFormatPipe
        , protected teamService: TeamService
    ) {
        super(redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        
        super.ngOnInit();
        this.cols = this.tourneyService.resultCols;

        this.classificationCols = this.tourneyService.classificationCols;

        this.meetingService.abstractRoundVO =this.selectedTourney.roundVO;

        this.selectedRound = this.tourneyService.selectedRound;
        this.roundTeams = TeamService.getTeamsByNames(this.selectedTourney, this.selectedRound.teamNames);

        this.isRoundTrip = true;

        this.meetingService.goBackFromMeeting = false;
        this.onCompleteLoad(this.selectedTourney.roundVO.maxMatchesPerMeeting);
    }

    override onTabChange(value: string | number | undefined) {
        if (value === undefined) return;
        super.onTabChange(value);
        let index=value;
        console.log("Entering onTabChange(): tab=" + index);
        this.tourneyService.selectedRoundTabIndex = Number(value);
        if( index == 2 ) {
            this.ngOnInit();
        }
    }

    private onCompleteLoad(maxMatchesPerMeeting:number): void {
        this.mdbList = this.meetingRoundService.mdbList;
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.meetingRoundService.prepareMeetingsMap(this.selectedRound);

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

        this.prepareRoundGuiClassification( maxMatchesPerMeeting);
    }

    protected setOnewayCurrentDay(key: number) {
        this.onewayMeetingDaysMap = this.meetingRoundService.onewayMeetingDaysMap;
        let oom = this.onewayMeetingDaysMap.get(key);
        if( oom == undefined ) return;
        this.onewayMeetings = oom;
        this.onewayMeetings = this.onewayMeetings.map((m, index, ms) => this.mapCallback(m, index, ms));
        this.onewayMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
        this.selectedRound.onewayCurrentDay = key;
    }

    protected setRoundtripCurrentDay(key: number) {
        this.roundtripMeetingDaysMap = this.meetingRoundService.roundtripMeetingDaysMap;
        let oom = this.roundtripMeetingDaysMap.get(key);
        if( oom == undefined ) return;
        this.roundtripMeetings = oom;
        this.roundtripMeetings = this.roundtripMeetings.map((m, index, ms) => this.mapCallback(m, index, ms));
        this.roundtripMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
        this.selectedRound.roundtripCurrentDay = key;
    }

    private mapCallback (m: Meeting, index: number, array: Meeting[]): Meeting {
        if(m.isSkiping) {
            m.points1 = 0;
            m.points2 = 0;
        }
        m.vpoints1 = m.matches.length==1 ? m.matches[0].score1 : m.points1;
        m.vpoints2 = m.matches.length==1 ? m.matches[0].score2 : m.points2;
        console.log("[Status            " + m.status + "]");
        return m;
    } 

    /**
     * Prepares the classification relatid to the selected round
     */
    private prepareRoundGuiClassification(maxMatchesPerMeeting: number): void {
        this.tourneyService.createClassification(this.selectedRound, true);
        this.classificationRows = this.tourneyService.prepareRoundsGui(maxMatchesPerMeeting, [this.selectedRound]);
    }
  
    onRowSelect(event: any) {
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
    
    onTeamRowSelect(event: { data: Team; }) {
        console.log("Entering onTeamRowSelect()");
        console.log(event.data);
        this.teamService.selectedTeam = event.data;
        let teamName = this.teamService.selectedTeam.teamName;
        let team = TeamService.getTeamByName(this.selectedTourney, teamName);
        if( team == null ) return;
        this.teamService.selectedTeam.players = team.players;
        this.router.navigate([REDIRECT_TEAM_DV]);
    }

    refresh(): void {        
        let roundIds: number[] = [];
        for(let round of this.selectedTourney.roundVO.rounds) {
            roundIds.push(round.id);
        }
        const subsbr = this.meetingRoundService.loadRoundMeetings(this.selectedTourney.id, roundIds, e => this.serverUnreachableHandler(e));
        subsbr.subscribe(t => this.onRoundCompleteLoad(t), e => this.onError(e) );   
    }

    private onRoundCompleteLoad(t: MeetingDb[]): void {
        this.mdbList = t;
        for(let round of this.selectedTourney.roundVO.rounds) { 
            this.meetingRoundService.extractRoundMeetings(round, this.mdbList);
            this.tourneyService.createClassification(round, true);
        }
        this.ngOnInit();
    }
}

