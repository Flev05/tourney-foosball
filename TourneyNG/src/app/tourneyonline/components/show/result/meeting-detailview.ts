import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyType, MeetingStatus, Direction } from 'app/tourneyonline/domain/enumerations';
import { Match } from 'app/tourneyonline/domain/match';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { LoginService } from 'app/tourneyonline/service/login-service';

const TO_PLAY_POPUP: string = "Attenzione! La confema di tale scelta azzera tutti i dati dell'incontro! Confermi?"
@Component({
    templateUrl: './meeting-detailview.html'
})
export class MeetingDetailView extends AbstractDetailView {
    static redirect: string = "";
    static meetingDvRedirect:   string = "result/lv/meetingLv/dv";
    
    selectedMeetingDb: MeetingDb;
    selectedMeeting: Meeting;

    matches: Match[];

    teamPassedMessage: string;
    currentDay: number;
    roundName: string;
    selectedRound: Round;
    selectedDirection: Direction;
    allDaysNo: number;
    meetingLabel: string;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        public loginService: LoginService,
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedMeetingDb  = this.meetingService.selectedMeetingDb;   
        this.selectedMeeting  = this.meetingService.selectedMeeting;   

        this.selectedRound = this.meetingService.selectedRound;
        this.roundName = this.selectedRound.name;
        this.selectedDirection = this.selectedRound.direction;
        this.meetingService.goBackFromMeeting = true;
        this.meetingLabel = this.meetingService.selectedRound.label;

