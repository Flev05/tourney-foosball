import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { AbstractEliminatoryListView } from './abstract-eliminatory-listview';
import { LevelService } from '../admin/eliminatory/level-service';
import { DateFormatPipe } from './date-format-pipe';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Injectable } from '@angular/core';
import { Match } from '../../domain/match';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
 
@Injectable()
export abstract class AbstractResultEliminatoryListView extends AbstractEliminatoryListView {
    cols: TableCols[] ;
    pageSize: number = 10;
    classificationCols: TableCols[];
    eliminatoryClassification: any[];

    selectedRow: Meeting;
    onewayMeetings: Meeting[];
    roundtripMeetings: Meeting[];
    isRoundTrip: boolean = false;
    selectedClassificationRow: Classification;
    isLevelB: boolean = false;

    constructor(
        public redirect: string,
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected levelService: LevelService,
        protected clientService: ClientService,
        protected router: Router,
        protected location: Location,
        public dfp: DateFormatPipe
    ) {
        super(redirect, tourneyService, meetingService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
        this.classificationCols = this.tourneyService.classificationCols;
        this.isRoundTrip = this.isOneway == "true" ? false : true;
    }
    
    refresh(): void {        
        this.ngOnInit(); 
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab("+index+")");
        // this.tourneyService.selectedEliminatoryTabIndex = index;
        // this.tourneyService.updateEliminatoryLevelsAndGui(this.eliminatoryLevels);
        // this.prepareEliminatoryGuiLevels(this.eliminatoryLevels, this.selectedEliminatoryLevelIndex);
    }

    protected onLoadComplete(eliminatoryLevels : Array<EliminatoryLevel>, isLevelB : boolean): void {
        this.cols = this.tourneyService.resultCols;

        this.eliminatoryLevels = eliminatoryLevels;
        this.isLevelB = isLevelB;
        
        for( let l=0; l < this.eliminatoryLevels.length; l++ ) {
            let el = eliminatoryLevels[l];
            if( this.isStandAlone(this.selectedTourney) ) {
                if( el.isTopLevel ) {
                    this.resolveStandaloneTopLevel(el);
                } else {
                    this.compileNextLevel(this.eliminatoryLevels, l, el);
                }
            } else {
                if( el.isTopLevel ) {
                    this.resolveNotStandaloneTopLevelRules( el );
                } else {
                    this.compileNextLevel(this.eliminatoryLevels, l,  el);
                }
            }
        }

        this.tourneyService.updateEliminatoryLevelsAndGui(this.eliminatoryLevels);
        this.prepareEliminatoryGuiLevels(this.eliminatoryLevels);
    }

    private prepareEliminatoryGuiLevels(eliminatoryLevels: EliminatoryLevel[] ) {
        this.onewayMeetings = [];
        this.roundtripMeetings = [];
        this.eliminatoryClassification = [];

        let levelIndex = this.tourneyService.selectedEliminatoryLevelIndex;
        if( levelIndex == -1 ) {
            levelIndex = this.tourneyService.selectedEliminatoryBLevelIndex;
        }
        let sel = eliminatoryLevels[levelIndex];

        for (let level = 0; level < sel.eliminatories.length; level++) {
            let e = sel.eliminatories[level];
            e.round.onewayMeetings.forEach(m => m.containerId = e.id);
            this.onewayMeetings = this.onewayMeetings.concat(e.round.onewayMeetings);

            e.round.roundtripMeetings.forEach(m => m.containerId = e.id);
            this.roundtripMeetings = this.roundtripMeetings.concat(e.round.roundtripMeetings);
            const newLocal = this.tourneyService.prepareRoundsGui(sel.abstractRoundVO.maxMatchesPerMeeting, [e.round]);
            this.eliminatoryClassification = this.eliminatoryClassification.concat(newLocal);
        }
        console.log("OnewayMeetings.len    [" + this.onewayMeetings.length + "]");
        console.log("RoundtripMeetings.len [" + this.roundtripMeetings.length + "]");
    }

    private resolveStandaloneTopLevel(el: EliminatoryLevel) {
        for (let e of el.eliminatories) {
            for (let m of e.round.onewayMeetings) {
                if (m.teamName1 == "") {
                    m.points1 = 0;
                    m.points2 = el.abstractRoundVO.matchWinnerScores;
                }
                if (m.teamName2 == "") {
                    m.points1 = el.abstractRoundVO.matchWinnerScores;
                    m.points2 = 0;
                }
                m.vpoints1 = m.matches.length==1 ? m.matches[0].score1 : m.points1;
                m.vpoints2 = m.matches.length==1 ? m.matches[0].score2 : m.points2;        
            }
            for (let m of e.round.roundtripMeetings) {
                if (m.teamName1 == "") {
                    m.points1 = 0;
                    m.points2 = el.abstractRoundVO.matchWinnerScores;
                }
                if (m.teamName2 == "") {
                    m.points1 = el.abstractRoundVO.matchWinnerScores;
                    m.points2 = 0;
                }
                m.vpoints1 = m.matches.length==1 ? m.matches[0].score1 : m.points1;
                m.vpoints2 = m.matches.length==1 ? m.matches[0].score2 : m.points2;
            }
        }
    }

    /**
     * Resolves the rules, not stand alone, defined in the Round or Playoff classifications
     * to create the top level elimination meetings.
     * If are defined the playoff, the resolution uese the round in playoffs, else uses the rounds of the tourney.
     */
    private resolveNotStandaloneTopLevelRules(topEl : EliminatoryLevel ): void {
        console.log("Entering resolveNotStandaloneTopLevelRules(" + topEl.level +")");
        if(!this.selectedTourney.isEliminatoryAutoGen) {
            for(let e of topEl.eliminatories ) {
                this.resolveToplevelManual(topEl, e);
            }
            return;
        }

        let rounds: Array<Round>;
        if( this.isPlayoff ) {
            rounds = this.tourneyService.cloneRounds(this.selectedTourney.playoffVO.playoffs.map((p) => {return p.round;}));
        } else {
            rounds = this.tourneyService.cloneRounds(this.selectedTourney.roundVO.rounds);
        }

        this.meetingService.qualifyingRounds = rounds;
        let roundMatrix : Array<Array<Classification>> = this.tourneyService.createBestGlobalClassificationMatrix(rounds);
        if(this.isLevelB) {
            roundMatrix = this.tourneyService.shiftLevelBMatrix(roundMatrix, this.selectedTourney.selectedEliminatoryTeamsCB.value);
        }

        let sortedGlobalClassification : Array<Classification> = this.tourneyService.sortedGlobalClassification( roundMatrix, topEl.eliminatories.length*2);

        let sortedEliminatories: Eliminatory[] = [];
        let alreadyInTheBigTableList : Array<Classification> = [];
        for(let i=0; i<topEl.eliminatories.length; i++ ) {
            let c: Classification = sortedGlobalClassification[i];
            let e = topEl.eliminatories[i];
            
            let ne = this.compileEliminatory(topEl 
                , e
                , c
                , sortedGlobalClassification
                , rounds
                , alreadyInTheBigTableList );

            sortedEliminatories.push(ne);
            alreadyInTheBigTableList = alreadyInTheBigTableList.concat(ne.round.classification);
        }

        for( let i=0; i<sortedEliminatories.length; i++ ) {
            let e = sortedEliminatories[i];
            let r = e.round;
            let om = r.onewayMeetings[0];
            let rm = r.roundtripMeetings[0];
            console.log("P: "+ i + ", e.id: "+ e.id + ", r.id: " + r.id + ", OM.ontainerId: " 
                + om.containerId + ", RM.ontainerId: " + rm.containerId 
                + ", OM.status="+om.status
                + ", OM.datetime: " +  om.datetime  
                + ", RM.status="+rm.status
                + ", RM.datetime: " +  rm.datetime  
                + ", T: " +  r.teamNames  
            );
        }
 
        this.placeOnTwoBigTables(topEl, sortedEliminatories);
    }

    /**
     * Create a new Eliminatory in function of: the received Classification, the rounds
     * and the list of classification teams to remove because already placed in the 2 Big Tables.
     * It also checks the teams in the rounds to remove the teams played in same round.
     * 
     * The remaining sorted list is used to peekup the last Classification team as second team in the Eliminatory
     * The first team, in the new Eliminatory, is the one in the received Classification, 
     * the second is the last in the final purged List 
     * 
     * @param e the selected Eliminatory and sortedGlobalClassification
     * @param c the selected Classification
     * @param sortedGlobalClassification the original full sorted Classification list
     * @param rounds contains the team Classification to remove from the sortedGlobalClassification
     * @param alreadyInTheBigTableList the list of the teams already put in the 2 Big Tables
     * @param matchWinnerScores the scores to win the match
     */
    private compileEliminatory( topEl : EliminatoryLevel 
        , e: Eliminatory
        , c: Classification
        , sortedGlobalClassification: Classification[]
        , rounds: Round[]
        , alreadyInTheBigTableList : Array<Classification> ) : Eliminatory
    {
        let purgedSortedList : Classification[]  = [];
        let eliminatories : Eliminatory[] = topEl.eliminatories;
        let pointsNeededToWin: number = topEl.abstractRoundVO.pointsNeededToWin;
        let teamNamesInTheSameRound = [];
        if( rounds.length > 1 ) {
            for( let r of rounds ) {
                let rt = r.teamNames.find( e => e === c.teamName);
                if( rt != undefined ) {
                    teamNamesInTheSameRound = r.teamNames;
                    break;
                }
            }
        }

        let toRemoveList : Classification[]  = alreadyInTheBigTableList;
        for( let tn of teamNamesInTheSameRound ) {
            let intersectionList = sortedGlobalClassification.filter( e => e.teamName === tn );
            toRemoveList = toRemoveList.concat(intersectionList);
        }
        purgedSortedList = sortedGlobalClassification.filter(
            (item) => !toRemoveList.some((e) => e.teamName === item.teamName)
        );
 
        let teamName1 = c.teamName;
        const c2 = purgedSortedList[purgedSortedList.length - 1];
        let teamName2 = c2.teamName;

        // let ne = eliminatories.find(e => e.round.teamNames[0] === teamName1 && e.round.teamNames[1] === teamName2);
        // if( ne == undefined ) {
        //     ne = this.resetEliminatory(e, teamName1, teamName2);
        // }
        let ne = this.resetEliminatory(e, teamName1, teamName2);
        
        // let ne = this.cloneEliminatory(e);
        let r = ne.round;
        // r.teamNames[0] = teamName1;
        // r.teamNames[1] = teamName2;

        const om = r.onewayMeetings[0];
        // om.containerId = r.id;
        // om.teamName1 = teamName1;
        // om.teamName2 = teamName2;
        // om.name = om.teamName1 + " - " + om.teamName2;

        const rm = r.roundtripMeetings[0];
        // rm.containerId = r.id;
        // rm.teamName1 = teamName2;
        // rm.teamName2 = teamName1;
        // rm.name = rm.teamName1 + " - " + rm.teamName2;

        let ene = eliminatories.find(e => e.round.teamNames[0] === teamName1 && e.round.teamNames[1] === teamName2);
        if( ene != undefined ) {
            om.matches = [...ene.round.onewayMeetings[0].matches];
            om.status = ene.round.onewayMeetings[0].status;
            om.datetime = ene.round.onewayMeetings[0].datetime;
            rm.matches = [...ene.round.roundtripMeetings[0].matches];
            rm.status = ene.round.roundtripMeetings[0].status;
            rm.datetime = ene.round.roundtripMeetings[0].datetime;
        }

        if( c2.points < 0 ) {
            let matchWinnerScores: number = topEl.abstractRoundVO.matchWinnerScores;
            ne.round.classification[0].points = matchWinnerScores;
            ne.round.classification[1].points = 0;
            om.isSkiping = false;
            om.isDummy = true;
            om.status = MeetingStatus.Terminated;
            om.points1 = pointsNeededToWin;
            om.points2 = 0;
            om.matches[0].score1 = pointsNeededToWin;
            om.matches[0].score2 = 0;

            rm.isSkiping = false;
            rm.isDummy = true;
            rm.status = MeetingStatus.Terminated;
            rm.points1 = 0;
            rm.points2 = pointsNeededToWin;
            rm.matches[0].score1 = 0;
            rm.matches[0].score2 = pointsNeededToWin;
        } else {
            // let nne = eliminatories.find(e => e.round.teamNames[0] === teamName1 && e.round.teamNames[1] === teamName2);
            // const previousOm = e.round.onewayMeetings[0];
            // if( nne == undefined && previousOm.isDummy ) {
            //     // ne = this.resetEliminatory(e, teamName1, teamName2);
            //     ne.round.classification[0].points = 0;
            //     ne.round.classification[1].points = 0;
            //     om.isSkiping = false;
            //     om.isDummy = false;
            //     om.status = MeetingStatus.ToPlay;
            //     om.points1 = 0;
            //     om.points2 = 0;
            //     om.matches[0].score1 = 0;
            //     om.matches[0].score2 = 0;
            //     rm.isSkiping = false;
            //     rm.isDummy = false;
            //     rm.status = MeetingStatus.ToPlay;
            //     rm.points1 = 0;
            //     rm.points2 = 0;
            //     rm.matches[0].score1 = 0;
            //     rm.matches[0].score2 = 0;
            // }    
        }

        om.vpoints1 = om.matches.length==1 ? om.matches[0].score1 : om.points1;
        om.vpoints2 = om.matches.length==1 ? om.matches[0].score2 : om.points2;
        rm.vpoints1 = rm.matches.length==1 ? rm.matches[0].score1 : rm.points1;
        rm.vpoints2 = rm.matches.length==1 ? rm.matches[0].score2 : rm.points2;

        this.tourneyService.createClassification(ne.round, false);

        return ne;
    }

    private resetEliminatory(e: Eliminatory, teamName1 : string, teamName2 : string): Eliminatory {
        let ne = this.cloneEliminatory(e);
        let r = ne.round;
        r.teamNames[0] = teamName1;
        r.teamNames[1] = teamName2;
        r.classification[0] = this.tourneyService.newClassification(teamName1, 0);
        r.classification[1] = this.tourneyService.newClassification(teamName2, 0);
        const om = ne.round.onewayMeetings[0];
        om.points1 = 0;
        om.vpoints1 = 0;
        om.points2 = 0;
        om.vpoints2 = 0;
        om.isDummy = false;
        om.status = MeetingStatus.ToPlay;
        om.teamName1 = teamName1;
        om.teamName2 = teamName2;
        om.name = om.teamName1 + " - " + om.teamName2;
        for( let i=0;i<om.matches.length; i++ ) {
            om.matches[i].score1 = 0;
            om.matches[i].score2 = 0;
        }

        const rm = ne.round.roundtripMeetings[0];
        rm.points1 = 0;
        rm.vpoints1 = 0;
        rm.points2 = 0;
        rm.vpoints2 = 0;
        rm.isDummy = false;
        rm.status = MeetingStatus.ToPlay;
        rm.teamName1 = teamName2;
        rm.teamName2 = teamName1;
        rm.name = rm.teamName1 + " - " + rm.teamName2;
        for( let i=0;i<rm.matches.length; i++ ) {
            rm.matches[i].score1 = 0;
            rm.matches[i].score2 = 0;
        }
         
        return ne;
    }

    /**
     * Creates the 2 big tables in the topEliminatoryLevel from the received sortedEliminatories list.
     * The 4 first position are built from the 4 first position of the sortedEliminatories.
     * The remaining positions are built starting from the last postions of the sortedEliminatories
     * down to the 5° position.
     * 
     * @param topEl the top ElementaryLevel to organize as a two big tables
     * @param sortedEliminatories the sorted Eliminatory list from which take the team couples 
     */
    private placeOnTwoBigTables(topEl: EliminatoryLevel, sortedEliminatories : Eliminatory[] ) {
        console.log("Entering placeOnTwoBigTables()");

        let p1: number = 0;
        let p2: number = topEl.eliminatories.length / 2;
        let p3: number = topEl.eliminatories.length - 1;
        let p4: number = p2 - 1;
        
        let p : number=0;
        let li = sortedEliminatories.length - 1;
        for( let i=0; i<topEl.eliminatories.length; i++ ) {
            if( i % 4 == 0 ) {
                p = p1++;
            }
            if( i % 4 == 1 ) {
                p = p2++;
            }
            if( i % 4 == 2 ) {
                p = p3--;
            }
            if( i % 4 == 3 ) {
                p = p4--;
            }
            if( i < 4 ) {
                topEl.eliminatories[p] = sortedEliminatories[i];
            } else {
                topEl.eliminatories[p] = sortedEliminatories[li--];
            }
            const e = topEl.eliminatories[p];
            for(let m of e.round.onewayMeetings ) {
                this.saveMeeting(e, m);
            }
            for(let m of e.round.roundtripMeetings ) {
                this.saveMeeting(e, m);
            }
        }       
        this.updateTourney();
    }

    private updateTourney( ): void {
        console.log("Entering updateTourney()");
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => {}, e => this.subscribeErrorHandler(e), () => {});
    }
    
