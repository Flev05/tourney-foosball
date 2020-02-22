import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { AbstractRuleListView } from './abstract-rule-listview';
import { MeetingPlayoffService } from '../admin/playoff/meeting-playoff-service';
import { DateFormatPipe } from './date-format-pipe';
import { LevelService } from '../admin/eliminatory/level-service';
import { Direction } from 'app/tourneyonline/domain/enumerations';
 
export abstract class AbstractPlayoffResultListView extends AbstractRuleListView {
    cols: TableCols[] ;
    
    selectedRow: Meeting;

    selectedPlayoff: Playoff;
    
    onewayDaysNo: number;
    roundtripDaysNo: number;
    
    onewayDays: any[];

    onewayMeetingDaysMap: Map<number, Meeting[]>;
    roundtripMeetingDaysMap: Map<number, Meeting[]>;
    roundtripDays: any[];

    isRoundTrip: boolean;
    roundDaysNo: number;
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
    currentDay: number;

    constructor( 
         protected redirect: string
        , public tourneyService: TourneyService
        , protected meetingPlayoffService: MeetingPlayoffService
        , protected meetingService: MeetingService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected levelService: LevelService
    ) {
        super(redirect
            , tourneyService
            , router
            , location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.meetingPlayoffService.selectedTourney = this.selectedTourney;
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
     
        this.classificationCols = this.tourneyService.classificationCols;
        this.cols = this.tourneyService.resultCols;
        this.playoffTeams = TeamService.getTeamsByNames(this.selectedTourney, this.selectedPlayoff.round.teamNames);

        let playoffIds: number[] = [];
        for(let p of this.selectedTourney.playoffs) {
            playoffIds.push(p.id);
        }
        
        this.meetingService.goBackFromMeeting = false;
        this.onPlayoffCompleteLoad();
    }

    private onPlayoffCompleteLoad() {
        this.mdbList = this.meetingPlayoffService.mdbList;

        this.meetingPlayoffService.prepareMeetingsMap(this.selectedPlayoff.round, false);

        this.roundDaysNo = this.selectedPlayoff.round.daysNo;
        this.pageSize  = this.selectedPlayoff.round.pageSize;
        this.onewayMeetings = this.selectedPlayoff.round.onewayMeetings.map( (m, index, ms) => this.mapCallback(m, index, ms) );
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
        this.onewayMeetings = this.onewayMeetingDaysMap.get(key);
        this.onewayMeetings = this.onewayMeetings.map((m, index, ms) => this.mapCallback(m, index, ms));
        this.onewayMeetings.forEach(m => m.containerId = this.selectedPlayoff.round.id);
        this.onewayMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
        this.selectedPlayoff.round.onewayCurrentDay = key;
        return key;
    }

    protected setRoundtripCurrentDay(key: number) {
        this.roundtripMeetingDaysMap = this.meetingPlayoffService.roundtripMeetingDaysMap;
        this.roundtripMeetings = this.roundtripMeetingDaysMap.get(key);
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
        this.levelService.prepareEliminatoryLevelsGui();
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
        let allMeetings = this.selectedPlayoff.round.onewayMeetings.concat(this.selectedPlayoff.round.roundtripMeetings);
        allMeetings.forEach( m => m.containerId = playoff.id);
        this.selectedPlayoff.round.classification = this.tourneyService.createClassification(playoff.round, allMeetings);
        this.playoffClassification = this.tourneyService.prepareRoundsGui([playoff.round]);
    }

    onChangeTab(e) {
        let index=e.index;
        if( index == 2 ) {
            this.ngOnInit();
        }
        this.tourneyService.selectedPlayoffTabIndex = index;
        this.currentDay = this.selectedPlayoff.round.roundtripCurrentDay;
    }
  
    onRowSelect(event) {
        console.log(event.data);
        if( this.selectedRow.isSkiping) {
            return;
        }

        this.meetingPlayoffService.selectedMeeting = this.selectedRow;
        this.meetingService.selectedMeeting = this.selectedRow;
        this.meetingService = this.meetingPlayoffService;
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        
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
        for(let p of this.selectedTourney.playoffs) {
            playoffIds.push(p.id);
        }
        
        const subsbr = this.meetingPlayoffService.loadPlayoffMeetings(this.selectedTourney.id, playoffIds, e => this.serverUnreachableHandler(e));
        subsbr.subscribe(t => this.onPlayoffNext(t), e => this.serverUnreachableHandler(e));
    }

    private onPlayoffNext(mdbList: MeetingDb[]) {

        this.mdbList = mdbList;
        // for(let playoff of this.selectedTourney.playoffs) { 
        //     this.meetingPlayoffService.extractPlayoffMeetings(playoff, this.mdbList);
    
        //     if( this.selectedTourney.isPlayoffAutoGen == "true") {
        //         this.meetingPlayoffService.resolveAutomaticTeams(playoff);
        //         this.meetingPlayoffService.resolveAutomaticMeetings(playoff, this.selectedTourney.rounds);
        //     } else {
        //         this.meetingPlayoffService.resolveManualTeams(playoff);
        //         this.meetingPlayoffService.resolveManualMeetings(playoff, this.selectedTourney.rounds);
        //     }
    
        //     let allMeetings = playoff.round.onewayMeetings.concat(playoff.round.roundtripMeetings);
        //     playoff.round.classification = this.tourneyService.createClassification(playoff.round, allMeetings);
        // }
        this.ngOnInit();
    }
}

