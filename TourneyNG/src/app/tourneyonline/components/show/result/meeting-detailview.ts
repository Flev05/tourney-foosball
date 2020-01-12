import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Match } from 'app/tourneyonline/domain/match';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

@Component({
    templateUrl: './meeting-detailview.html'
})
export class MeetingDetailView extends AbstractDetailView {
    static redirect: string = "";
    static meetingDvRedirect:   string = "result/lv/meetingLv/dv";
    
    msgs: Message[] = [];

    selectedMeetingDb: MeetingDb;
    selectedMeeting: Meeting;

    matches: Match[];

    teamPassedMessage: string;
    currentDay: number;
    isSavedNewResult: boolean;
    roundName: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedMeetingDb  = this.meetingService.selectedMeetingDb;   
        this.selectedMeeting  = this.meetingService.selectedMeeting;   

        this.roundName = this.tourneyService.selectedRoundName;
        this.currentDay = this.meetingService.currentDay;
        this.isSavedNewResult = false;

        if(this.selectedMeeting.teamName1 == "" || this.selectedMeeting.teamName2 == "") {
            let teamPassed = this.selectedMeeting.teamName1 != "" ? 
                this.selectedMeeting.teamName1 : this.selectedMeeting.teamName2;

            if(this.tourneyService.selectedEliminatoryLevel.isTopLevel) {
                this.teamPassedMessage = "Attenzione! La Squadra: " + teamPassed + " passa automaticamente al turno successivo!";
            } else {
                this.teamPassedMessage = "Attenzione! Non sono ancora terminati gli incontri del livello precedente!";
            }

            return;
        }

        if(this.selectedMeeting.matches.length!=this.selectedTourney.maxMatchesPerMeeting) {
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
        this.save();
    }

    plus1(m: Match) {
        let ii = m.id;
        this.matches[ii].score1++;
        if(this.matches[ii].score1 > this.selectedTourney.pointsNeededToWin) {
            this.matches[ii].score1 = this.selectedTourney.pointsNeededToWin;
        }
        this.save();
    }

    minus2(m: Match) {
        let ii = m.id;
        this.matches[ii].score2--;
        if(this.matches[ii].score2 < 0) {
            this.matches[ii].score2=0;
        }
        this.save();
    }

    plus2(m: Match) {
        let ii = m.id;
        this.matches[ii].score2++;
        if(this.matches[ii].score2 > this.selectedTourney.pointsNeededToWin) {
            this.matches[ii].score2 = this.selectedTourney.pointsNeededToWin;
        }
        this.save();
    }

    private save() {
        this.selectedMeeting.isPlayed = true;
        this.selectedMeeting.matches = this.matches;
        this.selectedMeeting.points1 = 0;
        this.selectedMeeting.points2 = 0;
        this.selectedMeeting.status = MeetingStatus.Terminated;

        let goals1 = 0;
        let goals2 = 0;
        let terminated : boolean = true;

        for(let i=0; i<this.matches.length; i++) {
            let m = this.matches[i];
            goals1 = m.score1;
            goals2 = m.score2;

            if(m.score1 < this.selectedTourney.pointsNeededToWin && m.score2 < this.selectedTourney.pointsNeededToWin ) {
                terminated = false;
            }

            if (goals1 > goals2) {
                if (this.selectedTourney.tourneyType == TourneyType.Score) {
                    if (goals1==this.selectedTourney.pointsNeededToWin && (goals1 == goals2 + 1)) {
                        this.selectedMeeting.points1 += this.selectedTourney.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.points2 += this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
                    } else {
                        this.selectedMeeting.points1 += this.selectedTourney.matchWinnerScores;
                    }
                } else {
                    this.selectedMeeting.points1 += this.selectedTourney.matchWinnerScores;
                }
            } 
                        
            if (goals2 > goals1) {
                if (this.selectedTourney.tourneyType == TourneyType.Score) {
                    if (goals2==this.selectedTourney.pointsNeededToWin && (goals2 == goals1 + 1)) {
                        this.selectedMeeting.points2 += this.selectedTourney.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.points1 += this.selectedTourney.pointsGoldenGoalTieBreakDefeat;
                    } else {
                        this.selectedMeeting.points2 += this.selectedTourney.matchWinnerScores;
                    }
                } else {
                    this.selectedMeeting.points2 += this.selectedTourney.matchWinnerScores;
                }
            }

            if (goals1 == goals2) {
                this.selectedMeeting.points2 += this.selectedTourney.matchBalanceScores;
                this.selectedMeeting.points1 += this.selectedTourney.matchBalanceScores;
            }
        }

        this.selectedMeeting.status = terminated ? MeetingStatus.Terminated : MeetingStatus.InProgress;
       
        this.isSavedNewResult = true;
        let observer = null;
        if( this.selectedMeetingDb.roundId != null ) {
            this.tourneyService.cleanRoundMeeting(this.selectedTourney);
            observer = this.meetingService.saveRoundMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.roundId);
        }
        if( this.selectedMeetingDb.playoffId != null ) {
            this.tourneyService.cleanPlayoffMeeting(this.selectedTourney);
            observer = this.meetingService.savePlayoffMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.playoffId);
        }
        if( this.selectedMeetingDb.eliminatoryId != null ) {
            this.tourneyService.cleanEliminatoryMeeting(this.selectedTourney);
            observer = this.meetingService.saveEliminatoryMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.eliminatoryId);
        }
        if(observer != null) {            
            observer.subscribe(n => this.next(n), e => this.onError(e) );            
        }
    }

    goBack(): void {
        if(this.isSavedNewResult) {
            this.tourneyService.updateTourneyWithCleanAll(this.selectedTourney, () => super.goBack());
        } else {
            super.goBack();
        }
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica result fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