    private saveMeeting(e : Eliminatory, m: Meeting) {
        let observer = null;
        const eliminatoryId = this.meetingService.selectedMeetingDb.eliminatoryId;
        if (eliminatoryId != null) {
            // this.tourneyService.cleanEliminatoryMeeting(this.selectedTourney);
            observer = this.meetingService.saveEliminatoryMeetingDb(m, this.selectedTourney.id, e.id, e => this.serverUnreachableHandler(e));
        }
        const eliminatoryBId = this.meetingService.selectedMeetingDb.eliminatoryBId;
        if (eliminatoryBId != null) {
            // this.tourneyService.cleanEliminatoryBMeeting(this.selectedTourney);
            observer = this.meetingService.saveEliminatoryBMeetingDb(m, this.selectedTourney.id, e.id, e => this.serverUnreachableHandler(e));
        } 
        this.serverUnreachable = false;
        if (observer != null) {
            observer.subscribe(m => this.saveMeetingNextCallback(m), e => this.serverUnreachableHandler(e));
        }
    }
    
    private saveMeetingNextCallback(m: Meeting ) {   
        // this.updateTourney();
    }
  
    private cloneEliminatory(e: Eliminatory): Eliminatory {
        let ne : Eliminatory = new Eliminatory();
        ne.id = e.id;
        ne.isSkiping = e.isSkiping;
        ne.round = this.tourneyService.cloneRound(e.round);
        ne.rule1 = e.rule1;
        ne.rule2 = e.rule2;
        return ne;
    }

