import { Component, OnInit } from '@angular/core';
 
import { Meeting } from '../../../domain/meeting';
 
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
    playoffs: Round[];

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
                
                let m : Meeting = round.calendars[j];
                let currentKey = this.makeKey(round, m);  

                let len = round.calendars.length;
                console.log(currentKey + " rowspan=" + len);

                this.rows.push(m);
                this.rows[row].roundName = round.name ;    
                this.rows[row].meetingName = m.name;    
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
    
    makeKey( round : Round, cal : Meeting) : string {
        let key = round.name + " - " + cal.name;
        return key;
    }
}

