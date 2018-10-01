import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Meeting } from '../../../domain/meeting';
import { TourneyService } from '../../../service/tourneyservice';
import { CalendarDetailView } from '../calendar/calendar-detailview';

const redirect = '/match/matchlv';

@Component({
    templateUrl: './meeting-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class MeetingListView extends CalendarDetailView {
    constructor(protected tourneyService: TourneyService, protected location: Location, public router: Router) { 
        super(tourneyService,location);
        console.log("MeetingListView.constructor()");
    }

    selectedMeeting : Meeting;

    onRowSelect(event) {
        console.log("MeetingListView.onRowSelect()event: " + event);
        this.tourneyService.selectedMeeting = this.cloneMeeting(event.data);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }

    cloneMeeting(c: any): any {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