    /**
     * Resolves the rules related to the eliminatories configurated in manual mode.
     * In function of the classification reached in the previous rounds or playoffs, the method
     * finds the teams that gained the right for the direct eliminations
     */
    private resolveToplevelManual(el : EliminatoryLevel, e: Eliminatory) {
        let fr1 = e.rule1.fromRound;
        let fp1 = e.rule1.fromPlayoff;
                   
        let pr1 = fr1.position.value;
        let pp1 = fp1.position.value;
        if( (pr1 <= 0 && pp1 <= 0) || (fr1.round.value <= 0 && fp1.round.value <= 0)) {
            return;
        }

        let fr2 = e.rule2.fromRound;
        let fp2 = e.rule2.fromPlayoff;
        let pr2 = fr2.position.value;
        let pp2 = fp2.position.value;

        if( (pr2 <= 0 && pp2 <= 0) || (fr2.round.value <= 0 && fp2.round.value <= 0)) {
            return;
        }

        let m1 = e.round.onewayMeetings[0];
        let m2 = e.round.roundtripMeetings[0];

        if(pr1 > 0 && fr1.round.value > 0) {
            let roundName = fr1.round.label;
            for(let r of this.selectedTourney.roundVO.rounds) {
                if(r.name == roundName) {
                    let teamName = r.classification[pr1-1].teamName;
                    m1.teamName1 = teamName;
                    break;
                }
            }
        } else {
            let roundName = fp1.round.label;
            for(let p of this.selectedTourney.playoffVO.playoffs) {
                if(p.round.name == roundName) {
                    let teamName = p.round.classification[pp1-1].teamName;
                    m1.teamName1 = teamName;
                    break;
                }
            }
        }
        
        if(pr2 > 0 && fr2.round.value > 0) {
            let roundName = fr2.round.label;
            for(let r of this.selectedTourney.roundVO.rounds) {
                if(r.name == roundName) {
                    let teamName = r.classification[pr2-1].teamName;
                    m1.teamName2 = teamName;
                    break;
                }
            }
        } else {
            let roundName = fp2.round.label;
            for(let p of this.selectedTourney.playoffVO.playoffs) {
                if(p.round.name == roundName) {
                    let teamName = p.round.classification[pp2-1].teamName;
                    m1.teamName2 = teamName;
                    break;
                }
            }
        }

        e.round.teamNames[0] = m1.teamName1;
        e.round.teamNames[1] = m1.teamName2;
        m2.teamName1 = m1.teamName2;
        m2.teamName2 = m1.teamName1;
        if( m1.teamName1 == "" ) {
            m1.points1 = 0;
            m1.points2 = el.abstractRoundVO.matchWinnerScores;
        }
        if( m1.teamName2 == "" ) {
            m1.points1 = el.abstractRoundVO.matchWinnerScores;
            m1.points2 = 0;
        }

        if( m2.teamName1 == "" ) {
            m2.points1 = 0;
            m2.points2 = el.abstractRoundVO.matchWinnerScores;
        }
        if( m2.teamName2 == "" ) {
            m2.points1 = el.abstractRoundVO.matchWinnerScores;
            m2.points2 = 0;
        }
        m1.vpoints1 = m1.matches.length==1 ? m1.matches[0].score1 : m1.points1;
        m1.vpoints2 = m1.matches.length==1 ? m1.matches[0].score2 : m1.points2;

        m2.vpoints1 = m2.matches.length==1 ? m2.matches[0].score1 : m2.points1;
        m2.vpoints2 = m2.matches.length==1 ? m2.matches[0].score2 : m2.points2;
    }

