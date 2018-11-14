import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Round } from 'app/tourneyonline/domain/round';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { TourneyType } from 'app/tourneyonline/domain/enumerations';


@Component({
    templateUrl: './meeting-detailview.html'
})
export class MeetingDetailView extends AbstractDetailView {
    static redirect: string = "";
    
    msgs: Message[] = [];

    selectedMeeting: Meeting;
    selectedRound: Round;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;    

        this.selectedMeeting  = this.tourneyService.selectedMeeting;    
    }

    minus1() {
        this.selectedMeeting.score1--;
        if(this.selectedMeeting.score1<0) {
            this.selectedMeeting.score1=0;
        }
    }

    plus1() {
        this.selectedMeeting.score1++;
    }

    minus2() {
        this.selectedMeeting.score2--;
        if(this.selectedMeeting.score2<0) {
            this.selectedMeeting.score2=0;
        }
    }

    plus2() {
        this.selectedMeeting.score2++;
    }

    save() {

        super.initClassification(this.selectedRound);

        for(let m of this.selectedRound.meetings) {
            for(let c of this.selectedRound.classification) {
                if(c.team.id == this.selectedMeeting.team1.id) {
                    c.points += this.selectedMeeting.score1;
                }
                if(c.team.id == this.selectedMeeting.team2.id) {
                    c.points += this.selectedMeeting.score2;
                }
            }
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    private updateMatchPoints() {
        let points1 = this.selectedTourney.pointsNeededToWin;
        let points2 = 0;
        if (this.selectedMeeting.score1 > this.selectedMeeting.score2) {
            if (this.selectedTourney.discipline == TourneyType.Score) {
                if (this.selectedMeeting.score1 == this.selectedMeeting.score2 + 1) {
                    points1 = this.selectedTourney.pointsGoldenGoalTieBreakWin;
                    points2 = this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
                }
            }
        }
        else {
            points1 = 0;
            points2 = this.selectedTourney.pointsNeededToWin;
            if (this.selectedTourney.discipline == TourneyType.Score) {
                if (this.selectedMeeting.score2 == this.selectedMeeting.score1 + 1) {
                    points2 = this.selectedTourney.pointsGoldenGoalTieBreakWin;
                    points1 = this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
                }
            }
        }
        return { points1, points2 };
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica result fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

