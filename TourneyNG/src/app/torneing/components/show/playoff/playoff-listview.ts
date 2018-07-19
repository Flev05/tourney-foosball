import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Tourney } from '../../../domain/tourney';
import { Calendar } from '../../../domain/calendar';
import { Meeting } from '../../../domain/meeting';
import { TourneyService } from '../../../service/tourneyservice';
import { CalendarDetailView } from '../calendar/calendar-detailview';
import { Round } from '../../../domain/round';

@Component({
    templateUrl: './playoff-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class PlayoffListView extends CalendarDetailView {
    playoffs: [Round];

    ngOnInit() {
        super.ngOnInit();

        console.log("PlayoffListView.ngOnInit() playoffs=" + this.playoffs);
    }

    updateRowGroupMetaData() {

        if(this.selectedTourney.playoffs==undefined) {
            return;
        }
        this.playoffs = this.selectedTourney.playoffs;

        let row : number = 0;

        var roundMap: Map<string, Meeting> = new Map<string, Meeting>();
        this.rows = [];
        
        for (let i = 0; i < this.playoffs.length; i++) {
            
            let round : Round = this.playoffs[i];

            for (let j = 0; j < round.calendars.length; j++) {
                
                let cal : Calendar = round.calendars[j];
                let currentKey = this.makeKey(round, cal);  

                let len = cal.meetings.length;
                console.log(currentKey + " rowspan=" + len);

                for(let k = 0; k < len; k++ ) {
                    let m : Meeting = cal.meetings[k];
                    this.rows.push(m);
                    this.rows[row].roundName = round.roundName ;    
                    this.rows[row].meetingName = cal.meetingName;    
                    if(!roundMap.has(currentKey)) {
                        roundMap.set(currentKey, m);
                        this.rows[row].rowspanSize = len;
                    } else {
                        this.rows[row].rowspanSize = undefined;
                    }

                    this.rows[row].teamName1 = m.team1.teamName;
                    this.rows[row].teamName2 = m.team2.teamName;
                    
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
        let key = round.roundName + " - " + cal.meetingName;
        return key;
    }

}

