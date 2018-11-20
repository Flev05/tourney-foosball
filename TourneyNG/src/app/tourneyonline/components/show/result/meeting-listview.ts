import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Classification } from 'app/tourneyonline/domain/classification';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "result/lv/meetingLv/dv";
    
    msgs: Message[] = [];
    selectedRound: Round;

    selectedMeeting: Meeting;
    meetings: Meeting [];
    
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }
 
    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;    
        this.createClassification(this.tourneyService.selectedRound);

        this.meetings = this.selectedRound.meetings;
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
    
    onRowSelect(event) {
        console.log("Entering onRowSelect()");

        this.tourneyService.selectedMeeting = this.selectedMeeting;

        this.router.navigate([MeetingListView.redirect]);
    }
}

