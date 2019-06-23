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
import { TeamDetailView } from '../../admin/team/team-detailview';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';

@Component({
    templateUrl: './round-result-listview.html'
})
export class RoundResultListView extends AbstractListView {
    static redirect: string = "result/lv/meetingLv/dv";
    cols: TableCols[] ;
    
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

    constructor( protected tourneyService: TourneyService
        , private meetingRoundService: MeetingRoundService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , private teamService: TeamService
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        
        super.ngOnInit();
        this.selectedRound = this.tourneyService.selectedRound;
        
        this.classificationCols = this.tourneyService.classificationCols;

        this.roundTeams = this.selectedRound.teams;

        this.cols = [
            { field: 'teamName1',   header: 'In casa' },
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'teamName2',   header: 'Trasferta' }
        ];

        const subsbr = this.meetingRoundService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onResultCompleteLoad());
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.tourneyService.selectedRoundTabIndex = index;
    }

    public onResultCompleteLoad() {
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.meetingRoundService.onCompleteLoad(this.selectedRound, this.mdbList);
        this.incompleteRoundConfiguration = false;

        if(this.selectedRound.onewayMeetings.length == 0) {
            this.incompleteRoundConfiguration = true;
            return;
        }

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

    goOnewayLeft() {
        console.log("goOnewayLeft()");
        this.onewayDaysNo--;
        if(this.onewayDaysNo < 1) {
            this.onewayDaysNo = 1;
        }
        console.log("daysKey=" + this.onewayDaysNo);
        this.meetingRoundService.shiftOnewayDay(this.onewayDaysNo);
    }

    goOnewayRight() {
        console.log("goOnewayLeft()");
        let M = this.onewayMeetingDaysMap.size;
        this.onewayDaysNo++;
        console.log("daysKey=" + this.onewayDaysNo);
        if(this.onewayDaysNo > M) {
            this.onewayDaysNo = M;
        }
        this.meetingRoundService.shiftOnewayDay(this.onewayDaysNo);
    }

    goRoundtripLeft() {
        console.log("goRoundtripLeft()");
        this.roundtripDaysNo--;
        if(this.roundtripDaysNo < 1) {
            this.roundtripDaysNo = 1;
        }
        console.log("daysKey=" + this.roundtripDaysNo);
        this.meetingRoundService.shiftRoundtripDay(this.roundtripDaysNo);
    }

    goRoundtripRight() {
        console.log("goRoundtripLeft()");
        let M = this.roundtripMeetingDaysMap.size;
        this.roundtripDaysNo++;
        console.log("daysKey=" + this.roundtripDaysNo);
        if(this.roundtripDaysNo > M) {
            this.roundtripDaysNo = M;
        }
        this.meetingRoundService.shiftRoundtripDay(this.roundtripDaysNo);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.meetingRoundService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }

    onTeamRowSelect(event) {
        console.log("Entering onTeamRowSelect()");
        console.log(event.data);

        this.teamService.selectedTeam = event.data;

        this.router.navigate([TeamDetailView.redirect]);
    }
}