    /**
     * Updates the next lower level in function of the default position found in received current level
     * 
     * @param eliminatoryLevels the list of eliminatory levels
     * @param l  the current eliminatory level index
     * @param el the current eliminatory object to compile
     */
    private compileNextLevel(eliminatoryLevels: Array<EliminatoryLevel>, l: number,  el: EliminatoryLevel) {

        if(this.isLevelB) {
            this.meetingService.qualifyingRounds = [];
        }
        if(el.isOptional) { // for 3° and 4° classification position
            this.compile3And4Position(el, l, eliminatoryLevels);
            return;
        }

        let prevIndex: number = l-1;
        let previousEliminatoryLevel: Array<Eliminatory> = new Array<Eliminatory>();
        for( let e of eliminatoryLevels[prevIndex].eliminatories ) {
            previousEliminatoryLevel.push(e);
            if(this.isLevelB) {
                this.meetingService.qualifyingRounds.push(e.round);
            }
        }
 
        let previousEliminatoryIndex : number = 0;
        for(let p=0; p<el.eliminatories.length; p++  ) {
            let e = el.eliminatories[p];
 
            let team1: string = e.round.onewayMeetings[0].teamName1;
            let team2: string = e.round.onewayMeetings[0].teamName2;

            let prevEliminatory1 : Eliminatory = previousEliminatoryLevel[previousEliminatoryIndex];
            team1 = this.fromClassification(prevEliminatory1, 0);
            let prevEliminatory2 : Eliminatory = previousEliminatoryLevel[previousEliminatoryIndex + 1];
            team2 = this.fromClassification(prevEliminatory2, 0);
            e.round.teamNames = [team1, team2];
            
            e.round.classification[0].teamName = team1;
            e.round.classification[1].teamName = team2;

            e.round.onewayMeetings[0].teamName1 = team1;
            e.round.onewayMeetings[0].teamName2 = team2;
            e.round.onewayMeetings[0].name = team1 + " - " + team2;
            
            e.round.roundtripMeetings[0].teamName1 = team2;
            e.round.roundtripMeetings[0].teamName2 = team1;
            e.round.roundtripMeetings[0].name = team2 + " - " + team1;

            let m = e.round.onewayMeetings[0];
            m.vpoints1 = m.matches.length == 1 ? m.matches[0].score1 : m.points1;
            m.vpoints2 = m.matches.length == 1 ? m.matches[0].score2 : m.points2;

            m = e.round.roundtripMeetings[0];
            m.vpoints1 = m.matches.length == 1 ? m.matches[0].score1 : m.points1;
            m.vpoints2 = m.matches.length == 1 ? m.matches[0].score2 : m.points2;

            previousEliminatoryIndex += 2;
            
            this.tourneyService.createClassification(e.round, false);
        }
    }
    
