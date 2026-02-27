import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from '../../service/tourney-service';
import { Meeting } from '../../domain/meeting';
import { TableCols } from '../../domain/table-cols';
import { MeetingDb } from '../../domain/meeting-db';
import { Playoff } from '../../domain/playoff';
import { TeamService } from '../../service/team-service';
import { Team } from '../../domain/team';
import { MeetingService } from '../../service/meeting-service';
import { AbstractRuleListView } from './abstract-rule-listview';
import { MeetingPlayoffService } from '../admin/playoff/meeting-playoff-service';
import { DateFormatPipe } from './date-format-pipe';
import { LevelService } from '../admin/eliminatory/level-service';
import { Direction } from '../../domain/enumerations';
import { Injectable } from '@angular/core';
 
@Injectable()
export abstract class AbstractPlayoffResultListView extends AbstractRuleListView {
    cols: TableCols[] = [];
    
    selectedRow: Meeting = new Meeting();

    selectedPlayoff: Playoff = new Playoff();
    
    onewayDaysNo: number = 0;
    roundtripDaysNo: number = 0;
    
    onewayDays: any[] = [];

    onewayMeetingDaysMap: Map<number, Meeting[]> = new Map<number, Meeting[]>();
    roundtripMeetingDaysMap: Map<number, Meeting[]> = new Map<number, Meeting[]>();
    roundtripDays: any[] = [];

    isRoundTrip: boolean = false;
    roundDaysNo: number = 0;
    allDaysNo: number = 0;
    daysNoMsg: string = "";
    
    mdbList: MeetingDb[] = [];
   
    classificationCols: any[] = [];
    playoffClassification: any[] = [];

    teamsCols = TeamService.cols;

    playoffTeams: Team[] = [];
    pageSize: number = 10;
    onewayMeetings: Meeting[] = [];
    roundtripMeetings: Meeting[] = [];
    currentDay: number = 0;

    constructor( 
         protected override redirect: string
        , public override tourneyService: TourneyService
        , protected meetingPlayoffService: MeetingPlayoffService
        , protected meetingService: MeetingService
        , protected override router: Router
        , protected override location: Location
        , protected dfp: DateFormatPipe
        , protected levelService: LevelService
    ) {
        super(redirect
            , tourneyService
            , router
            , location);
    }

    override ngOnInit() {
        super.ngOnInit();

        this.meetingPlayoffService.selectedTourney = this.selectedTourney;
        if(this.tourneyService.selectedPlayoff != null) {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        } else {
            this.selectedPlayoff = this.tourneyService.selectedPlayout;
        }
     
        this.classificationCols = this.tourneyService.classificationCols;
        this.cols = this.tourneyService.resultCols;
        this.playoffTeams = TeamService.getTeamsByNames(this.selectedTourney, this.selectedPlayoff.round.teamNames);
        
        this.meetingService.goBackFromMeeting = false;
        this.onPlayoffCompleteLoad();
    }

    private onPlayoffCompleteLoad() {
        this.mdbList = this.meetingPlayoffService.mdbList;

        this.meetingPlayoffService.prepareMeetingsMap(this.selectedPlayoff.round);

        this.roundDaysNo = this.selectedPlayoff.round.daysNo;
        this.pageSize  = this.selectedPlayoff.round.pageSize;
        this.onewayMeetings    = this.selectedPlayoff.round.onewayMeetings.map( (m, index, ms) => this.mapCallback(m, index, ms) );
        this.roundtripMeetings = this.selectedPlayoff.round.roundtripMeetings.filter( (m, index, ms) => this.filterCallback(m, index, ms) );

        let key = this.selectedPlayoff.round.onewayCurrentDay;
        this.setOnewayCurrentDay(key);

        key = this.selectedPlayoff.round.roundtripCurrentDay;
        this.setRoundtripCurrentDay(key);

        console.log("[OnewayMeetings   " + this.onewayMeetings.length + "]");
        console.log("[RoundtriMeetings " + this.roundtripMeetings.length + "]");
        console.log("[Days             " + this.roundDaysNo + "]");
        console.log("[PageSize         " + this.pageSize + "]");

        if (this.selectedTourney.isOnewayPlayoff == "true") {
            this.allDaysNo = this.roundDaysNo;
        } else {
            this.isRoundTrip = true;
            this.allDaysNo = 2 * this.roundDaysNo;
        }
        this.meetingService.allDaysNo = this.allDaysNo;

        this.preparePlayoffClassification(this.selectedPlayoff);
        this.prepareEliminatoryLevels();

        this.updateSelectedPlayoff();
    }

