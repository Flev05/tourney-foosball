import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

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
            { field: 'direction',   header: 'A/R' },
            { field: 'name',        header: 'Incontro' }
        ];

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;

        // this.removeRoundTripPlayoff();
        
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


        this.rows = [];
        for(let i=0;i<this.meetings.length; i++) {
            let m = this.meetings[i];
            let dt = this.dateFormatPipe.transform(m.datetime);
            this.rows.push({m:m, dateAndTime: dt, direction: m.direction, name: m.name});
        }
        this.rows = this.sortMeetings(this.rows);
    }
 
    // private removeRoundTripPlayoff() {
    //     console.log("removeRoundTripPlayoff()");

    //     if(!this.selectedTourney.isOnewayPlayoff)  {
    //         return;
    //     }
        
    //     let tmpMeetings: Array<Meeting> = new Array<Meeting>();

    //     for( let m of this.selectedPlayoff.round.meetings) {
    //         if(m.direction == Direction.OneWay) {
    //             tmpMeetings.push(m);
    //         } else {
    //             this.tourneyService.deleteMeeting(m);
    //         }
    //     }
    //     this.selectedPlayoff.round.meetings = tmpMeetings;
        
    //     this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
    // }

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

