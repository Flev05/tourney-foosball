import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
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

    calendars: [Calendar];
 
    rounds: any[] = [];
 

    constructor(
        private tourneyService: TourneyService,
        private location: Location
    ) {}

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.calendars = this.selectedTourney.calendars;

        this.updateRowGroupMetaData();
 
    }

    updateRowGroupMetaData() {

        let k : number = 0;

        var roundMap: Map<string, Meeting> = new Map<string, Meeting>();

        if (this.calendars) {
            
            this.rounds = [];

            for (let i = 0; i < this.calendars.length; i++) {
                
                let cal = this.calendars[i];
                let currentKey = this.makeKey(cal);  

                let len = cal.meetings.length;
                console.log(currentKey + " rowspan=" + len);

                for(let j = 0; j < len; j++ ) {
                    let m : Meeting = cal.meetings[j];
                    this.rounds.push(m);
                    this.rounds[k].round = cal.name;    
                    this.rounds[k].date = cal.date;    
                    this.rounds[k].time = cal.time;    

                    if(!roundMap.has(currentKey)) {
                        roundMap.set(currentKey, m);
                        this.rounds[k].rowspanSize = len;
                    } else {
                        this.rounds[k].rowspanSize = undefined;
                    }

                    this.rounds[k].team1 = cal.meetings[j].team1;
                    this.rounds[k].team2 = cal.meetings[j].team2;
                    this.rounds[k].score1 = 0;
                    this.rounds[k].score2 = 0;
                    
                    k++;
                }
            }
        }
    }

    makeKey(cal : Calendar) : string {
        let key = cal.name + " - " + cal.date + " " + cal.time;
        return key;
    }

    goBack(): void {
        this.location.back();
    }
}
