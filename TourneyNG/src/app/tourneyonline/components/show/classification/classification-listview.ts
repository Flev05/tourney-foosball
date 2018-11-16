import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Round } from '../../../domain/round';
import { Classification } from '../../../domain/classification';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Match } from 'app/tourneyonline/domain/match';

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
export class ClassificationListView extends AbstractListView {

    selectedRound: Round;
    classification: Classification[] = [];
    isEmpty: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        if(this.selectedRound.teams.length==0) {
            this.isEmpty = true;
            return;
        }
        this.isEmpty = false;


        let classificationMap : Map<string, Classification> = new Map<string, Classification>();

        for(let m of this.selectedRound.meetings) {
            let t1 = m.team1;

            let key1 = t1.teamName;
            if(!classificationMap.has(key1)) {
                let c = this.newClassification(t1, 0);
                classificationMap.set(key1, c);
            }
            let c1 = classificationMap.get(key1);
            this.updateClassification(c1, m.score1, m.score2, m.matches);
 
            let t2 = m.team2;
            let key2 = t2.teamName;
            if(!classificationMap.has(key2)) {
                let c2 = this.newClassification(t2, 0);
                classificationMap.set(key2, c2);
            }
            let c2 = classificationMap.get(key2);
            this.updateClassification(c2, m.score2, m.score1, m.matches);
        }

        this.classification = [];
        for( let c of classificationMap.values()) {
            this.classification.push(c);            
        }

        this.classification = this.sortDesc(this.classification);

        this.selectedRound.classification = this.classification;
    }

    private sortDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        var sortedClassification: Array<Classification>  = unsortedClassification.sort((c1, c2) => {

            if (c1.points > c2.points) {
                return 1;
            }
            if (c1.points < c2.points) {
                return -1;
            }
        
            if( c1.goalsDiff > c2.goalsDiff ) {
                return 1;
            }
            if( c1.goalsDiff < c2.goalsDiff ) {
                return -1;
            }

            if( c1.goalsDone > c2.goalsDone ) {
                return 1;
            }
            if( c1.goalsDone < c2.goalsDone ) {
                return -1;
            }

            if( c1.goalsConceded < c2.goalsConceded ) {
                return 1;
            }
            if( c1.goalsConceded > c2.goalsConceded ) {
                return -1;
            }

            return 0;
        });

        return sortedClassification;
    }

    private updateClassification(c: Classification, score1: number, score2: number, matches: Match[]) {
        c.points += score1;
        if (score1 > score2) {
            c.won++;
        }
        if (score1 == score2) {
            c.balanced++;
        }
        c.played++;
        for (let ma of matches) {
            c.goalsDone += ma.score1;
            c.goalsConceded += ma.score2;
        }
        c.goalsDiff = c.goalsDone - c.goalsConceded;
    }
}
