import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';

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
export class MeetingListView extends AbstractListView {
    selectedMeeting : Meeting = new Meeting();
    cols: any[] = [];
    rows: any[] = [];

    constructor(protected override tourneyService: TourneyService
        , protected override location: Location
        , public override router: Router) { 
        super(redirect, tourneyService, router, location);
        console.log("MeetingListView.constructor()");
    }


    onRowSelect(event : any) {
        console.log("MeetingListView.onRowSelect()event: " + event);
        // this.tourneyService.selectedMeeting = this.cloneMeeting(event.data);
        this.gotoDetailView();
    }
  
    protected override gotoDetailView() {
        this.router.navigate([redirect]);
    }

    // cloneMeeting(c: any): any {
    //     let car = {};
    //     for (let prop in c) {
    //         car[prop] = c[prop];
    //     }
    //     return car;
    // }
}
