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
    selectedMeeting: Meeting;
    meetings: Meeting [];
    atLeast2teams: boolean;

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

        this.removeRoundTrip();

        this.atLeast2teams = this.meetings.length > 0 ? true : false;

        this.cols = [
            { field: 'rowNumber',   header: 'N°' },
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'direction',   header: 'A/R' },
            { field: 'name',        header: 'Incontro' }
        ];

        this.rows = [];
        for(let i=0;i<this.meetings.length; i++) {
            let m = this.meetings[i];
            let dt = this.dateFormatPipe.transform(m.datetime);
            this.rows.push({m:m, rowNumber: i+1, dateAndTime: dt, direction: m.direction, name: m.name});
        }
        this.rows = this.sortMeetings(this.rows);
    }

    private removeRoundTrip() {
        console.log("removeRoundTrip()");

        if(!this.selectedTourney.isOnewayRound)  {
            return;
        }
        
        let tmpMeetings: Array<Meeting> = new Array<Meeting>();

        for( let m of this.meetings) {
            if(m.direction == Direction.OneWay) {
                tmpMeetings.push(m);
            } else {
                this.tourneyService.deleteMeeting(m);
            }
        }
        this.selectedRound.meetings = tmpMeetings;
        
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
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

