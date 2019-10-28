import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DateFormatPipe } from '../../common/date-format-pipe';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingDetailView } from './meeting-detailview';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractRuleListView } from '../../common/abstract-rule-listview';
import { Classification } from 'app/tourneyonline/domain/classification';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { Round } from 'app/tourneyonline/domain/round';

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
    
    onewayMeetingDaysMap: Map<number, Meeting[]>;
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
          protected tourneyService: TourneyService
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
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
     
        this.classificationCols = this.tourneyService.classificationCols;
        this.cols = this.tourneyService.resultCols;

        const subsbr = this.meetingPlayoffService.loadPlayoffMeeting(this.selectedTourney.id, this.selectedPlayoff.id);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onCompleteLoad());
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.tourneyService.selectedPlayoffTabIndex = index;
    }

    private onCompleteLoad() {
        this.meetingPlayoffService.selectedTourney = this.selectedTourney;
        this.meetingPlayoffService.extractRoundMeetings(this.selectedPlayoff.round, this.mdbList);

        this.resolveTeams(this.selectedPlayoff);
        this.resolveMeetings(this.selectedPlayoff, this.selectedTourney.rounds);

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

        this.preparePlayoffClassification();
    }

    /**
     * Called only one time at meeting reload, it resolves the playoff rules to their corresponding 
     * qualified teams from the tourney rounds
     */
    private resolveTeams(playoff : Playoff): void {
        playoff.round.teams = [];

        for( let rule of playoff.playoffRules ) {
            let position:  number = rule.fromRound.position.value;
            let roundName: string = rule.fromRound.round.label;

            let round = this.selectedTourney.rounds.find( r => r.name == roundName );
            if( round != undefined ) {
                if( round.classification.length > 0 ) {
                    let c: Classification = round.classification[position-1];
    
                    let team = c.team;
                    team.ruleName = rule.fromRound.position.label + " " + roundName;
                    playoff.round.teams.push(team);
                }
            }
        }
        this.playoffTeams = playoff.round.teams;
    }

    /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list needed to paginate the meetings on daily base
     */
    private resolveMeetings(playoff : Playoff, rounds: Round[]): void {
        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();

        for( let m of playoff.round.onewayMeetings ) {
            this.resolveRules( m, rounds);
        }

        for( let m of playoff.round.roundtripMeetings ) {
            this.resolveRules( m, rounds);
        }
    }
    
    /**
     * Called for each meeting, it resolves the playoff rule of the meeting to its corresponding 
     * qualified team came from the rounds of the tourney
     * 
     * @param m the method containing the rules to resolve with
     */
    private resolveRules( m: Meeting, rounds: Round[]): void {
        m.dateAndTime = this.dfp.transform(m.datetime, false);

        let t1: Team = this.findTeam(m.rule1, rounds);
        m.team1 = t1;
        m.teamName1 = m.team1.teamName;
        m.ruleName1 = m.rule1.ruleName;

        let t2: Team = this.findTeam(m.rule2, rounds);
        m.team2 = t2;
        m.teamName2 = m.team2.teamName;
        m.ruleName2 = m.rule2.ruleName;
    }

    /**
     * Finds the team corresponding to the received rule
     * 
     * @param rule the playoff rule to associate to the qualified team
     */
    private findTeam(rule: PlayoffRule, rounds: Round[]): Team {

        let position:  number = rule.fromRound.position.value;
        let roundName: string = rule.fromRound.round.label;

        let round = rounds.find( r => r.name == roundName );
        if( round != undefined ) {
            if( round.classification.length > 0 ) {
                let c: Classification = round.classification[position-1];
                let team = c.team;
                console.log("Resolved Team is " + team);
                return team;
            }
        }        
        return null;
    }

    /**
     * Prepares the classification relatid to the selected playoff
     */
    private preparePlayoffClassification(): void {

        let allMeetings = this.selectedPlayoff.round.onewayMeetings.concat(this.selectedPlayoff.round.roundtripMeetings);
        this.selectedPlayoff.round.classification = this.tourneyService.createClassification(allMeetings);

        this.playoffClassification = this.tourneyService.prepareRoundsGui([this.selectedPlayoff.round]);
    }
  
    onRowSelect(event) {
        console.log(event.data);

        this.meetingPlayoffService.selectedMeeting = this.selectedRow;
        this.meetingService.selectedMeeting = this.selectedRow;
        this.meetingService = this.meetingPlayoffService;

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

