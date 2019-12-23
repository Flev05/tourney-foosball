import { Component } from '@angular/core';
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
 
export abstract class AbstractPlayoffResultListView extends AbstractRuleListView {
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
        
        const subsbr = this.meetingPlayoffService.loadPlayoffMeetings(this.selectedTourney.id, playoffIds);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onPlayoffCompleteLoad());
    }

    private onPlayoffCompleteLoad() {
        this.meetingPlayoffService.extractPlayoffMeetings(this.selectedPlayoff, this.mdbList);

        if( this.selectedTourney.isPlayoffAutoGen == "true") {
            this.meetingPlayoffService.resolveAutomaticTeams(this.selectedPlayoff);
            this.meetingPlayoffService.resolveAutomaticMeetings(this.selectedPlayoff, this.selectedTourney.rounds);
        } else {
            this.meetingPlayoffService.resolveManualTeams(this.selectedPlayoff);
            this.meetingPlayoffService.resolveManualMeetings(this.selectedPlayoff, this.selectedTourney.rounds);
        }

        this.allDaysNo = this.selectedPlayoff.round.daysNo;
        this.pageSize  = this.selectedPlayoff.round.pageSize;
        this.onewayMeetings = this.selectedPlayoff.round.onewayMeetings.map( (m, index, ms) => this.mapCallback(m, index, ms) );
        this.roundtripMeetings = this.selectedPlayoff.round.roundtripMeetings.filter( (m, index, ms) => this.filterCallback(m, index, ms) );

        console.log("[OnewayMeetings   " + this.onewayMeetings.length + "]");
        console.log("[RoundtriMeetings " + this.roundtripMeetings.length + "]");
        console.log("[Days             " + this.allDaysNo + "]");
        console.log("[PageSize         " + this.pageSize + "]");

        if (this.selectedTourney.isOnewayPlayoff == "true") {
            this.meetingsNoMsg = "" + this.onewayMeetings.length + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + this.onewayMeetings.length * 2 + " in " + this.allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }

        this.preparePlayoffClassification(this.selectedPlayoff);
        this.prepareEliminatoryLevels();

        this.updateSelectedPlayoff();
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
        this.tourneyService.selectedPlayoffTabIndex = index;
    }
  
    onRowSelect(event) {
        console.log(event.data);
        if( this.selectedRow.isSkiping) {
            return;
        }

        this.meetingPlayoffService.selectedMeeting = this.selectedRow;
        this.meetingService.selectedMeeting = this.selectedRow;
        this.meetingService = this.meetingPlayoffService;

        this.gotoDetailView();
    }
}

