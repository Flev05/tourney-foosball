import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';

const redirect: string = "adminresult/lv/meetingLv/dv";

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    msgs: Message[] = [];
    selectedRound: Round;

    selectedMeeting: Meeting;
    meetings: Meeting [];
    
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }
 
    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {

        this.selectedRound = this.tourneyService.selectedRound;

        this.meetings = this.selectedRound.meetings;
    }
 
    save() {
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica matrix fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

