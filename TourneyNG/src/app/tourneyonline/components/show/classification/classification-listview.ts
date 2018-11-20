import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Round } from '../../../domain/round';
import { Classification } from '../../../domain/classification';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';

@Component({
    templateUrl: './classification-listview.html',
    styles: [`
        /* Column Priorities */
        @media only all {
            th.ui-p-6,
            td.ui-p-6,
            th.ui-p-5,
            td.ui-p-5,
            th.ui-p-4,
            td.ui-p-4,
            th.ui-p-3,
            td.ui-p-3,
            th.ui-p-2,
            td.ui-p-2,
            th.ui-p-1,
            td.ui-p-1 {
                display: none;
            }
        }
        
        /* Show priority 1 at 320px (20em x 16px) */
        @media screen and (min-width: 20em) {
            th.ui-p-1,
            td.ui-p-1 {
                display: table-cell;
            }
        }
        
        /* Show priority 2 at 480px (30em x 16px) */
        @media screen and (min-width: 30em) {
            th.ui-p-2,
            td.ui-p-2 {
                display: table-cell;
            }
        }
        
        /* Show priority 3 at 640px (40em x 16px) */
        @media screen and (min-width: 40em) {
            th.ui-p-3,
            td.ui-p-3 {
                display: table-cell;
            }
        }
        
        /* Show priority 4 at 800px (50em x 16px) */
        @media screen and (min-width: 50em) {
            th.ui-p-4,
            td.ui-p-4 {
                display: table-cell;
            }
        }
        
        /* Show priority 5 at 960px (60em x 16px) */
        @media screen and (min-width: 60em) {
            th.ui-p-5,
            td.ui-p-5 {
                display: table-cell;
            }
        }
        
        /* Show priority 6 at 1,120px (70em x 16px) */
        @media screen and (min-width: 70em) {
            th.ui-p-6,
            td.ui-p-6 {
                display: table-cell;
            }
        }
    `]
})
export class ClassificationListView extends AbstractListView {

    
    roundsRows: any[] = [];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.prepareRoundClassification(this.selectedTourney.rounds);
    }

    private prepareRoundClassification(rounds: Round[]) {

        let row : number = 0;

        var roundMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            
            round.classification = this.createClassification(round);

            for (let j = 0; j < round.classification.length; j++) {
                
                let c : Classification = round.classification[j];

                let currentKey = this.makeKey(round, c);  
                let len = round.meetings.length;
                console.log(currentKey + " rowspan=" + len);       

                this.roundsRows.push(c);
                this.roundsRows[row].roundName = round.name;    
                this.roundsRows[row].teamName = c.team.teamName;    
                this.roundsRows[row].points = c.points;    
                this.roundsRows[row].played = c.played;    
                this.roundsRows[row].won = c.won;    
                this.roundsRows[row].lost = c.lost;    
                this.roundsRows[row].balanced = c.balanced;    
                this.roundsRows[row].goalsDone = c.goalsDone;    
                this.roundsRows[row].goalsConceded = c.goalsConceded;    
                this.roundsRows[row].goalsDiff = c.goalsDiff;    
                if(!roundMap.has(currentKey)) {
                    roundMap.set(currentKey, c);
                    this.roundsRows[row].rowspanSize = len;
                } else {
                    this.roundsRows[row].rowspanSize = undefined;
                }
                row++;                
            }
        }
    }

    makeKey( round : Round, c : Classification) : string {
        let key = round.name + " - " + c.team.teamName;
        return key;
    }
    private createClassification(round: Round): Classification[] {
        let classificationMap : Map<string, Classification> = new Map<string, Classification>();

        for(let m of round.meetings) {
            if(m.status == MeetingStatus.ToPlay) {
                continue;
            }

            let t1 = m.team1;

            let key1 = t1.teamName;
            if(!classificationMap.has(key1)) {
                let c = this.newClassification(t1, 0);
                classificationMap.set(key1, c);
            }
            let c1 = classificationMap.get(key1);            
 
            let t2 = m.team2;
            let key2 = t2.teamName;
            if(!classificationMap.has(key2)) {
                let c2 = this.newClassification(t2, 0);
                classificationMap.set(key2, c2);
            }
            let c2 = classificationMap.get(key2);

            c1.played++;
            c2.played++;

            c1.points += m.points1;
            c2.points += m.points2;

            if (m.points1 > m.points2) {
                c1.won++;
                c2.lost++;
            }
            if (m.points2 > m.points1) {
                c2.won++;
                c1.lost++;
            }
            if (m.points1 == m.points2) {
                c1.balanced++;
                c2.balanced++;
            }
            for (let ma of m.matches) {
                c1.goalsDone += ma.score1;
                c1.goalsConceded += ma.score2;

                c2.goalsDone += ma.score2;
                c2.goalsConceded += ma.score1;
            }
            c1.goalsDiff = c1.goalsDone - c1.goalsConceded;        
            c2.goalsDiff = c2.goalsDone - c2.goalsConceded;        
        }

        let classificationList: Classification[] = [];
        for( let c of classificationMap.values()) {
            classificationList.push(c);            
        }

        classificationList = this.sortDesc(classificationList);

        round.classification = classificationList;

        return classificationList;
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
}
