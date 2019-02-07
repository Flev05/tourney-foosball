import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Direction } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/meetingLv/playoffRuledv";
    meetingsCols: TableCols[] ;
    rows: any[];
    selectedRow: any;

    msgs: Message[] = [];

    selectedPlayoff: Playoff;
    selectedMeeting: Meeting;
    meetings: Meeting [];
    meetingsNoMsg: string;

    isRoundTrip: boolean;
    meetingDaysMap: Map<string, Meeting[]>;
    onewayDaysNo: number;
    roundtripDaysNo: number;
    onewayDays: any[];
    roundtripDays: any[];
    allDaysNo: number;

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

        this.meetingsCols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'ruleName',    header: 'Incontro' }
        ];

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;

        this.meetings = this.selectedPlayoff.round.meetings;

        for(let m of this.meetings) {
            let p1 = m.rule1.fromRound.position.label;
            let r1 = m.rule1.fromRound.round.label;
 
            let p2 = m.rule2.fromRound.position.label;
            let r2 = m.rule2.fromRound.round.label;           

            let rn1 = p1 + " " + r1;
            let rn2 = p2 + " " + r2;
            let rn = rn1 + " - " + rn2;

            m.ruleName = rn;
        }

        this.allDaysNo = this.selectedPlayoff.playoffRules.length-1;

        this.isRoundTrip = false;
        if(this.selectedTourney.isOnewayPlayoff == "true") {
            let meetingsNo = this.meetings.length / 2;  
            this.meetingsNoMsg = "" +  meetingsNo + " incontri in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            let meetingsNo = this.meetings.length;  
            this.meetingsNoMsg = "" +  meetingsNo + " incontri in " + this.allDaysNo*2 + " giornate (Andata e Ritorno)";
        }

        this.convertDayMap();

        this.onewayDaysNo = 1;
        this.prepareOnewayDays();

        this.roundtripDaysNo = 1;
        this.prepareRoundtripDays();
    }
 
    private convertDayMap() {
        this.meetingDaysMap = new Map<string, Meeting[]>();

        for( let m of this.selectedPlayoff.round.meetings ) {
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
            this.onewayDays.push({ m: m, dateAndTime: dt, direction: m.direction, ruleName: m.ruleName });
        }
        this.onewayDays = this.sortMeetingRows(this.onewayDays);
    }

    private prepareRoundtripDays( ) {
        let mk: string = Direction.RoundTrip + "." + this.roundtripDaysNo;
        let days = this.meetingDaysMap.get(mk);

        this.roundtripDays = [];
        for (let i = 0; i < days.length; i++) {
            let m = days[i];
            let dt = this.dateFormatPipe.transform(m.datetime);
            this.roundtripDays.push({ m: m, dateAndTime: dt, direction: m.direction, ruleName: m.ruleName });
        }
        this.roundtripDays = this.sortMeetingRows(this.roundtripDays);
    }

    private sortMeetingRows(meetings: any[]): any[] {
        return meetings.sort((m1, m2) => {
            if (m1.dateAndTime > m2.dateAndTime) {
                return 1;
            }
            if (m1.dateAndTime < m2.dateAndTime) {
                return -1;
            }
            if(m1.direction > m2.direction) {
                return 1;
            } else {
                return -1;
            }
        });
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
        let M = this.selectedPlayoff.playoffRules.length - 1;
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
        let M = this.selectedPlayoff.playoffRules.length - 1;
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

        msgerr = 'Aggiornamento configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

