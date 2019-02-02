import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminround/lv/meetingLv/dv";
    cols: TableCols[] ;
    rows: any[];
    selectedRow: any;

    msgs: Message[] = [];
    selectedRound: Round;
    selectedMeeting: MeetingDb;
    meetings: MeetingDb [];
    atLeast2teams: boolean;
    meetingsNoMsg: string;

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

        this.atLeast2teams = this.meetings.length > 0 ? true : false;
        
        if(this.selectedTourney.isOnewayRound == "true") {
            let meetingsNo = this.meetings.length / 2;  
            this.meetingsNoMsg = "" +  meetingsNo + " (Solo Andata)";
        } else {
            let meetingsNo = this.meetings.length;  
            this.meetingsNoMsg = "" + meetingsNo + " (Andata e Ritorno)";
        }

        this.cols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'direction',   header: 'A/R' },
            { field: 'name',        header: 'Incontro' }
        ];

        this.rows = [];
        for(let i=0;i<this.meetings.length; i++) {
            let m = this.meetings[i];
            if( m.direction == Direction.OneWay) {
                let dt = this.dateFormatPipe.transform(m.datetime);
                this.rows.push({m:m, dateAndTime: dt, direction: m.direction, name: m.name});
            }
        }

        if( this.selectedTourney.isOnewayRound != "true" ) {
            for(let i=0;i<this.meetings.length; i++) {
                let m = this.meetings[i];
                if( m.direction == Direction.RoundTrip) {
                    let dt = this.dateFormatPipe.transform(m.datetime);
                    this.rows.push({m:m, dateAndTime: dt, direction: m.direction, name: m.name});
                }
            }
        }

        this.rows = this.sortMeetings(this.rows);
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

