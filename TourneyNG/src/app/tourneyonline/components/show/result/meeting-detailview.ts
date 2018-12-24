import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Message } from 'primeng/api';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { TourneyType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Match } from 'app/tourneyonline/domain/match';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';

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
    teamPassed: string | boolean;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedMeetingDb  = this.tourneyService.selectedMeetingDb;   
        this.selectedMeeting = JSON.parse(this.selectedMeetingDb.json);

        this.alreadyPassed = false;
        if(this.selectedMeeting.team1.teamName == "" || this.selectedMeeting.team2.teamName == "") {
            this.teamPassed = this.selectedMeeting.team1.teamName != "" ? 
                this.selectedMeeting.team1.teamName : this.selectedMeeting.team2.teamName;
            this.alreadyPassed = true;
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
       
        let mdb: MeetingDb = this.tourneyService.prepareMdb(this.selectedMeeting
            , this.selectedTourney.id
            , this.tourneyService.selectedMeetingDb.roundId
            , this.tourneyService.selectedMeetingDb.playoffId
            , this.tourneyService.selectedMeetingDb.eliminatoryId
            );            
        this.tourneyService.updateMeeting(mdb).subscribe(n => this.next(n), e => this.onError(e));

        this.updateNextLevel();
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), ()=>this.onComplete());
    }

    /**
     * Fills the next eliminatory level, up to the final level, in function of the results in the current
     * meeting of the current level. If the match is in balance, no fill will take place in the next level
     * and all remain as is.
     */
    private updateNextLevel(): void {
        if(this.tourneyService.selectedEliminatoryLevelIndex >= 0 && this.tourneyService.selectedEliminatoryIndex >= 0) {

            const els = this.selectedTourney.eliminatoryLevels;
            let el: EliminatoryLevel = els[this.tourneyService.selectedEliminatoryLevelIndex];
            let  l: Eliminatory = el.eliminatories[this.tourneyService.selectedEliminatoryIndex];

            if(this.tourneyService.selectedEliminatoryLevelIndex < els.length-1) {
                
                let nextEliminatoryLevelIndex = this.tourneyService.selectedEliminatoryLevelIndex + 1;
                let nextEliminatoryLevel: EliminatoryLevel = els[nextEliminatoryLevelIndex];

                let nextEliminatoryIndex: number = Math.floor(this.tourneyService.selectedEliminatoryIndex / 2);
                let nextEliminatory: Eliminatory = nextEliminatoryLevel.eliminatories[nextEliminatoryIndex];

                for(let i=0; i<l.round.meetings.length; i++) {
                    let m = l.round.meetings[i];
                    if(m.id == this.selectedMeeting.id) {
                        l.round.meetings[i] = this.selectedMeeting;
                    }
                }
        
                const onewayMeeting:    Meeting = l.round.meetings[0];
                const roundtripMeeting: Meeting = l.round.meetings[1];

                let points1 = onewayMeeting.points1;
                let points2 = onewayMeeting.points2;
                if(!el.isOneway) {
                    points1 += roundtripMeeting.points1;
                    points2 += roundtripMeeting.points2;
                }
                
                let nextMeeing: Meeting = nextEliminatory.round.meetings[0];
                if(points1 > points2) {
                    nextEliminatory.round.teams[0] = onewayMeeting.team1;

                    if(nextMeeing.team1.teamName == "" && nextMeeing.team2.teamName == "") {
                        let randomIndex = Math.random();                        
                        if(randomIndex < 0.5) {
                            nextMeeing.team1 = onewayMeeting.team1;
                        } else {
                            nextMeeing.team2 = onewayMeeting.team1;
                        }
                    } else {
                        if(nextMeeing.team1.teamName == "") {
                            nextMeeing.team1 = onewayMeeting.team1;
                        } else {
                            nextMeeing.team2 = onewayMeeting.team1;
                        }
                    }
                }

                if(points2 > points1) {
                    nextEliminatory.round.teams[1] = onewayMeeting.team2;
                    if(nextMeeing.team1.teamName == "" && nextMeeing.team2.teamName == "") {
                        let randomIndex = Math.random();                        
                        if(randomIndex < 0.5) {
                            nextMeeing.team1 = onewayMeeting.team2;
                        } else {
                            nextMeeing.team2 = onewayMeeting.team2;
                        }
                    } else {
                        if(nextMeeing.team1.teamName == "") {
                            nextMeeing.team1 = onewayMeeting.team2;
                        } else {
                            nextMeeing.team2 = onewayMeeting.team2;
                        }
                    }
                }
                let mdb: MeetingDb = this.tourneyService.prepareMdb(nextMeeing
                    , this.selectedTourney.id
                    , 0
                    , 0
                    , nextEliminatory.id
                );        
                this.tourneyService.updateMeeting(mdb).subscribe(n => this.next(n), e => this.onError(e));
            }
        }
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

