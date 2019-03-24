import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminround/lv/meetingLv/dv";
    cols: TableCols[] ;
    
    selectedRow: Meeting;

    msgs: Message[] = [];
    selectedRound: Round;
    atLeast2teams: boolean;
 
    isRoundTrip: boolean;
    mdbList: MeetingDb[];

    constructor(
        protected tourneyService: TourneyService,
        public meetingService: MeetingRoundService,
        protected router: Router,
        protected location: Location
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        
        this.cols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'teamName1',   header: 'In casa' },
            { field: 'teamName2',   header: 'Trasferta' }
        ];
        
        this.atLeast2teams = this.selectedRound.teams.length >= 2 ? true : false;
        if(!this.atLeast2teams) {
            return;
        }

        this.isRoundTrip = true;
        if (this.selectedTourney.isOnewayRound == "true") {
            this.isRoundTrip = false;
        }

        this.meetingService.createRoundMeeting(this.selectedTourney, this.selectedRound);
    }
     
    onRowSelect(event) {
        console.log(event.data);

        this.meetingService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }
}

