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
import { LoginService } from 'app/tourneyonline/service/login-service';
import { AbstractRoundVO } from 'app/tourneyonline/domain/abstract-round-vo';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { LevelService } from '../../admin/eliminatory/level-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';

const FREEZE_RESULT_POPUP: string = "Attenzione! La conferma di tale scelta convalida definitivamente tutti i dati dell'incontro! Confermi?"
const ON_RESET_POPUP: string = "Attenzione! La conferma di tale scelta azzera tutti i dati dell'incontro! Solo l'aministratore lo può riabilitare. Confermi?"
@Component({
    templateUrl: './meeting-detailview.html',
    standalone: false
})
export class MeetingDetailView extends AbstractDetailView {
    static redirect: string = "";
    static meetingDvRedirect:   string = "result/lv/meetingLv/dv";
    
    selectedMeetingDb: MeetingDb = new MeetingDb();
    selectedMeeting: Meeting = new Meeting();

    matches: Match[] = [];

    teamPassedMessage: string = "";
    currentDay: number = 0;
    roundName: string = "";
    abstractRoundVO: AbstractRoundVO = new AbstractRoundVO();
    selectedRound: Round = new Round();
    selectedDirection: Direction = Direction.OneWay;
    allDaysNo: number = 0;
    meetingLabel: string = "";

    teamName1CB: Combobox = new Combobox();
    teamName2CB: Combobox = new Combobox();
    teams4RoundCombobox: Combobox[] = []; 
    totalScore1: number = 0;
    totalScore2: number = 0;
    teamScore1: number = 0;
    teamScore2: number = 0;
    qualifyingRounds: Round[] = [];
    roundsNotTerminated: boolean = false;

    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        public meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected levelService: LevelService,
        protected clientService: ClientService,
        public loginService: LoginService
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        super.ngOnInit();

        this.selectedMeetingDb = this.meetingService.selectedMeetingDb;   
        this.selectedMeeting = this.meetingService.selectedMeeting;   
        this.selectedMeeting.datetime = new Date(this.selectedMeeting.datetime);

