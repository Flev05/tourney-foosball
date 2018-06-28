import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { Round } from '../../domain/round';
import { Calendar } from '../../domain/calendar';
import { Meeting } from '../../domain/meeting';
import { TourneyService } from '../../service/tourneyservice';

@Component({
    templateUrl: './calendar-detailview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class CalendarDetailView implements OnInit {

    selectedTourney: Tourney;

    rounds: [Round];

    rows: any[] = [];

    constructor(
        private tourneyService: TourneyService,
        private location: Location
    ) {}

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.rounds = this.selectedTourney.rounds;

        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {

        let row : number = 0;

        var roundMap: Map<string, Meeting> = new Map<string, Meeting>();

        for (let i = 0; i < this.rounds.length; i++) {
            
            let round : Round = this.rounds[i];

            for (let j = 0; j < round.calendars.length; j++) {
                
                let cal : Calendar = round.calendars[j];
                let currentKey = this.makeKey(round, cal);  

                let len = cal.meetings.length;
                console.log(currentKey + " rowspan=" + len);

                for(let k = 0; k < len; k++ ) {
                    let m : Meeting = cal.meetings[k];
                    this.rows.push(m);
                    this.rows[row].roundName = round.roundName + "(" + round.direction + ")";    
                    this.rows[row].meetingName = cal.meetingName;    
                    if(!roundMap.has(currentKey)) {
                        roundMap.set(currentKey, m);
                        this.rows[row].rowspanSize = len;
                    } else {
                        this.rows[row].rowspanSize = undefined;
                    }

                    this.rows[row].team1 = m.team1;
                    this.rows[row].team2 = m.team2;
                    
                    this.rows[row].date = m.date;    
                    this.rows[row].time = m.time;    
                    this.rows[row].address = m.address;    

                    this.rows[row].score1 = m.score1;
                    this.rows[row].score2 = m.score2;
                    
                    row++;
                }
            }
        }
    }

    makeKey( round : Round, cal : Calendar) : string {
        let key = round.roundName + "(" + round.direction + ") - " + cal.meetingName;
        return key;
    }

    goBack(): void {
        this.location.back();
    }
}
