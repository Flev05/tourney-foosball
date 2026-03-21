import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Meeting } from '../../../domain/meeting';
import { TourneyService } from '../../../service/tourney-service';
import { Playoff } from '../../../domain/playoff';
import { TableCols } from '../../../domain/table-cols';
import { MeetingDb } from '../../../domain/meeting-db';
import { AbstractRuleListView } from '../../../components/common/abstract-rule-listview';
import { MeetingPlayoffService } from './meeting-playoff-service';
import { ToastMessageOptions } from 'primeng/api';

@Component({
    templateUrl: './meeting-page-listview.html',
    standalone: false
})
export class MeetingPageListView extends AbstractRuleListView {
    static redirect: string = "adminplayoff/lv/meetingLv/playoffRuledv";
    meetingsCols: TableCols[] = [];
    selectedRow: Meeting = new Meeting();

    msgs: ToastMessageOptions[] = [];

    selectedPlayoff: Playoff = new Playoff();
    isRoundTrip: boolean = true;
    mdbList: MeetingDb[] = [];

    pageSize: number = 10;
    onewayMeetings: Meeting[] = [];
    roundtripMeetings: Meeting[] = [];
    allDaysNo: number = 0;

    constructor(
        protected override tourneyService: TourneyService,
        public meetingPlayoffService: MeetingPlayoffService,
        protected override router: Router,
        protected override location: Location
    ) {
        super(MeetingPageListView.redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();
        
        this.meetingsCols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'ruleName1',   header: 'In Casa' },
            { field: 'ruleName2',   header: 'Trasferta' }
        ];

        if(this.tourneyService.selectedPlayoff != null ) {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        } else {
            if(this.tourneyService.selectedPlayout != null ) {
                this.selectedPlayoff = this.tourneyService.selectedPlayout;
            }
        }

        this.isRoundTrip = false;
        if(this.selectedTourney.isOnewayPlayoff == "true") {
            this.isRoundTrip = true;
        }

        let subsbr;
        if(this.tourneyService.selectedPlayoff != null ) {
            subsbr = this.meetingPlayoffService.loadPlayoffMeeting(this.selectedTourney.id, this.selectedPlayoff.id, e => this.serverUnreachableHandler(e));
        } else {
            subsbr = this.meetingPlayoffService.loadPlayoutMeeting(this.selectedTourney.id, this.selectedPlayoff.id, e => this.serverUnreachableHandler(e));
        }
        
        subsbr.subscribe(t => this.onCompleteLoad(t), e => this.onError(e) );
    }
   
    override onTabChange(e : any) {
        let index=e;
        console.log("Entering onTabChange(): tab=" + index);
        this.meetingPlayoffService.selectedTabIndex = index; 
    }
    
    private onCompleteLoad(t: MeetingDb[]): void {
        this.mdbList = t;
        this.meetingPlayoffService.selectedTourney = this.selectedTourney;
        this.meetingPlayoffService.onCompleteLoad(this.selectedPlayoff, this.mdbList);

        this.allDaysNo = this.selectedPlayoff.round.daysNo;
        this.pageSize  = this.selectedPlayoff.round.pageSize;
        this.onewayMeetings    = this.selectedPlayoff.round.onewayMeetings;
        this.roundtripMeetings = this.selectedPlayoff.round.roundtripMeetings;

        console.log("[OnewayMeetings    " + this.onewayMeetings.length + "]");
        console.log("[RoundtripMeetings " + this.roundtripMeetings.length + "]");
        console.log("[Days              " + this.allDaysNo + "]");
        console.log("[PageSize          " + this.pageSize + "]");
    }

    onRowSelect(event : any) {
        console.log(event.data);
        this.meetingPlayoffService.selectedMeeting = this.selectedRow;
        this.gotoDetailView();
    }
}

