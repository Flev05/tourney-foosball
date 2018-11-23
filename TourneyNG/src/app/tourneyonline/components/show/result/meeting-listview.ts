import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Classification } from 'app/tourneyonline/domain/classification';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { LoginService } from 'app/tourneyonline/service/loginservice';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "result/lv/meetingLv/dv";
    
    msgs: Message[] = [];
    selectedRound: Round;

    selectedMeeting: Meeting;
    meetings: Meeting [];
    meetingsDb: MeetingDb[];
    mdbs: MeetingDb[] = [];

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

        const subscr = this.tourneyService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subscr.subscribe(t => this.mdbs = t, e => this.onError(e), () => this.onComplete());   
    }

    onComplete(): void {
        this.meetings = [];
        for(let mdb of this.mdbs) {
            let m: Meeting = JSON.parse(mdb.json);
            this.meetings.push(m);
        }
        this.selectedRound.meetings = this.meetings;
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Meeting reload failed';
        this.msgs.push({severity:'error', summary:'Error', detail: msgerr});
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");

        this.tourneyService.selectedMeeting = this.selectedMeeting;

        this.router.navigate([MeetingListView.redirect]);
    }
}