    protected setOnewayCurrentDay(key: number) {
        this.onewayMeetingDaysMap = this.meetingPlayoffService.onewayMeetingDaysMap;
        let owm = this.onewayMeetingDaysMap.get(key) ;
        if( owm == undefined ) return;
        this.onewayMeetings = owm;
        this.onewayMeetings = this.onewayMeetings.map((m, index, ms) => this.mapCallback(m, index, ms));
        this.onewayMeetings.forEach(m => m.containerId = this.selectedPlayoff.round.id);
        this.onewayMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
        this.selectedPlayoff.round.onewayCurrentDay = key;
        return key;
    }

    protected setRoundtripCurrentDay(key: number) {
        this.roundtripMeetingDaysMap = this.meetingPlayoffService.roundtripMeetingDaysMap;
        let owm = this.roundtripMeetingDaysMap.get(key);
        if( owm == undefined ) return;
        this.roundtripMeetings = owm;
        this.roundtripMeetings = this.roundtripMeetings.map((m, index, ms) => this.mapCallback(m, index, ms));
        this.roundtripMeetings.forEach(m => m.containerId = this.selectedPlayoff.round.id);
        this.roundtripMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
        this.selectedPlayoff.round.roundtripCurrentDay = key;
    }
    private updateSelectedPlayoff() {
        this.tourneyService.updateTourneyCleanPalyoffMeetings(this.selectedTourney, () => {});
    }

    private prepareEliminatoryLevels() {
        if( !this.containsEliminatory() ) {
            return;
        }
        this.levelService.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
        const tNo = this.selectedTourney.eliminatoryLevels[0].topLevelTeamNo;
        this.levelService.eliminatoryLevelRows = this.levelService.prepareEliminatoryLevelsGui(this.levelService.eliminatoryLevels, tNo);
    }

    private mapCallback(m: Meeting, index: number, ms: Meeting[]): Meeting {
        if(m.isSkiping) {
            m.points1 = 0;
            m.points2 = 0;
        }
        m.vpoints1 = m.matches.length==1 ? m.matches[0].score1 : m.points1;
        m.vpoints2 = m.matches.length==1 ? m.matches[0].score2 : m.points2;
        return m;
    }

    private filterCallback(m: Meeting, index: number, ms: Meeting[]): boolean {
        return true;
    }

    /**
     * Prepares the classification relatid to the selected playoff
     */
    private preparePlayoffClassification(playoff : Playoff): void {
        this.selectedPlayoff.round = playoff.round;
        this.tourneyService.createClassification(this.selectedPlayoff.round, true );
        this.playoffClassification = this.tourneyService.prepareRoundsGui(this.selectedTourney.playoffVO.maxMatchesPerMeeting, [playoff.round]);
    }

    override onChangeTab(e: { index: any; }) {
        let index=e.index;
        if( index == 2 ) {
            this.ngOnInit();
        }
        this.tourneyService.selectedPlayoffTabIndex = index;
        this.currentDay = this.selectedPlayoff.round.roundtripCurrentDay;
    }
  
    onRowSelect(event: { data: any; }) {
        console.log(event.data);
        if( this.selectedRow.isSkiping) {
            return;
        }

        this.meetingPlayoffService.selectedMeeting = this.selectedRow;
        this.meetingService.selectedMeeting = this.selectedRow;
        this.meetingService = this.meetingPlayoffService;
        
        this.meetingService.abstractRoundVO = this.selectedTourney.playoffVO;

        this.meetingService.selectedRound = this.selectedPlayoff.round;
        this.meetingService.selectedRound.name = this.selectedPlayoff.round.name;
        this.meetingService.selectedRound.direction = this.selectedRow.direction;

        let currentDay = this.selectedPlayoff.round.onewayCurrentDay;
        if( this.selectedPlayoff.round.direction == Direction.RoundTrip) {
            currentDay =  this.selectedPlayoff.round.daysNo + this.selectedPlayoff.round.roundtripCurrentDay;
        }
        this.meetingService.selectedRound.label = this.meetingService.selectedRound.name + " - " + currentDay + "/" + this.allDaysNo;

        this.gotoDetailView();
    }
    
    refresh(): void {     
        let playoffIds: number[] = [];
        for(let p of this.selectedTourney.playoffVO.playoffs) {
            playoffIds.push(p.id);
        }
        
        const subsbr = this.meetingPlayoffService.loadPlayoffMeetings(this.selectedTourney.id, playoffIds, e => this.serverUnreachableHandler(e));
        subsbr.subscribe(t => this.onPlayoffNext(t), e => this.serverUnreachableHandler(e));
    }

    private onPlayoffNext(mdbList: MeetingDb[]) {
        this.mdbList = mdbList;
        this.ngOnInit();
    }
}

