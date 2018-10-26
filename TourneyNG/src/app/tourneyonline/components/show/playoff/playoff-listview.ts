import { Component, OnInit } from '@angular/core';
 
import { Meeting } from '../../../domain/meeting';
 
import { CalendarDetailView } from '../calendar/calendar-detailview';
import { Round } from '../../../domain/round';
import { Playoff } from 'app/tourneyonline/domain/playoff';

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
    playoffs: Playoff[];

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

        var playoffMap: Map<string, Meeting> = new Map<string, Meeting>();
        this.rows = [];
        
        for (let i = 0; i < this.playoffs.length; i++) {
            
            let playoff : Playoff = this.playoffs[i];

            for (let j = 0; j < playoff.round.meetings.length; j++) {
                
                let m : Meeting = playoff.round.meetings[j];
                let currentKey = this.makeKey(playoff.round, m);  

                let len = playoff.round.meetings.length;
                console.log(currentKey + " rowspan=" + len);

                this.rows.push(m);
                this.rows[row].playoffName = playoff.round.name ;    
                this.rows[row].meetingName = m.name;    
                if(!playoffMap.has(currentKey)) {
                    playoffMap.set(currentKey, m);
                    this.rows[row].rowspanSize = len;
                } else {
                    this.rows[row].rowspanSize = undefined;
                }

                this.rows[row].teamName1 = m.team1.teamName;
                this.rows[row].teamName2 = m.team2.teamName;
                
                this.rows[row].date = m.datetime;    
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

