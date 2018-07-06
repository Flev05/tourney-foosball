import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

 
import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { CalendarTourneyListView } from '../calendar/tourney-listview';

const redirect = '/playoff/lv';

@Component({
    templateUrl: './tourney-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
    `]
})
export class PlayoffTourneyListView extends CalendarTourneyListView {

    onRowSelect(event) {
        super.onRowSelect(event);
        this.gotoDetailView();
    }
  
    protected gotoDetailView() {
        this.router.navigate([redirect]);
    }

    // ttemp: Tourney[];

    // protected loadTourney() {
    //     console.log("Entering PlayoffTourneyListView.loadTourney()");

    //     this.tourneyService.loadTourneyPlayoff().subscribe(t => this.tourneys = t);

    //     console.log("loadTourney(): " + this.tourneys);
        // this.tourneys=[];
        // var rr : Tourney;
        // for(let i=0; i<this.tourneys.length; i++) {
        //     let rr: Tourney = this.tourneys[i];
        //     if(rr.playoffs == undefined) {
        //         continue;
        //     }
        //     this.tourneys.push(rr);
        // }
    // }

}
