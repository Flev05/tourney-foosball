import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { TourneyType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Match } from 'app/tourneyonline/domain/match';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
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

    alreadyPassed: boolean = false;
    teamPassedMessage: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedMeetingDb  = this.meetingService.selectedMeetingDb;   
        this.selectedMeeting  = this.meetingService.selectedMeeting;   

        this.alreadyPassed = false;

        if(this.selectedMeeting.team1.teamName == "" || this.selectedMeeting.team2.teamName == "") {
            let teamPassed = this.selectedMeeting.team1.teamName != "" ? 
                this.selectedMeeting.team1.teamName : this.selectedMeeting.team2.teamName;
            this.alreadyPassed = true;

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
       
        if( this.selectedMeetingDb.roundId != null ) {
            this.meetingService.saveRoundMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.roundId);
        }
        if( this.selectedMeetingDb.playoffId != null ) {
            this.meetingService.savePlayoffMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.playoffId);
        }
        if( this.selectedMeetingDb.eliminatoryId != null ) {
            this.meetingService.saveEliminatoryMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.eliminatoryId);
        }
 
        this.updateNextLevel();

        this.tourneyService.saveTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), ()=>this.onComplete());
    }

    /**
     * Fills the next eliminatory level, up to the final level, in function of the results in the current
     * meeting of the current level. If the match is in balance, no fill will take place in the next level
     * and all remain as is.
     */
    private updateNextLevel(): void {
        if(this.tourneyService.selectedEliminatoryLevelIndex < 0 || this.tourneyService.selectedEliminatoryIndex < 0) {
            return;
        }

        const els = this.selectedTourney.eliminatoryLevels;
        if(this.tourneyService.selectedEliminatoryLevelIndex >= els.length-2) {
            return;
        }

        let el: EliminatoryLevel = els[this.tourneyService.selectedEliminatoryLevelIndex];
        let  l: Eliminatory = el.eliminatories[this.tourneyService.selectedEliminatoryIndex];

        let nextEliminatoryLevelIndex = this.tourneyService.selectedEliminatoryLevelIndex + 1;
        let nextEliminatoryLevel: EliminatoryLevel = els[nextEliminatoryLevelIndex];

        let nextEliminatoryIndex: number = Math.floor(this.tourneyService.selectedEliminatoryIndex / 2);
        let nextEliminatory: Eliminatory = nextEliminatoryLevel.eliminatories[nextEliminatoryIndex];

        for(let i=0; i<l.round.onewayMeetings.length; i++) {
            let m = l.round.onewayMeetings[i];
            if(m.id == this.selectedMeeting.id) {
                l.round.onewayMeetings[i] = this.selectedMeeting;
            }
        }

        const onewayLevelMeeting:    Meeting = l.round.onewayMeetings[0];
        const roundtripLevelMeeting: Meeting = l.round.onewayMeetings[1];

        let points1 = onewayLevelMeeting.points1 + roundtripLevelMeeting.points2;
        let points2 = onewayLevelMeeting.points2 + roundtripLevelMeeting.points1;
        if(this.selectedTourney.maxMatchesPerMeeting == 1) {
            points1 = onewayLevelMeeting.matches[0].score1 + roundtripLevelMeeting.matches[0].score2;
            points2 = onewayLevelMeeting.matches[0].score2 + roundtripLevelMeeting.matches[0].score1;
        }
        if(points1 == points2) {
            let offHome1: number = 0;
            let offHome2: number = 0;
            for(let i=0; i<onewayLevelMeeting.matches.length; i++) {
                let ma = onewayLevelMeeting.matches[i];
                offHome2 += ma.score2;
            }
            for(let i=0; i<roundtripLevelMeeting.matches.length; i++) {
                let ma = roundtripLevelMeeting.matches[i];
                offHome1 += ma.score2;
            }
            if(offHome1 > offHome2) {
                points1++;
            }
            if(offHome2 > offHome1) {
                points2++;
            }
        }
 
        let nextMeeting: Meeting = nextEliminatory.round.onewayMeetings[0];
        if(points1 > points2) {
            if(this.tourneyService.selectedEliminatoryIndex % 2 == 0) {
                nextEliminatory.round.teams[0] = onewayLevelMeeting.team1;
                nextMeeting.team1 = onewayLevelMeeting.team1;
            } else {
                nextMeeting.team2 = onewayLevelMeeting.team1;
                nextEliminatory.round.teams[1] = onewayLevelMeeting.team1;
            }
        }

        if(points2 > points1) {
            if(this.tourneyService.selectedEliminatoryIndex % 2 == 0) {
                nextEliminatory.round.teams[0] = onewayLevelMeeting.team2;
                nextMeeting.team1 = onewayLevelMeeting.team2;
            } else {
                nextEliminatory.round.teams[1] = onewayLevelMeeting.team2;
                nextMeeting.team2 = onewayLevelMeeting.team2;
            }
        }
        let mdb = this.meetingService.completeEliminatoryMeetingDb(nextMeeting
            , this.selectedTourney.id
            , nextEliminatory.id
        );        
        this.meetingService.updateMeetingMdb(mdb).subscribe(n => this.next(n), e => this.onError(e));
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica result fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }

    onComplete(): void {
        this.location.back();
    }
}