    private compile3And4Position(el: EliminatoryLevel, l: number, eliminatoryLevels: EliminatoryLevel[]) {
        let e = el.eliminatories[0];

        let prevIndex: number = l - 2;
        let semifinalLevel: Array<Eliminatory> = new Array<Eliminatory>();
        for (let e of eliminatoryLevels[prevIndex].eliminatories) {
            semifinalLevel.push(e);
            if (this.isLevelB) {
                this.meetingService.qualifyingRounds.push(e.round);
            }
        }

        let team1: string = e.round.onewayMeetings[0].teamName1;
        let team2: string = e.round.onewayMeetings[0].teamName2;

        let prevEliminatory1: Eliminatory = semifinalLevel[0];
        team1 = this.fromClassification(prevEliminatory1, 1);
        let prevEliminatory2: Eliminatory = semifinalLevel[1];
        team2 = this.fromClassification(prevEliminatory2, 1);
        e.round.teamNames = [team1, team2];
        
        e.round.classification[0].teamName = team1;
        e.round.classification[1].teamName = team2;

        e.round.onewayMeetings[0].teamName1 = team1;
        e.round.onewayMeetings[0].teamName2 = team2;
        e.round.onewayMeetings[0].name = team1 + " - " + team2;

        e.round.roundtripMeetings[0].teamName1 = team2;
        e.round.roundtripMeetings[0].teamName2 = team1;
        e.round.roundtripMeetings[0].name = team2 + " - " + team1;

        let m = e.round.onewayMeetings[0];
        m.vpoints1 = m.matches.length == 1 ? m.matches[0].score1 : m.points1;
        m.vpoints2 = m.matches.length == 1 ? m.matches[0].score2 : m.points2;

        m = e.round.roundtripMeetings[0];
        m.vpoints1 = m.matches.length == 1 ? m.matches[0].score1 : m.points1;
        m.vpoints2 = m.matches.length == 1 ? m.matches[0].score2 : m.points2;
    }

