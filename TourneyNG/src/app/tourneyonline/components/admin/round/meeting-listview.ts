import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingKey } from 'app/tourneyonline/domain/meeting.key';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminround/lv/meetingLv/dv";
    cols: TableCols[] ;
    
    onewayDays: any[];
    roundtripDays: any[];
    selectedRow: any;

    msgs: Message[] = [];
    selectedRound: Round;
    selectedMeeting: Meeting;
    meetings: Meeting [];
    atLeast2teams: boolean;
    
    meetingsNoMsg: string;
    onewayDaysNo: number;
    roundtripDaysNo: number;
    meetingDaysMap: Map<string, Meeting[]>;
    isRoundTrip: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        private   dateFormatPipe: DateFormatPipe
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.meetings = this.selectedRound.meetings;

        this.atLeast2teams = this.meetings.length >= 1 ? true : false;
        
        if(this.selectedTourney.isOnewayRound == "true") {
            let meetingsNo = this.meetings.length / 2;  
            this.meetingsNoMsg = "" +  meetingsNo + " (Solo Andata)";
        } else {
            let meetingsNo = this.meetings.length;  
            this.meetingsNoMsg = "" + meetingsNo + " (Andata e Ritorno)";
        }

        this.cols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'name',        header: 'Incontro' }
        ];

        this.convertDayMap();

        this.onewayDaysNo = 1;
        this.prepareOnewayDays();

        this.roundtripDaysNo = 1;
        this.prepareRoundtripDays();
    }

    private convertDayMap() {
        this.meetingDaysMap = new Map<string, Meeting[]>();

        for( let m of this.selectedRound.meetings ) {
            let mk = m.direction + "." + m.day;
            if( !this.meetingDaysMap.has(mk) ) {
                let emptyArray: Meeting[] = [];
                this.meetingDaysMap.set(mk, emptyArray);
            }
            let mList: Meeting[] = this.meetingDaysMap.get(mk);
            mList.push(m);
        }
    }

    private prepareOnewayDays() {
        let mk: string = Direction.OneWay + "." + this.onewayDaysNo;
        let days: Meeting[] = this.meetingDaysMap.get(mk);

        this.onewayDays = [];
        for (let i = 0; i < days.length; i++) {
            let m = days[i];
            let dt = this.dateFormatPipe.transform(m.datetime);
            this.onewayDays.push({ m: m, dateAndTime: dt, direction: m.direction, name: m.name });
        }
        this.onewayDays = this.sortMeetings(this.onewayDays);
    }

    private prepareRoundtripDays( ) {
        let mk: string = Direction.RoundTrip + "." + this.roundtripDaysNo;
        let days = this.meetingDaysMap.get(mk);

        this.roundtripDays = [];
        for (let i = 0; i < days.length; i++) {
            let m = days[i];
            let dt = this.dateFormatPipe.transform(m.datetime);
            this.roundtripDays.push({ m: m, dateAndTime: dt, direction: m.direction, name: m.name });
        }
        this.roundtripDays = this.sortMeetings(this.roundtripDays);
    }

    goOnewayLeft() {
        console.log("goOnewayLeft()");
        this.onewayDaysNo--;
        if(this.onewayDaysNo < 1) {
            this.onewayDaysNo = 1;
        }
        console.log("daysKey=" + this.onewayDaysNo);
        this.prepareOnewayDays();
    }

    goOnewayRight() {
        console.log("goOnewayLeft()");
        let M = this.selectedRound.teams.length - 1;
        this.onewayDaysNo++;
        console.log("daysKey=" + this.onewayDaysNo);
        if(this.onewayDaysNo > M) {
            this.onewayDaysNo = M;
            return;
        }
        this.prepareOnewayDays();
    }

    goRoundtripLeft() {
        console.log("goRoundtripLeft()");
        this.roundtripDaysNo--;
        if(this.roundtripDaysNo < 1) {
            this.roundtripDaysNo = 1;
        }
        console.log("daysKey=" + this.roundtripDaysNo);
        this.prepareRoundtripDays();
    }

    goRoundtripRight() {
        console.log("goRoundtripLeft()");
        let M = this.selectedRound.teams.length - 1;
        this.roundtripDaysNo++;
        console.log("daysKey=" + this.roundtripDaysNo);
        if(this.roundtripDaysNo > M) {
            this.roundtripDaysNo = M;
            return;
        }
        this.prepareRoundtripDays();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedMeeting = this.selectedRow.m;

        this.gotoDetailView();
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiornamento configurazione gironi fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

