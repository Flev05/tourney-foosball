import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Round } from 'app/tourneyonline/domain/round';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { DateFormatPipe } from '../../common/DateFormatPipe';


@Component({
    templateUrl: './meeting-listview.html'
    , styles: [`
    /* Column Priorities */
    @media only all {
        th.ui-p-6,
        td.ui-p-6,
        th.ui-p-5,
        td.ui-p-5,
        th.ui-p-4,
        td.ui-p-4,
        th.ui-p-3,
        td.ui-p-3,
        th.ui-p-2,
        td.ui-p-2,
        th.ui-p-1,
        td.ui-p-1 {
            display: none;
        }
    }
    
    /* Show priority 1 at 320px (20em x 16px) */
    @media screen and (min-width: 20em) {
        th.ui-p-1,
        td.ui-p-1 {
            display: table-cell;
        }
    }
    
    /* Show priority 2 at 480px (30em x 16px) */
    @media screen and (min-width: 30em) {
        th.ui-p-2,
        td.ui-p-2 {
            display: table-cell;
        }
    }
    
    /* Show priority 3 at 640px (40em x 16px) */
    @media screen and (min-width: 40em) {
        th.ui-p-3,
        td.ui-p-3 {
            display: table-cell;
        }
    }
    
    /* Show priority 4 at 800px (50em x 16px) */
    @media screen and (min-width: 50em) {
        th.ui-p-4,
        td.ui-p-4 {
            display: table-cell;
        }
    }
    
    /* Show priority 5 at 960px (60em x 16px) */
    @media screen and (min-width: 60em) {
        th.ui-p-5,
        td.ui-p-5 {
            display: table-cell;
        }
    }
    
    /* Show priority 6 at 1,120px (70em x 16px) */
    @media screen and (min-width: 70em) {
        th.ui-p-6,
        td.ui-p-6 {
            display: table-cell;
        }
    }
`]  
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminround/lv/meetingLv/dv";
    cols: any[];
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
            { field: 'datetime',    header: 'Data/Ora' },
            { field: 'direction',   header: 'A/R' },
            { field: 'name',        header: 'Incontro' }
        ];

        this.rows = [];
        for(let i=0;i<this.meetings.length; i++) {
            let m = this.meetings[i];
            let dt = this.dateFormatPipe.transform(m.datetime);
            this.rows.push({m:m, rowNumber: i+1, datetime: dt, direction: m.direction, name: m.name});
        }
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

