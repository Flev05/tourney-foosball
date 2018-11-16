import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Round } from 'app/tourneyonline/domain/round';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { TourneyType } from 'app/tourneyonline/domain/enumerations';
import { Match } from 'app/tourneyonline/domain/match';


@Component({
    templateUrl: './meeting-detailview.html'
})
export class MeetingDetailView extends AbstractDetailView {
    static redirect: string = "";
    
    msgs: Message[] = [];

    selectedMeeting: Meeting;
    selectedRound: Round;

    matches: Match[];

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

        if(this.selectedMeeting.matches.length==0) {
            this.selectedMeeting.matches=[];
            for(let i=0; i<this.selectedTourney.maxMatchesPerMeeting; i++) {
                let m: Match = {id:i
                    ,players1: []
                    ,players2: []
                    ,score1:0
                    ,score2:0
                };
                this.selectedMeeting.matches.push(m);
            }
        }
        this.matches = [...this.selectedMeeting.matches];
    }

    minus1(m: Match) {
        let ii = m.id;
        this.matches[ii].score1--;
        if(this.matches[ii].score1 < 0) {
            this.matches[ii].score1=0;
        }
    }

    plus1(m: Match) {
        let ii = m.id;
        this.matches[ii].score1++;
    }

    minus2(m: Match) {
        let ii = m.id;
        this.matches[ii].score2--;
        if(this.matches[ii].score2 < 0) {
            this.matches[ii].score2=0;
        }
    }

    plus2(m: Match) {
        let ii = m.id;
        this.matches[ii].score2++;
    }

    save() {

        this.selectedMeeting.matches = this.matches;
        this.selectedMeeting.score1 = 0;
        this.selectedMeeting.score2 = 0;

        let goals1 = 0;
        let goals2 = 0;
        for(let i=0; i<this.matches.length; i++) {
            let m = this.matches[i];
            goals1 = m.score1;
            goals2 = m.score2;

            if (goals1 > goals2) {

                if (this.selectedTourney.discipline == TourneyType.Score) {
                    if (this.selectedMeeting.score1 == this.selectedMeeting.score2 + 1) {
                        this.selectedMeeting.score1 = this.selectedTourney.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.score2 = this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
                    }
                } else {
                    this.selectedMeeting.score1 += this.selectedTourney.matchWinnerScores;
                }
            } 
                        
            if (goals2 > goals1) {
                if (this.selectedTourney.discipline == TourneyType.Score) {
                    if (this.selectedMeeting.score2 == this.selectedMeeting.score1 + 1) {
                        this.selectedMeeting.score2 += this.selectedTourney.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.score1 += this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
                    }
                } else {
                    this.selectedMeeting.score2 += this.selectedTourney.matchWinnerScores;
                }
            }

            if (goals1 == goals2) {
                this.selectedMeeting.score2 += this.selectedTourney.matchBalanceScores;
                this.selectedMeeting.score1 += this.selectedTourney.matchBalanceScores;
            }
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica result fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