        this.abstractRoundVO = this.meetingService.abstractRoundVO;
        this.selectedRound = this.meetingService.selectedRound;
        this.qualifyingRounds = this.meetingService.qualifyingRounds;
        this.roundName = this.selectedRound.name;
        this.selectedDirection = this.selectedRound.direction;
        this.meetingService.goBackFromMeeting = true;
        this.meetingLabel = this.meetingService.selectedRound.label;
        this.roundsNotTerminated = false;

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
                let m: Match = new Match();
                 m.id = i;
                this.selectedMeeting.matches.push(m);
            }
        }
        this.matches = this.selectedMeeting.matches;
        this.computeTotals();

        this.teams4RoundCombobox = [];
        for( let tn of this.selectedRound.teamNames) {
            let team = this.selectedTourney.teams.find( t => t.teamName == tn);
            if( !team ) continue;
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
        this.teamName1CB = {label: this.selectedMeeting.teamName1 == null ? "" : this.selectedMeeting.teamName1, value: -1};
        for( let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName1) {
                this.teamName1CB.value = t.id;
                break;
            }
        }
        this.teamName2CB = {label: this.selectedMeeting.teamName2 == null ? "" : this.selectedMeeting.teamName2, value: -1};
        for( let t of this.selectedTourney.teams) {
            if(t.teamName == this.selectedMeeting.teamName2) {
                this.teamName2CB.value = t.id;
                break;
            }
        }
        console.log("Exiting from MeetingDetailView.ngOnInit()");
    }

    private computeTotals() {
        this.totalScore1 = 0;
        this.totalScore2 = 0;
        this.teamScore1 = 0;
        this.teamScore2 = 0;
        for (let m of this.matches) {
            this.totalScore1 += m.score1;
            this.totalScore2 += m.score2;
            if(m.score1 ==  this.abstractRoundVO.pointsNeededToWin ) {
                this.teamScore1++;
            }
            if(m.score2 ==  this.abstractRoundVO.pointsNeededToWin ) {
                this.teamScore2++;
            }
        }
    }

    public atLeastOneMatch(): boolean {
        return this.matches.length > 1;
    }

    isAtLeastAdmin() : boolean {
        return this.loginService.isAtLeastAdmin() ? true : false;
    }
    
    disabledOperator(): boolean {
        if(this.loginService.isOperator()) {
            let un = this.loginService.userLogged.username;
            let tn = this.selectedMeeting.teamName1;
            if( !tn ) return false;
            let team = this.selectedTourney.teams.find(t => t.teamName == tn);
            if( team == undefined || team.operators == undefined) {
                return true;
            }
            let index = team.operators.indexOf(un);
            if( index == -1) {
                return true;
            }
        }
        return false;
    }

    disableButton() : boolean {
        let disOp = this.disabledOperator() ;
        let dependsOn = false;
        if( this.selectedMeetingDb.playoffId != null ) {
            if( this.selectedTourney.terminatedRounds.length == 0 ) {
                dependsOn = true;
            }
        }
        if( this.selectedMeetingDb.playoutId != null ) {
            if( this.selectedTourney.terminatedRounds.length == 0 ) {
                dependsOn = true;
            }
        }
        if( this.selectedMeetingDb.eliminatoryId != null ) {
            if( this.selectedTourney.terminatedRounds.length == 0 ) {
                dependsOn = true;
            }
        }
        return this.loginService.isFollower() 
            || this.selectedMeeting.status == MeetingStatus.Terminated 
            || this.selectedMeeting.status == MeetingStatus.Confirmed 
            || disOp 
            || dependsOn 
            ? true : false;
    }

    onResetPoundsClick() {
        console.log("Entering onResetPoundsClick()");
        if(!confirm(ON_RESET_POPUP)) {
            return;
        }

        this.selectedMeeting.points1 = 0;
        this.selectedMeeting.points2 = 0;
        this.selectedMeeting.status = MeetingStatus.ToPlay;
        for( let m of this.matches ) {
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
        this.selectedMeeting.status = MeetingStatus.Terminated;
        for(let i=0; i<this.matches.length; i++) {
            let m = this.matches[i];
            m.status = this.selectedMeeting.status;
        }
        if( this.meetingService.areAllTerminated(this.selectedTourney.roundVO.rounds) ) {
            this.refresh();
        }
        this.updateMeetingAndTourney(true);
    }

    onConfirmClick() {
        console.log("Entering onConfirmClick()");
        if(!confirm(FREEZE_RESULT_POPUP)) {
            return;
        }
        this.selectedMeeting.status = MeetingStatus.Confirmed;
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

    upper1(m: Match): void {
        this.selectedMeeting.status = MeetingStatus.InProgress;
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        if(this.matches[ii].score1 >= this.abstractRoundVO.pointsNeededToWin ) {
            return;
        }
        if(this.matches[ii].score2 >= this.abstractRoundVO.pointsNeededToWin  ) {
            this.matches[ii].score1 = this.abstractRoundVO.pointsNeededToWin - 1;
        } else {
            this.matches[ii].score1 = this.abstractRoundVO.pointsNeededToWin;
        }
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

    upper2(m: Match): void {
        this.selectedMeeting.status = MeetingStatus.InProgress;
        let ii = m.id;
        this.matches[ii].status = MeetingStatus.InProgress;
        if(this.matches[ii].score2 >= this.abstractRoundVO.pointsNeededToWin ) {
            return;
        }
        if(this.matches[ii].score1 >= this.abstractRoundVO.pointsNeededToWin ) {
            this.matches[ii].score2 = this.abstractRoundVO.pointsNeededToWin - 1;
        } else {
            this.matches[ii].score2 = this.abstractRoundVO.pointsNeededToWin;
        }
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
        this.computeTotals();
        this.selectedMeeting.points1 = 0;
        this.selectedMeeting.points2 = 0;
        let goals1 = 0;
        let goals2 = 0;

        for(let i=0; i<this.matches.length; i++) {
            let m = this.matches[i];
            m.status = this.selectedMeeting.status;
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
       
        this.updateMeetingAndTourney(goback);
    }

    private updateMeetingAndTourney(goback: boolean) {
        let observer = null;
        if (this.selectedMeetingDb.roundId != null) {
            this.tourneyService.cleanRoundMeeting(this.selectedTourney);
            observer = this.meetingService.saveRoundMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.roundId, e => this.serverUnreachableHandler(e));
        }
        if (this.selectedMeetingDb.playoffId != null) {
            this.tourneyService.cleanPlayoffMeeting(this.selectedTourney);
            observer = this.meetingService.savePlayoffMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.playoffId, e => this.serverUnreachableHandler(e));
        }
        if (this.selectedMeetingDb.playoutId != null) {
            this.tourneyService.cleanPlayoutMeeting(this.selectedTourney);
            observer = this.meetingService.savePlayoutMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.playoutId, e => this.serverUnreachableHandler(e));
        }
        if (this.selectedMeetingDb.eliminatoryId != null) {
            this.tourneyService.cleanEliminatoryMeeting(this.selectedTourney);
            observer = this.meetingService.saveEliminatoryMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.eliminatoryId, e => this.serverUnreachableHandler(e));
        }
        if (this.selectedMeetingDb.eliminatoryBId != null) {
            this.tourneyService.cleanEliminatoryBMeeting(this.selectedTourney);
            observer = this.meetingService.saveEliminatoryBMeetingDb(this.selectedMeeting, this.selectedTourney.id, this.selectedMeetingDb.eliminatoryBId, e => this.serverUnreachableHandler(e));
        } this.serverUnreachable = false;
        if (observer != null) {
            observer.subscribe(m => this.saveMeetingNextCallback(m, goback), e => this.serverUnreachableHandler(e));
        }
    }

    private saveMeetingNextCallback(m: MeetingDb, goback: boolean) {   
        console.log("Entering saveMeetingNextCallback("+m+")");  
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
            this.meetingRoundService.reloadRoundMeeting(this.selectedTourney, this.selectedRound, () => this.updateTourney(goback) );
        } else
        if( this.selectedMeetingDb.playoffId != null ) {
            let p = this.selectedTourney.playoffVO.playoffs.find( p => p.id == this.selectedMeetingDb.playoffId );
            if( p )
                this.meetingPlayoffService.reloadPlayoffMeetings(this.selectedTourney.id, p, () => this.updateTourney(goback), e => this.serverUnreachableHandler(e) );
        } else
        if( this.selectedMeetingDb.playoutId != null ) {
            let p = this.selectedTourney.playoutVO.playoffs.find( p => p.id == this.selectedMeetingDb.playoutId );
            if( p )
                this.meetingPlayoffService.reloadPlayoutMeetings(this.selectedTourney.id, p, () => this.updateTourney(goback), e => this.serverUnreachableHandler(e) );
            return;
        }
        if( this.selectedMeetingDb.eliminatoryId != null ) {
            this.updateTourney(goback);
        }
        if( this.selectedMeetingDb.eliminatoryBId != null ) {
            this.updateTourney(goback);
        }
    }
    
    private updateTourney(goback: boolean): void {
        console.log("Entering updateTourney()");

        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.toGoBack(goback), e => this.subscribeErrorHandler(e), () => {});
    }
 
    private toGoBack(goback: boolean) {
        if(goback) {
            this.goBack();
        }
    }

    saveAndGoBack( ) {
        this.save(true);
    }

    override goBack() {
        this.tourneyService.loadTourneyById(this.selectedTourney.id, () =>  super.goBack(), e => this.serverUnreachableHandler(e));
    }

    override onError(n:any) {
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
            this.tourneyService.createClassification(round, true);
        }
        this.ngOnInit();
    }
    
    /**
     * Processes the change on the number of teams for each round
     * @param cb the selected item in the combo box
     */
     onTeam1Change(cb: Combobox) {
        console.log('Entering onTeam1Change(' + cb +")");
        let terminated = this.meetingService.areAllTerminated(this.qualifyingRounds);
        this.roundsNotTerminated = false;
        if( !terminated ) {
            this.roundsNotTerminated = true;
            return;
        }
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
        let terminated = this.meetingService.areAllTerminated(this.qualifyingRounds);
        this.roundsNotTerminated = false;
        if( !terminated ) {
            this.roundsNotTerminated = true;
            return;
        }
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
