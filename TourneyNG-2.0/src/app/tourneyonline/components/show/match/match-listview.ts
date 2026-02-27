import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Match } from 'app/tourneyonline/domain/match';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';

@Component({
    templateUrl: './match-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class MatchListView extends AbstractListView {
    selectedMeeting: Meeting = new Meeting();

    matches: Match[] = [];
    rows: any[] = [];

    constructor(
        protected override tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected override router: Router,
        protected override location: Location
    ) {

        super("", tourneyService, router, location);
    }    

    override ngOnInit() {
        this.selectedMeeting = this.meetingService.selectedMeeting;
        this.matches = this.selectedMeeting.matches;

        let t1, t2: string;
        for( let j=0; j<this.matches.length; j++ ) {
            t1 = "";
            t2 = "";
            let m: Match = this.matches[j];
            for(let i=0; i<m.players1.length; i++) {
                t1 += m.players1[i].playerName;
                if(i < m.players1.length-1) {
                    t1 += ", ";
                }
            }
            console.log(t1);

            for(let i=0; i<m.players2.length; i++) {
                t2 += m.players2[i].playerName;
                if(i < m.players2.length-1) {
                    t2 += ", ";
                }
            }
            console.log(t1);

            let row = {players1: t1, players2: t2, score1: m.score1, score2: m.score2};

            this.rows.push(row);
        }
    }

    override goBack(): void {
        this.location.back();
    }
}

