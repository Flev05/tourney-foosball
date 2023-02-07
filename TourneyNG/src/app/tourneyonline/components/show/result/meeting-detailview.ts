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
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { MeetingPlayoffService } from 'app/tourneyonline/components/admin/playoff/meeting-playoff-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { AbstractRoundVO } from 'app/tourneyonline/domain/abstract-round-vo';
import { Team } from 'app/tourneyonline/domain/team';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { LevelService } from '../../admin/eliminatory/level-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';

const FREEZE_RESULT_POPUP: string = "Attenzione! La confema di tale scelta congela tutti i dati dell'incontro! Confermi?"
const ON_RESET_POPUP: string = "Attenzione! La confema di tale scelta azzera tutti i dati dell'incontro! Confermi?"
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
    abstractRoundVO: AbstractRoundVO;
    selectedRound: Round;
    selectedDirection: Direction;
    allDaysNo: number;
    meetingLabel: string;

    teamName1CB: Combobox;
    teamName2CB: Combobox;
    teams4RoundCombobox: Combobox[]; 

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected levelService: LevelService,
        protected clientService: ClientService,
        public loginService: LoginService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedMeetingDb  = this.meetingService.selectedMeetingDb;   
        this.selectedMeeting = this.meetingService.selectedMeeting;   
        this.selectedMeeting.datetime = new Date(this.selectedMeeting.datetime);

        this.abstractRoundVO = this.meetingService.abstractRoundVO;
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

        if(this.selectedMeeting.matches.length!=this.abstractRoundVO.maxMatchesPerMeeting) {
            this.selectedMeeting.matches=[];
            for(let i=0; i<this.abstractRoundVO.maxMatchesPerMeeting; i++) {
                let m: Match = {id:i
                    ,players1: []
                    ,players2: []
                    ,score1:0
                    ,score2:0
                };
                this.selectedMeeting.matches.push(m);
            }
        }
        this.matches = this.selectedMeeting.matches;

        this.teams4RoundCombobox = [];
        for( let tn of this.selectedRound.teamNames) {
            let team : Team = this.selectedTourney.teams.find( t => t.teamName == tn);
            this.teams4RoundCombobox.push({label: team.teamName, value: team.id});
        }
        this.teams4RoundCombobox.sort((t1,t2) => {
            if(t1.label < t2.label) {
                return -1;
            }
            if(t1.label > t2.label) {
                return 1;
            }
            return 0;
        });
        this.teamName1CB = {label: this.selectedMeeting.teamName1, value: -1};
        for( let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName1) {
                this.teamName1CB.value = t.id;
                break;
            }
        }
        this.teamName2CB = {label: this.selectedMeeting.teamName2, value: -1};
        for( let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName2) {
                this.teamName2CB.value = t.id;
                break;
            }
        }
    }

    isAtLeastAdmin() : boolean {
        return this.loginService.isAtLeastAdmin() ? true : false;
    }
    
    disabledOperator(): boolean {
        if(this.loginService.isOperator()) {
            let un = this.loginService.userLogged.username;
            let tn : string = this.selectedMeeting.teamName1;
            let team : Team = this.selectedTourney.teams.find(t => t.teamName == tn);
            let index = team.operators.indexOf(un);
            if( index == -1) {
                return true;
            }
        }
        return false;
    }

    disableButton() : string {
        let disOp = this.disabledOperator() ;
        return this.loginService.isFollower() 
            || this.selectedMeeting.status == MeetingStatus.Terminated 
            || disOp 
            ? "disabled" : "";
    }

    onResetPoundsClick() {
        console.log("Entering onResetPoundsClick()");
        if(!confirm(ON_RESET_POPUP)) {
            return;
        }

        this.selectedMeeting.points1 = 0;
        this.selectedMeeting.points2 = 0;
        this.selectedMeeting.status = MeetingStatus.ToPlay;
        for( let m of this.selectedMeeting.matches ) {
            m.score1 = 0;
            m.score2 = 0;
        }
        this.save(false);
    }

    onInProgressClick() {
        console.log("Entering onInProgressClick()");
        this.selectedMeeting.status = MeetingStatus.InProgress; 
        this.save(false);
    }

    onTerminatedClick() {
        console.log("Entering onTerminatedClick()");
        if(!confirm(FREEZE_RESULT_POPUP)) {
            return;
        }
        this.selectedMeeting.status = MeetingStatus.Terminated;
        this.save(true);
    }

    plus1(m: Match): void {
        this.selectedMeeting.status = MeetingStatus.InProgress;
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        if(this.matches[ii].score1 >= this.abstractRoundVO.pointsNeededToWin ) {
            return;
        }
        if(this.matches[ii].score2 >= this.abstractRoundVO.pointsNeededToWin 
            && this.matches[ii].score1 >= this.abstractRoundVO.pointsNeededToWin - 1) {
            return;
        }
        this.matches[ii].score1++;
        this.save(false);
    }

    minus1(m: Match) {
        let ii = m.id;
        this.matches[ii].score1--;
        if(this.matches[ii].score1 < 0) {
            this.matches[ii].score1=0;
        }
        this.save(false);
    }

    plus2(m: Match): void {
        this.selectedMeeting.status = MeetingStatus.InProgress;
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        if(this.matches[ii].score2 >= this.abstractRoundVO.pointsNeededToWin ) {
            return;
        }
        if(this.matches[ii].score1 >= this.abstractRoundVO.pointsNeededToWin
            && this.matches[ii].score2 >= this.abstractRoundVO.pointsNeededToWin - 1) {
            return;
        }
        this.matches[ii].score2++;
        this.save(false);
    }

    minus2(m: Match): void {
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        this.matches[ii].score2--;
        if(this.matches[ii].score2 < 0) {
            this.matches[ii].score2=0;
        }
        this.save(false);
    }

    private save(goback: boolean) {
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
                    if (goals1==this.abstractRoundVO.pointsNeededToWin && (goals1 == goals2 + 1)) {
                        this.selectedMeeting.points1 += this.abstractRoundVO.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.points2 += this.abstractRoundVO.pointsGoldenGoalTieBreakDefeat;
                    } else {
                        this.selectedMeeting.points1 += this.abstractRoundVO.matchWinnerScores;
                    }
                } else {
                    this.selectedMeeting.points1 += this.abstractRoundVO.matchWinnerScores;
                }
            } 
                        
            if (goals2 > goals1) {
                if (this.selectedTourney.tourneyType == TourneyType.Score) {
                    if (goals2==this.abstractRoundVO.pointsNeededToWin && (goals2 == goals1 + 1)) {
                        this.selectedMeeting.points2 += this.abstractRoundVO.pointsGoldenGoalTieBreakWin;
                        this.selectedMeeting.points1 += this.abstractRoundVO.pointsGoldenGoalTieBreakDefeat;
                    } else {
                        this.selectedMeeting.points2 += this.abstractRoundVO.matchWinnerScores;
                    }
                } else {
                    this.selectedMeeting.points2 += this.abstractRoundVO.matchWinnerScores;
                }
            }

            if (goals1 == goals2) {
                if (this.selectedTourney.tourneyType == TourneyType.Score ) {
                    if (goals1 != 0) {
                        this.selectedMeeting.points2 += this.abstractRoundVO.matchBalanceScores;
                        this.selectedMeeting.points1 += this.abstractRoundVO.matchBalanceScores;        
                    }
                } else {
                    this.selectedMeeting.points2 += this.abstractRoundVO.matchBalanceScores;
                    this.selectedMeeting.points1 += this.abstractRoundVO.matchBalanceScores;        
                }
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
            observer.subscribe(n => this.nextCallback(n, goback), e => this.serverUnreachableHandler(e) );      
            this.updateTourney();      
        }
    }

    private updateTourney(): void {
        console.log("Entering updateTourney()");

        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () => {});
    }

    private nextCallback(n: Meeting, goback: boolean) {   
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
        this.tourneyService.updateTourneyWithCleanAll(this.selectedTourney, () => this.reloadMeetings(goback));
    }

    private reloadMeetings(goback: boolean): void {
        if( this.selectedMeetingDb.roundId != null ) {
            this.meetingRoundService.reloadRoundMeeting(this.selectedTourney, this.selectedRound, () => this.toGoBack(goback) );
            return;
        } 
        if( this.selectedMeetingDb.playoffId != null ) {
            let p: Playoff = this.selectedTourney.playoffVO.playoffs.find( p => p.id == this.selectedMeetingDb.playoffId );
            this.meetingPlayoffService.reloadPlayoffMeetings(this.selectedTourney.id, p, () => this.toGoBack(goback), e => this.serverUnreachableHandler(e) );
            return;
        }
        if( this.selectedMeetingDb.eliminatoryId != null ) {
            this.toGoBack(goback);
        }
    }
 
    private toGoBack(goback: boolean) {
        if(goback) {
            this.goBack();
        }
    }

    saveAndGoBack( ) {
        this.save(true);
    }

    goBack() {
        this.tourneyService.loadTourneyById(this.selectedTourney.id, () =>  super.goBack(), e => this.serverUnreachableHandler(e));
    }

    onError(n:any) {
        console.log('Modifica result fallita');
    }

    refresh(): void {        
        let roundIds: number[] = [];
        for(let round of this.selectedTourney.roundVO.rounds) {
            roundIds.push(round.id);
        }
        const subsbr = this.meetingRoundService.loadRoundMeetings(this.selectedTourney.id, roundIds, e => this.serverUnreachableHandler(e));
        subsbr.subscribe(t => this.onRoundCompleteLoad(t), e => this.onError(e) );   
    }

    private onRoundCompleteLoad(t: MeetingDb[]): void {
        for(let round of this.selectedTourney.roundVO.rounds) { 
            this.meetingRoundService.extractRoundMeetings(round, t);
            let allMeetings = round.onewayMeetings.concat(round.roundtripMeetings);
            round.classification = this.tourneyService.createClassification(round, allMeetings);
        }
        this.ngOnInit();
    }
    
    /**
     * Processes the change on the number of teams for each round
     * @param cb the selected item in the combo box
     */
     onTeam1Change(cb: Combobox) {
        console.log('Entering onTeam1Change(' + cb +")");
        for(let t of this.selectedTourney.teams) {
            if(t.teamName == cb.label) {
                if( this.selectedMeetingDb.eliminatoryId != null ) {
                    for( let el of this.selectedTourney.eliminatoryLevels ) {
                        for( let e of el.eliminatories ) {
                            if( e.id == this.selectedMeetingDb.eliminatoryId ) {
                                e.round.teamNames[0] = cb.label;
                                break;
                            }
                        }
                    }
                }
                this.selectedMeeting.teamName1 = cb.label;
                this.selectedMeeting.address = t.address;
                this.selectedMeeting.country = t.country;
                break;
            }
        }
    }
    onTeam2Change(cb: Combobox) {
        console.log('Entering onTeam2Change(' + cb +")");
        for(let t of this.selectedTourney.teams) {
            if(t.teamName == cb.label) {
                if( this.selectedMeetingDb.eliminatoryId != null ) {
                    for( let el of this.selectedTourney.eliminatoryLevels ) {
                        for( let e of el.eliminatories ) {
                            if( e.id == this.selectedMeetingDb.eliminatoryId ) {
                                e.round.teamNames[1] = cb.label;
                                break;
                            }
                        }
                    }
                }
                this.selectedMeeting.teamName2 = cb.label;
                this.selectedMeeting.address = t.address;
                this.selectedMeeting.country = t.country;
                break;
            }
        }
    }
}
