import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Match } from 'app/tourneyonline/domain/match';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { Observable, of } from 'rxjs';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Tourney } from 'app/tourneyonline/domain/tourney';

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
        private clientService: ClientService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedMeetingDb  = this.meetingService.selectedMeetingDb;   
        this.selectedMeeting  = this.meetingService.selectedMeeting;   

        this.alreadyPassed = false;

        if(this.selectedMeeting.teamName1 == "" || this.selectedMeeting.teamName2 == "") {
            let teamPassed = this.selectedMeeting.teamName1 != "" ? 
                this.selectedMeeting.teamName1 : this.selectedMeeting.teamName2;
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
       
        let observer = null;
        let copy = null;
        if( this.selectedMeetingDb.roundId != null ) {
            copy = this.cleanRoundMeeting(this.selectedTourney);
            observer = this.meetingService.saveRoundMeetingDb(copy, this.selectedTourney.id, this.selectedMeetingDb.roundId);
        }
        if( this.selectedMeetingDb.playoffId != null ) {
            copy = this.cleanPlayoffMeeting(this.selectedTourney);
            observer = this.meetingService.savePlayoffMeetingDb(copy, this.selectedTourney.id, this.selectedMeetingDb.playoffId);
        }
        if( this.selectedMeetingDb.eliminatoryId != null ) {
            copy = this.cleanEliminatoryMeeting(this.selectedTourney);
            observer = this.meetingService.saveEliminatoryMeetingDb(copy, this.selectedTourney.id, this.selectedMeetingDb.eliminatoryId);
        }
        if(observer != null) {            
            observer.subscribe(n => this.next(n), e => this.onError(e), ()=>this.onSaveMeetingComplete(copy) );            
        }
    }

    private onSaveMeetingComplete(copy : Tourney): void {
 
        this.updateNextLevel();

        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(copy, this.clientService.selectedClient);

        let observer = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler("Turney save operation"));
        observer.subscribe(n => this.next(n), e => this.onError(e), ()=>this.onComplete());   
    }

    private cleanRoundMeeting(t: Tourney): Tourney  {
        let copy = this.cloneObject(t);
        for(let r of copy.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }
        return t;
    }

    private cleanPlayoffMeeting(t:  Tourney): Tourney {
        let copy = this.cloneObject(t);
        for(let p of copy.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        return t;
    }

    private cleanEliminatoryMeeting(t: Tourney): Tourney{
        let copy = this.cloneObject(t);
        for(let el of copy.eliminatoryLevels) {
            for( let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        return t;
    }

    private saveTourneyErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            
            return of(result as T);
        };
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
                nextEliminatory.round.teamNames[0] = onewayLevelMeeting.teamName1;
                nextMeeting.teamName1 = onewayLevelMeeting.teamName1;
            } else {
                nextMeeting.teamName2 = onewayLevelMeeting.teamName1;
                nextEliminatory.round.teamNames[1] = onewayLevelMeeting.teamName1;
            }
        }

        if(points2 > points1) {
            if(this.tourneyService.selectedEliminatoryIndex % 2 == 0) {
                nextEliminatory.round.teamNames[0] = onewayLevelMeeting.teamName2;
                nextMeeting.teamName1 = onewayLevelMeeting.teamName2;
            } else {
                nextEliminatory.round.teamNames[1] = onewayLevelMeeting.teamName2;
                nextMeeting.teamName2 = onewayLevelMeeting.teamName2;
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

