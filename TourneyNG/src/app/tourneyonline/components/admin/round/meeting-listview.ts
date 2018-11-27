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


@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminround/lv/meetingLv/dv";

    msgs: Message[] = [];
    selectedRound: Round;
    selectedMeeting: Meeting;
    meetings: Meeting [];
    atLeast2teams: boolean;
    private mdbs: MeetingDb[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        this.meetings = this.selectedRound.meetings;

        this.removeRoundTrip();

        this.atLeast2teams = this.meetings.length > 0 ? true : false;
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

        this.tourneyService.selectedMeeting = this.selectedMeeting;

        this.gotoDetailView();
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiornamento configurazione gironi fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }

}