    private fromClassification(e: Eliminatory, position: number): string {
        console.info("Entering fromClassification("+position+")");
        return e.round.classification[position].teamName;        
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect("+event+")");

        this.meetingService.selectedMeeting = this.selectedRow;
        
        if( this.selectedRow.teamName2.includes('Fittizio') ) {
            return;
        }
        if(this.tourneyService.selectedEliminatoryLevelIndex==-1) {
            this.meetingService.selectedMeetingDb.eliminatoryBId = this.selectedRow.containerId;
        } else {
            this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedRow.containerId
        }

        let el : Eliminatory  = this.eliminatories.find(e => e.round.teamNames[0] === this.selectedRow.teamName1 && e.round.teamNames[1] === this.selectedRow.teamName2);
        // let el : Eliminatory  = this.eliminatories.find( e => e.id == this.selectedRow.containerId );
        this.meetingService.selectedRound = el.round;

        this.meetingService.selectedRound.label = this.makeEliminatoryLabel();

        this.gotoDetailView();
    }

    protected makeEliminatoryLabel() : string {
        let mm = this.tourneyService.selectedEliminatoryTabIndex == 0 ? "Andata" : "Ritorno";
        return this.tourneyService.selectedEliminatoryLevel.name + "(" + this.meetingService.selectedRound.name + ") - " + mm;
    }
}

