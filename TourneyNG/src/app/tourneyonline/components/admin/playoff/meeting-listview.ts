import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Direction } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/meetingLv/playoffRuledv";

    msgs: Message[] = [];

    selectedPlayoff: Playoff;
    selectedMeeting: Meeting;
    meetings: Meeting [];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;

        this.removeRoundTripPlayoff();
        
        this.meetings = this.selectedPlayoff.round.meetings;
        for(let m of this.meetings) {
            let p1 = m.playoffConfig1.fromRound.position.label;
            let r1 = m.playoffConfig1.fromRound.round.label;
 
            let p2 = m.playoffConfig2.fromRound.position.label;
            let r2 = m.playoffConfig2.fromRound.round.label;           

            let rn1 = p1 + " " + r1;
            let rn2 = p2 + " " + r2;
            let rn = rn1 + " - " + rn2;

            m.ruleName = rn;
        }
    }
 
    private removeRoundTripPlayoff() {
        console.log("removeRoundTripPlayoff()");

        if(!this.selectedTourney.isOnewayPlayoff)  {
            return;
        }
        
        let tmpMeetings: Array<Meeting> = new Array<Meeting>();

        for( let m of this.selectedPlayoff.round.meetings) {
            if(m.direction == Direction.OneWay) {
                tmpMeetings.push(m);
            }
        }
        this.selectedPlayoff.round.meetings = tmpMeetings;
        
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

        msgerr = 'Aggiornamento configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

