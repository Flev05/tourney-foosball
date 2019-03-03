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
import { TeamDetailView } from '../../admin/team/team-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

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
   
    atLeastOneMatchForEachRound: boolean;
    classificationCols: any[];
    playoffClassification: any[];

    teamsCols : TableCols[] = [
        { field: 'ruleName',   header: 'Regola' },
        { field: 'teamName',   header: 'Squadra' },
    ];

    playoffTeams: Team[];

    constructor(
          protected tourneyService: TourneyService
        , private meetingService: MeetingService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , private teamService: TeamService
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
     
        this.classificationCols = this.tourneyService.classificationCols;

        this.cols = [
            { field: 'teamName1',   header: 'In casa' },
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'teamName2',   header: 'Trasferta' }
        ];

        const subsbr = this.meetingService.loadPlayoffMeeting(this.selectedTourney.id, this.selectedPlayoff.id);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onCompleteLoad());
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.tourneyService.selectedPlayoffTabIndex = index;
    }

    private onCompleteLoad() {
        this.selectedPlayoff.round.onewayMeetings = [];
        this.selectedPlayoff.round.roundtripMeetings = [];
        for( let mdb of this.mdbList ) {
            let m: Meeting = JSON.parse(mdb.json);
            if( m.direction == Direction.OneWay ) {
                this.selectedPlayoff.round.onewayMeetings.push(m);
            } else {
                this.selectedPlayoff.round.roundtripMeetings.push(m);
            }
        }

        this.refreshTeams();
        if(!this.atLeastOneMatchForEachRound) {
            return;
        }

        this.prepareMeetingMaps();

        this.preparePlayoffClassification();

        this.onewayDaysNo = 1;
        this.shiftOnewayDay(this.onewayDaysNo);

        this.roundtripDaysNo = 1;
        this.shiftRoundtripDay(this.roundtripDaysNo);

        this.allDaysNo = this.onewayMeetingDaysMap.size;
        let meetingsNo = this.selectedPlayoff.round.onewayMeetings.length;
        this.isRoundTrip = false;

        if (this.selectedTourney.isOnewayRound == "true") {
            this.meetingsNoMsg = "" + meetingsNo + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + meetingsNo * 2 + " in " + this.allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
    }

    /**
     * Called only one time at meeting reload, it resolves the playoff rules to their corresponding 
     * qualified teams from the tourney rounds
     */
    private refreshTeams(): void {
        this.selectedPlayoff.round.teams = [];

        this.atLeastOneMatchForEachRound = true;
        for( let rule of this.selectedPlayoff.playoffRules ) {
            let position: number = rule.fromRound.position.value;
            let roundName: string = rule.fromRound.round.label;

            let round = this.selectedTourney.rounds.find( r => r.name == roundName );
            if( round != undefined ) {
                if( round.classification.length > 0 ) {
                    let c: Classification = round.classification[position-1];
    
                    let team = c.team;
                    team.ruleName = rule.fromRound.position.label + " " + roundName;
                    this.selectedPlayoff.round.teams.push(team);
                } else {
                    this.atLeastOneMatchForEachRound = false;
                }
            } else {
                this.atLeastOneMatchForEachRound = false;
            }
        }
        this.playoffTeams = this.selectedPlayoff.round.teams;
    }

    /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    private prepareMeetingMaps(): void {
        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();

        for( let m of this.selectedPlayoff.round.onewayMeetings ) {

            this.resolveRules(m);

            m.dateAndTime = this.dfp.transform(m.datetime);
            if( m.points1 > 0 || m.points2 > 0 ) {
                m.dateAndTime = m.points1 + " - " + m.points2;
            }

            let key = m.day;
            // console.log( key + "° Giornata di andata");
            if(!this.onewayMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.onewayMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.onewayMeetingDaysMap.get(key);
            meetingList.push(m);
        }

        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();
        for( let m of this.selectedPlayoff.round.roundtripMeetings ) {

            m.dateAndTime = this.dfp.transform(m.datetime);
            if( m.points1 > 0 || m.points2 > 0 ) {
                m.dateAndTime = m.points1 + " - " + m.points2;
            }

            this.resolveRules(m);

            let key = m.day;
            console.log( key + "° Giornata di ritorno");
            if(!this.roundtripMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.roundtripMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.roundtripMeetingDaysMap.get(key);
            meetingList.push(m);
        }
    }

    /**
     * Prepares the classification relatid to the selected playoff
     */
    private preparePlayoffClassification(): void {

        let allMeetings = this.selectedPlayoff.round.onewayMeetings.concat(this.selectedPlayoff.round.roundtripMeetings);
        this.selectedPlayoff.round.classification = this.tourneyService.createClassification(allMeetings);

        this.playoffClassification = this.tourneyService.prepareRoundsGui([this.selectedPlayoff.round]);
    }
    
    /**
     * Called for each meeting, it resolves the playoff rule of the meeting to its corresponding 
     * qualified team came from the rounds of the tourney
     * 
     * @param m the method containg the rules to resolve with
     */
    private resolveRules(m: Meeting): void {
        m.team1 = this.findTeam(m.rule1);
        m.team2 = this.findTeam(m.rule2);
    }

    /**
     * Finds the team corresponding to the received rule
     * 
     * @param rule the playoff rule to associate to the qualified team
     */
    private findTeam( rule: PlayoffRule): Team {

        let position: number = rule.fromRound.position.value;
        let roundName: string = rule.fromRound.round.label;

        let round = this.selectedTourney.rounds.find( r => r.name == roundName );
        if( round != undefined ) {
            if( round.classification.length > 0 ) {
                let c: Classification = round.classification[position-1];
                let team = c.team;
                return team;
            }
        }        
        return null;
    }

    private shiftOnewayDay( currentDay : number) {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
        for( let d of this.onewayDays ) {
            d.teamName1 = d.team1.teamName;
            d.teamName2 = d.team2.teamName;
        }
    }

    private shiftRoundtripDay( currentDay : number ) {
        this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
        for( let d of this.roundtripDays ) {
            d.teamName1 = d.team1.teamName;
            d.teamName2 = d.team2.teamName;
        }
    }

    goOnewayLeft() {
        console.log("goOnewayLeft()");
        this.onewayDaysNo--;
        if(this.onewayDaysNo < 1) {
            this.onewayDaysNo = 1;
        }
        console.log("daysKey=" + this.onewayDaysNo);
        this.shiftOnewayDay(this.onewayDaysNo);
    }

    goOnewayRight() {
        console.log("goOnewayLeft()");
        let M = this.onewayMeetingDaysMap.size;
        this.onewayDaysNo++;
        console.log("daysKey=" + this.onewayDaysNo);
        if(this.onewayDaysNo > M) {
            this.onewayDaysNo = M;
        }
        this.shiftOnewayDay(this.onewayDaysNo);
    }

    goRoundtripLeft() {
        console.log("goRoundtripLeft()");
        this.roundtripDaysNo--;
        if(this.roundtripDaysNo < 1) {
            this.roundtripDaysNo = 1;
        }
        console.log("daysKey=" + this.roundtripDaysNo);
        this.shiftRoundtripDay(this.roundtripDaysNo);
    }

    goRoundtripRight() {
        console.log("goRoundtripLeft()");
        let M = this.roundtripMeetingDaysMap.size;
        this.roundtripDaysNo++;
        console.log("daysKey=" + this.roundtripDaysNo);
        if(this.roundtripDaysNo > M) {
            this.roundtripDaysNo = M;
        }
        this.shiftRoundtripDay(this.roundtripDaysNo);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.meetingService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }

    onTeamRowSelect(event) {
        console.log("Entering onTeamRowSelect()");
        console.log(event.data);

        this.teamService.selectedTeam = event.data;

        this.router.navigate([TeamDetailView.redirect]);
    }
}