        this.allDaysNo = this.meetingService.allDaysNo;
        if( this.selectedRound.direction == Direction.OneWay) {
            this.currentDay = this.selectedRound.onewayCurrentDay;
        } else {
            this.currentDay =  this.selectedRound.daysNo + this.selectedRound.roundtripCurrentDay;
        }

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
        // this.matches = [...this.selectedMeeting.matches];
        this.matches = this.selectedMeeting.matches;
    }
    
    disableButton() : string {
        return this.loginService.isFollower() 
            || this.selectedMeeting.status == MeetingStatus.ToPlay 
            || this.selectedMeeting.status == MeetingStatus.Terminated 
            ? "disabled" : "";
    }

    onToPlayClick() {
        console.log("Entering onToPlayClick()");
        console.log(event);
        if(!confirm(TO_PLAY_POPUP)) {
            return;
        }

        this.selectedMeeting.points1 = 0;
        this.selectedMeeting.points2 = 0;
        for( let m of this.selectedMeeting.matches ) {
            m.score1 = 0;
            m.score2 = 0;
        }
        this.selectedMeeting.status = MeetingStatus.ToPlay;
        this.save();
    }

    onInProgressClick() {
        console.log("Entering onInProgressClick()");
        console.log(event);
        this.selectedMeeting.status = MeetingStatus.InProgress;
        this.save();
    }

    onTerminatedClick() {
        console.log("Entering onTerminatedClick()");
        console.log(event);
        this.selectedMeeting.status = MeetingStatus.Terminated;
        this.save();
    }

    minus1(m: Match) {
        let ii = m.id;
        this.matches[ii].score1--;
        if(this.matches[ii].score1 < 0) {
            this.matches[ii].score1=0;
        }
        this.save();
    }

    plus1(m: Match): void {
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        if(this.matches[ii].score1 == this.selectedTourney.pointsNeededToWin) {
            this.matches[ii].status = MeetingStatus.Terminated;
            return;
        }
        this.matches[ii].score1++;
        if(this.matches[ii].score1 >= this.selectedTourney.pointsNeededToWin) {
            this.matches[ii].score1 = this.selectedTourney.pointsNeededToWin;
            let all : boolean = true;
            for( let m of this.matches ) {
                if( m.score1 < this.selectedTourney.pointsNeededToWin && m.score2 < this.selectedTourney.pointsNeededToWin) {
                    all = false;
                    break;
                }
            }
            if( all ) {
                this.selectedMeeting.status = MeetingStatus.Terminated;
            }
        }
        this.save();
    }

    minus2(m: Match): void {
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        this.matches[ii].score2--;
        if(this.matches[ii].score2 < 0) {
            this.matches[ii].score2=0;
        }
        this.save();
    }

    plus2(m: Match): void {
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        if(this.matches[ii].score2 == this.selectedTourney.pointsNeededToWin) {
            this.matches[ii].status = MeetingStatus.Terminated;
            return;
        }
        this.matches[ii].score2++;
        if(this.matches[ii].score2 >= this.selectedTourney.pointsNeededToWin) {
            this.matches[ii].score2 = this.selectedTourney.pointsNeededToWin;
            let all : boolean = true;
            for( let m of this.matches ) {
                if( m.score1 < this.selectedTourney.pointsNeededToWin && m.score2 < this.selectedTourney.pointsNeededToWin) {
                    all = false;
                    break;
                }
            }
            if( all ) {
                this.selectedMeeting.status = MeetingStatus.Terminated;
            }
        }
        this.save();
    }

    private save() {
        if( this.loginService.isFollower() ) {
            return;
        }

        this.selectedMeeting.matches = this.matches;
        this.selectedMeeting.points1 = 0;
        this.selectedMeeting.points2 = 0;

        let goals1 = 0;
        let goals2 = 0;

        for(let i=0; i<this.matches.length; i++) {
            let m = this.matches[i];
            goals1 = m.score1;
            goals2 = m.score2;

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

            if (goals1 == goals2 && m.status == MeetingStatus.InProgress) {
                this.selectedMeeting.points2 += this.selectedTourney.matchBalanceScores;
                this.selectedMeeting.points1 += this.selectedTourney.matchBalanceScores;
            }
        }
       
        let observer = null;
        if( this.selectedMeetingDb.roundId != null ) {
            this.tourneyService.cleanRoundMeeting(this.selectedTourney);
            observer = this.meetingService.saveRoundMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.roundId, e => this.serverUnreachableHandler(e) );
        }
        if( this.selectedMeetingDb.playoffId != null ) {
            this.tourneyService.cleanPlayoffMeeting(this.selectedTourney);
            observer = this.meetingService.savePlayoffMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.playoffId, e => this.serverUnreachableHandler(e) );
        }
        if( this.selectedMeetingDb.eliminatoryId != null ) {
            this.tourneyService.cleanEliminatoryMeeting(this.selectedTourney);
            observer = this.meetingService.saveEliminatoryMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.eliminatoryId, e => this.serverUnreachableHandler(e) );
        }
        this.serverUnreachable = false;
        if(observer != null) {            
            observer.subscribe(n => this.nextCallback(n), e => this.serverUnreachableHandler(e) );            
        }
    }


    private nextCallback(n: Meeting) {   
        console.log(n);  
        if(this.serverUnreachable) {
            return;
        }
        if(this.selectedDirection == Direction.OneWay) {
            if(this.currentDay > this.selectedRound.onewayCurrentDay) {
                this.selectedRound.onewayCurrentDay = this.currentDay;
            }
        } else {
            if(this.currentDay - this.selectedRound.daysNo > this.selectedRound.roundtripCurrentDay) {
                this.selectedRound.roundtripCurrentDay = this.currentDay - this.selectedRound.daysNo;
            }
        }
        this.tourneyService.updateTourneyWithCleanAll(this.selectedTourney, () => this.reloadMeetings());
    }

    private reloadMeetings(): void {
        if( this.selectedMeetingDb.roundId != null ) {
            this.meetingRoundService.reloadRoundMeeting(this.selectedTourney, this.selectedRound, () => {} );
        } 
        
        if( this.selectedMeetingDb.playoffId != null ) {
            let playoffIds: number[] = [];
            for(let p of this.selectedTourney.playoffs) {
                playoffIds.push(p.id);
            }
            let p: Playoff = this.selectedTourney.playoffs.find( p => p.id == this.selectedRound.id );
            this.meetingPlayoffService.reloadPlayoffMeetings(this.selectedTourney.id, p, () => {}, e => this.serverUnreachableHandler(e) );
        }
    }

    goBack() {
        this.tourneyService.loadTourneyById(this.selectedTourney.id, () =>  super.goBack(), e => this.serverUnreachableHandler(e));
    }

    onError(n:any) {
        console.log('Modifica result fallita');
    }
}

