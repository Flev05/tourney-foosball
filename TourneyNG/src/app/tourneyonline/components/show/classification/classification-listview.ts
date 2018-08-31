import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Round } from '../../../domain/round';
import { CalendarDetailView } from '../calendar/calendar-detailview';
import { Classification } from '../../../domain/classification';
import { Meeting } from '../../../domain/meeting';
import { TourneyService } from '../../../service/tourneyservice';

@Component({
    templateUrl: './classification-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
        .ui-table .ui-table-thead > tr > th, .ui-table .ui-table-tbody > tr > td, .ui-table .ui-table-tfoot > tr > td {
            padding: .25em .5em;
            text-align: center;
        }
  `]
})
export class ClassificationListView extends CalendarDetailView {

    selectedTourney: Tourney;

    rounds: [Round];

    rows: any[] = [];

    ngOnInit() {
        super.ngOnInit();
    }
    
    updateRowGroupMetaData() {
        this.rounds = this.selectedTourney.rounds;

        let row : number = 0;

        var roundMap: Map<string, Meeting> = new Map<string, Meeting>();

        for (let i = 0; i < this.rounds.length; i++) {
            
            let round : Round = this.rounds[i];

            let len = round.classification.length;

            for (let j = 0; j < len; j++) {
                
                let cla : Classification = round.classification[j];
                let currentKey = this.makeKey(round);  

                console.log(currentKey + " rowspan=" + len);

                this.rows.push(cla);
                this.rows[row].roundName = round.name + "(" + round.direction + ")";    
                this.rows[row].teamName = cla.team.teamName;    
                if(!roundMap.has(currentKey)) {
                    roundMap.set(currentKey, cla);
                    this.rows[row].rowspanSize = len;
                } else {
                    this.rows[row].rowspanSize = undefined;
                }

                this.rows[row].points = cla.points;
                this.rows[row].played = cla.played;
                this.rows[row].won = cla.won;
                this.rows[row].lost = cla.lost;
                this.rows[row].goalsDone = cla.goalsDone;
                this.rows[row].goalsConceded = cla.goalsConceded;
                this.rows[row].penalty = cla.penalty;
                this.rows[row].goalsDiff = cla.goalsDiff;
                
                row++;
            }
        }
    }

    makeKey( round : Round) : string {
        let key = round.name + "(" + round.direction + ")";
        return key;
    }

    goBack(): void {
        this.location.back();
    }
}
