import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { TourneyService } from '../../../service/tourney-service';
import { Tourney } from '../../../domain/tourney';
 
import { Meeting } from '../../../domain/meeting';
import { Match } from '../../../domain/match';

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
export class MatchListView implements OnInit {
    selectedTourney: Tourney;
    selectedMeeting: Meeting;

    matches: Match[];
    rows: any[] = [];



    constructor(
        protected tourneyService: TourneyService,
        protected location: Location
    ) {}    

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.selectedMeeting = this.tourneyService.selectedMeeting;
        this.matches = this.selectedMeeting.matches;

        let t1, t2: string;
        for( let j=0; j<this.matches.length; j++ ) {
            t1 = "";
            t2 = "";
            let m: Match = this.matches[j];
            for(let i=0; i<m.players1.length; i++) {
                t1 += m.players1[i].firstname + " " + m.players1[i].lastname;
                if(i < m.players1.length-1) {
                    t1 += ", ";
                }
            }
            console.log(t1);

            for(let i=0; i<m.players2.length; i++) {
                t2 += m.players2[i].firstname + " " + m.players2[i].lastname;
                if(i < m.players2.length-1) {
                    t2 += ", ";
                }
            }
            console.log(t1);

            let row = {players1: t1, players2: t2, score1: m.score1, score2: m.score2};

            this.rows.push(row);
        }
    }

    goBack(): void {
        this.location.back();
    }
}

