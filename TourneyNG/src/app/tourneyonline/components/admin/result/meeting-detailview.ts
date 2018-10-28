import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';

@Component({
    templateUrl: './meeting-detailview.html'
})
export class MeetingDetailView extends AbstractListView {
    static redirect: string = "";
    
    msgs: Message[] = [];

    selectedMeeting: Meeting;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MeetingDetailView.redirect, tourneyService, router, location);
    }
 
    ngOnInit() {
        super.ngOnInit();

        this.selectedMeeting  = this.tourneyService.selectedMeeting;    
    }

    save() {

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica result fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

