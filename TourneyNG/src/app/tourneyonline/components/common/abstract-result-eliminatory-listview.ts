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
import { Direction, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Injectable } from '@angular/core';
import { Match } from '../../domain/match';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
 
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
    selectedEliminatoryLevelIndex: number;

    constructor(
        public redirect: string,
        public tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected levelService: LevelService,
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

    protected onLoadComplete(eliminatoryLevels : Array<EliminatoryLevel>, selectedEliminatoryLevelIndex : number): void {
        this.cols = this.tourneyService.resultCols;

        this.eliminatoryLevels = eliminatoryLevels;
        this.selectedEliminatoryLevelIndex = selectedEliminatoryLevelIndex;
        
        for( let l=0; l < eliminatoryLevels.length; l++ ) {
            let el = eliminatoryLevels[l];
            if( this.isStandAlone(this.selectedTourney) ) {
                if( el.isTopLevel ) {
                    this.resolveStandaloneTopLevel(el);
                } else {
                    this.resolveNextLevel(this.eliminatoryLevels, l, selectedEliminatoryLevelIndex, el);
                }
            } else {
                if( el.isTopLevel ) {
                    this.resolveNotStandaloneTopLevelRules( el );
                } else {
                    this.resolveNextLevel(this.eliminatoryLevels, l, selectedEliminatoryLevelIndex, el);
                }
            }
        }

        this.tourneyService.updateEliminatoryLevelsAndGui(this.eliminatoryLevels);
        this.prepareEliminatoryGuiLevels(this.eliminatoryLevels, selectedEliminatoryLevelIndex);
    }

    private prepareEliminatoryGuiLevels(eliminatoryLevels: EliminatoryLevel[], selectedEliminatoryLevelIndex: number) {
        this.onewayMeetings = [];
        this.roundtripMeetings = [];
        this.eliminatoryClassification = [];

        let sel = eliminatoryLevels[selectedEliminatoryLevelIndex];

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
            rounds = this.cloneRounds(this.selectedTourney.playoffVO.playoffs.map((p) => {return p.round;}));
        } else {
            rounds = this.cloneRounds(this.selectedTourney.roundVO.rounds);
        }

        this.meetingService.qualifyingRounds = rounds;
        let roundMatrix : Array<Array<Classification>> = this.meetingService.createBestGlobalClassificationMatrix(rounds);        
        let sortedGlobalClassification : Array<Classification> = this.meetingService.sortedGlobalClassification( roundMatrix, topEl.eliminatories.length*2);
 
        let inTheBigTableList : Array<Classification> = [];
        for(let i=0; i<topEl.eliminatories.length; i++ ) {
            let e : Eliminatory = topEl.eliminatories[i];
            let c: Classification = sortedGlobalClassification[i];
            this.compileEliminatory(e
                , c
                , sortedGlobalClassification
                , rounds
                , inTheBigTableList
                , topEl.abstractRoundVO.matchWinnerScores);
            inTheBigTableList = inTheBigTableList.concat(e.round.classification);
        }

        let clonedEliminatories: Eliminatory[] = this.cloneEliminatories(topEl);
        this.placeOnTwoBigTables(topEl, clonedEliminatories);
    }

    /**
     * Compiles the received Eliminatory parameter in function of the received Classification, the rounds
     * and the list of classification teams to remove because already placed in the 2 Big Tables.
     * It places the received Classification as the first team in the Eliminatory. Then
     * it also checks the teams in the rounds to remove the teams in some round as c.teamName.
     * The remaining sorted list is used to peekup the last Classification team as second team in the Eliminatory
     * 
     * @param i the same index in the topEl.eliminatories and sortedGlobalClassification
     * @param topEl the top level eliminatory to compile
     * @param sortedGlobalClassification the original full sorted Classification list
     * @param rounds contains the team Classification to remove from the sortedGlobalClassification
     * @param inTheBigTableList the list of the teams already put in the 2 Big Tables
     * @param matchWinnerScores the scores to win the match
     */
    private compileEliminatory(e : Eliminatory
        , c: Classification
        , sortedGlobalClassification: Classification[]
        , rounds: Round[]
        , inTheBigTableList : Array<Classification>
        , matchWinnerScores: number)  
    {

        let finalSortedList : Classification[]  = [];

        let teamNamesInTheSameRound = [];
        for( let r of rounds ) {
            let rt = r.teamNames.find( e => e === c.teamName);
            if( rt != undefined ) {
                teamNamesInTheSameRound = r.teamNames;
                break;
            }
        }

        let toRemoveList : Classification[]  = inTheBigTableList;
        for( let tn of teamNamesInTheSameRound ) {
            let intersectionList = sortedGlobalClassification.filter( e => e.teamName === tn );
            toRemoveList = toRemoveList.concat(intersectionList);
        }
        finalSortedList = sortedGlobalClassification.filter(
            (item) => !toRemoveList.some((e) => e.teamName === item.teamName)
        );
 
        let teamName1 = c.teamName;
        const c2 = finalSortedList[finalSortedList.length - 1];
        let teamName2 = c2.teamName;

        e.round.teamNames = [teamName1, teamName2];
        e.round.classification[0].teamName = teamName1;
        e.round.classification[0].played = 0;
        e.round.classification[1].teamName = teamName2;
        e.round.classification[1].played = 0;

        let om = e.round.onewayMeetings[0];
        om.teamName1 = teamName1;
        om.teamName2 = teamName2;
        om.name = om.teamName1 + " - " + om.teamName2;

        let rm = e.round.roundtripMeetings[0];
        rm.teamName1 = om.teamName2;
        rm.teamName2 = om.teamName1;
        rm.name = rm.teamName1 + " - " + rm.teamName2;
        if( c2.points < 0 ) {
            e.isSkiping = true;
            om.isSkiping = true;
            om.status = MeetingStatus.Terminated;
            om.points1 = matchWinnerScores;
            om.points2 = 0;
            rm.isSkiping = true;
            rm.status = MeetingStatus.Terminated;
            rm.points1 = 0;
            rm.points2 = matchWinnerScores;
        }
        om.vpoints1 = om.matches.length==1 ? om.matches[0].score1 : om.points1;
        om.vpoints2 = om.matches.length==1 ? om.matches[0].score2 : om.points2;
        rm.vpoints1 = rm.matches.length==1 ? rm.matches[0].score1 : rm.points1;
        rm.vpoints2 = rm.matches.length==1 ? rm.matches[0].score2 : rm.points2;
    }

    /**
     * Creates the 2 big tables in the topEliminatory from the received clonedEliminatories list.
     * The 4 first position are built from the 4 first position of the sortedEliminatories.
     * The remaining positions are built starting from the last postions of the sortedEliminatories
     * down to the 5° position.
     * 
     * @param topEliminatory the top ElementaryLevel to organize as a two big tables
     * @param clonedEliminatories the sorted Eliminatory list from which take the team couples 
     */
    private placeOnTwoBigTables(topEliminatory: EliminatoryLevel, clonedEliminatories : Eliminatory[] ) {
        console.log("Entering placeOnTwoBigTables()");

        let p1: number = 0;
        let p2: number = topEliminatory.eliminatories.length / 2;
        let p3: number = topEliminatory.eliminatories.length - 1;
        let p4: number = p2 - 1;
        
        let p : number=0;
        let li = clonedEliminatories.length - 1;
        for( let i=0; i<topEliminatory.eliminatories.length; i++ ) {
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
            let e = topEliminatory.eliminatories[p];
            if( i < 4 ) {
                e = clonedEliminatories[i];
            } else {
                e = clonedEliminatories[li--];
            }
            for(let m of e.round.onewayMeetings ) {
                this.saveMeeting(e, m);
            }
            for(let m of e.round.roundtripMeetings ) {
                this.saveMeeting(e, m);
            }
        }

        // console.log("topEliminatory.eliminatories:");
        // for( let p=0; p<topEliminatory.eliminatories.length; p++ ) {
        //     let r = topEliminatory.eliminatories[p].round;
        //     console.log(r.teamNames +", id="+ r.onewayMeetings[0].id +","+" " + r.onewayMeetings[0].vpoints1 + "-" + r.onewayMeetings[0].vpoints2);
        // }
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
        console.log("Entering saveMeetingNextCallback("+m+")");  
        // this.tourneyService.updateTourneyWithCleanAll(this.selectedTourney, () => {});
    }
    
    private cloneEliminatories(el: EliminatoryLevel ) : Eliminatory[] {
        let eliminatories: Eliminatory[] = [];
        for (let e of el.eliminatories) {
            let ec = this.cloneEliminatory(e);
            eliminatories.push(ec);
        }
        return eliminatories;
    }

    private swapIfFromSameRound(el: EliminatoryLevel, rounds: Round[]) {
        if (this.selectedTourney.isEliminatoryAutoGen) {
            for (let i = 1; i < el.eliminatories.length; i++) {
                let e1: Eliminatory = el.eliminatories[i - 1];
                let e2: Eliminatory = el.eliminatories[i];
                if (this.cameFromSameRound(rounds, e1.round.teamNames[0], e1.round.teamNames[1])) {
                    this.swapEliminatory(e1, e2);
                }
            }
            let e2 = el.eliminatories[el.eliminatories.length - 1];
            if (this.cameFromSameRound(rounds, e2.round.teamNames[0], e2.round.teamNames[1])) {
                let e1 = el.eliminatories[el.eliminatories.length - 2];
                this.swapEliminatory(e1, e2);
            }
        }
    }

    // Controlla se il bit di segno è l'unico bit impostato
    private isPowerOf2(num: number) : boolean {
        if (num <= 0) {
            return false;
        }
        return (num & (num - 1)) === 0;
    }

    private cloneRounds(rounds: Round[]): Round[] {
        let clonedRounds: Array<Round> = new Array<Round>();
        for(let r of rounds) {
            let newRound = this.cloneRound(r);
            clonedRounds.push(newRound);
        }
        return clonedRounds;
    }

    private cloneRound(r: Round) : Round {
        let newRound : Round = { direction: r.direction
        , id: r.id
        , name: r.name
        , label: r.label
        , type: r.type
        , pageSize: r.pageSize
        , daysNo: r.daysNo
        , onewayCurrentDay: r.onewayCurrentDay
        , roundtripCurrentDay: r.roundtripCurrentDay
        , teamNames: [...r.teamNames]
        , teamNo: r.teamNo
        , onewayMeetings: this.cloneMeetings(r.onewayMeetings)
        , roundtripMeetings: this.cloneMeetings(r.roundtripMeetings)
        , classification: this.cloneClassifications(r.classification)
        };
        return newRound;
    }
    
    private cloneMeetings(mts: Meeting[]): Meeting[] {
        let nms : Meeting[] = [];
        for(let m of mts) {
            let nm = this.cloneMeeting(m);
            nms.push(nm);
        }
        return nms;
    }

    private cloneClassifications(classifications: Classification[]): Classification[] {
        let cloneClassifications: Array<Classification> = new Array<Classification>();
        for(let c of classifications) {
            let nc = this.cloneClassification(c);
            cloneClassifications.push(nc);
        }
        return cloneClassifications; 
    }

    private cloneClassification(c: Classification) : Classification {
        let nc : Classification = new Classification();
        nc.id = c.id;
        nc.balanced = c.balanced;
        nc.teamName = c.teamName;
        nc.points = c.points;
        nc.played = c.played;
        nc.won = c.won;
        nc.lost = c.lost;
        nc.balanced = c.balanced;
        nc.penalty = c.penalty;
        nc.goalsDone = c.goalsDone;
        nc.goalsDiff = c.goalsDiff;
        nc.goalsConceded = c.goalsConceded;
        nc.notResolveble = c.notResolveble;
        
        return nc;
    }
    
    private swapEliminatory(e1 : Eliminatory, e2 : Eliminatory) {
        for( let m of e1.round.onewayMeetings ) {
            m.teamName2 = e2.round.teamNames[1];
        }
        for( let m of e2.round.onewayMeetings ) {
            m.teamName2 = e1.round.teamNames[1];
        }

        for( let m of e1.round.roundtripMeetings ) {
            m.teamName1 = e2.round.teamNames[1];
        }
        for( let m of e2.round.roundtripMeetings ) {
            m.teamName1 = e1.round.teamNames[1];
        }        

        let tempE: string[] = [...e1.round.teamNames];
        e1.round.teamNames[1] = e2.round.teamNames[1];
        e2.round.teamNames[1] = tempE[1];
    } 

    /**
     * Resolves the rules defined in the received Eliminatory configurated in automatic mode.
     * In function of the classification reached in the previous rounds or playoffs, the method
     * finds the teams that gained the right for the direct eliminations. 
     * It creates and returns a new resolved Eliminatory without update the original Eliminatory object
     */
    private resolveToplevelAutomatic(e: Eliminatory, matchWinnerScores : number, roundMatrix: Array<Array<Classification>>
        , terminated: boolean )   {
        let row1 = this.isPlayoff ? e.rule1.fromPlayoff.position.value : e.rule1.fromRound.position.value;
        let col1 = this.isPlayoff ? e.rule1.fromPlayoff.bandPosition   : e.rule1.fromRound.bandPosition;

        let row2 = this.isPlayoff ? e.rule2.fromPlayoff.position.value : e.rule2.fromRound.position.value;  
        let col2 = this.isPlayoff ? e.rule2.fromPlayoff.bandPosition   : e.rule2.fromRound.bandPosition;

        this.resolveMeetingsRules(matchWinnerScores, e, terminated, roundMatrix, row1, col1, row2, col2);
        
        // for (let m of e.round.onewayMeetings) {
        // }
        // for (let m of e.round.roundtripMeetings) {
        //     this.resolveMeetingsRules(matchWinnerScores, e, m, terminated, roundMatrix, row2, col2, row1, col1);
        //     e.round.teamNames = [m.teamName2, m.teamName1];
        // }
        // for( let i=0; i<e.round.roundtripMeetings.length; i++ ) {
        //     resolvedE.round.roundtripMeetings[i].teamName2 = e.round.onewayMeetings[i].teamName1;
        //     resolvedE.round.roundtripMeetings[i].teamName1 = e.round.onewayMeetings[i].teamName2;
        // }
    }

    private cameFromSameRound(rounds: Round[], t1: string, t2: string): boolean {
        let r1: Round = null;
        let r2: Round = null;
        for( let r of rounds ) {
            let index1 = r.teamNames.findIndex(e=>e==t1);
            if( index1 != -1 ) {
                r1 = r;
            }
            let index2 = r.teamNames.findIndex(e=>e==t2);
            if( index2 != -1 ) {
                r2 = r;
            }
        }
        if( r1 == null || r2 == null) {
            return false;
        }

        return r1.name === r2.name;
    }

    private isRoundsTerminated(rounds: Round[]) {
        let terminated: boolean = true;
        for (let r of rounds) {
            for (let m of r.onewayMeetings) {
                if (m.status != MeetingStatus.Terminated && m.status != MeetingStatus.Confirmed ) {
                    terminated = false;
                    break;
                }
            }
            if (!terminated) {
                break;
            }
            for (let m of r.roundtripMeetings) {
                if (m.status != MeetingStatus.Terminated && m.status != MeetingStatus.Confirmed) {
                    terminated = false;
                    break;
                }
            }
        }
        return terminated;
    }

    private resolveMeetingsRules(matchWinnerScores : number
            , e: Eliminatory
            , terminated : boolean
            , roundMatrix: Classification[][]
            , row1: number
            , col1: number
            , row2: number
            , col2: number)  {
        let m : Meeting = e.round.onewayMeetings[0];
        if (row1 <= 0 || m.isDummy) {
            m.teamName1 = "";
            m.isSkiping = true;
        } else {
            if(!terminated || m.teamName1 == "") {
                m.teamName1 = roundMatrix[row1 - 1][col1 - 1].teamName;
            }
            m.isSkiping = false;
        }
        if (row2 <= 0 || m.isDummy) {
            m.teamName2 = "";
            m.isSkiping = true;
        } else {
            if(!terminated || m.teamName2 == "") {
                m.teamName2 = roundMatrix[row2 - 1][col2 - 1].teamName;
            }
            m.isSkiping = false;
        }
        e.round.teamNames = [m.teamName1, m.teamName2];
        m.name = m.teamName1 + " - " + m.teamName2;
        let c1 : Classification = e.round.classification[0];
        let c2 : Classification = e.round.classification[1];
        c1.played = 0;
        c2.played = 0;
        c1.teamName = m.teamName1;
        c2.teamName = m.teamName2;
        if( m.isSkiping ) {
            c2.notResolveble = false;
            c1.notResolveble = false;
            if( m.teamName1 == "" ) {
                m.points1 = 0;
                m.points2 = matchWinnerScores;
                c2.points = m.points2 ;
                m.status = MeetingStatus.Terminated;
            }
            if( m.teamName2 == "" ) {
                m.points1 = matchWinnerScores;
                c1.points = m.points1 ;
                m.points2 = 0;
                m.status = MeetingStatus.Terminated;
            }
        }
        m.vpoints1 = m.matches.length==1 ? m.matches[0].score1 : m.points1;
        m.vpoints2 = m.matches.length==1 ? m.matches[0].score2 : m.points2;

        let mr : Meeting = this.cloneMeeting(m);
        mr.teamName1 = m.teamName2;
        mr.teamName2 = m.teamName1;
        e.round.roundtripMeetings[0] = mr;
    }

    private cloneEliminatory(e: Eliminatory): Eliminatory {
        let ne : Eliminatory = new Eliminatory();
        ne.id = e.id;
        ne.isSkiping = e.isSkiping;
        ne.round = this.cloneRound(e.round);
        ne.rule1 = e.rule1;
        ne.rule2 = e.rule2;
        return ne;
    }

    private cloneMeeting(m: Meeting): Meeting {
        let mr : Meeting = new Meeting();
        mr.address=m.address;
        mr.containerId = m.containerId;
        mr.country = m.country;
        mr.datetime = m.datetime;
        mr.day = m.day;
        mr.direction = m.direction;
        mr.id = m.id;
        mr.isDummy = m.isDummy;
        mr.isSkiping = m.isSkiping;
        mr.matches = this.cloneMatches(m.matches);
        mr.name = m.name;
        mr.points1 = m.points1;
        mr.points2 = m.points2
        mr.rule1 = m.rule1;
        mr.rule2 = m.rule2;
        mr.ruleName1 = m.ruleName1;
        mr.ruleName2 = m.ruleName1;
        mr.ruleName = m.ruleName;
        mr.status = m.status;
        mr.teamName1 = m.teamName1;
        mr.teamName2 = m.teamName2;
        mr.vpoints1 = m.vpoints1;
        mr.vpoints2 = m.vpoints2;
        return mr;
    }
    
    private cloneMatches(matches:  Match[]):  Match[] {
        let nms : Match[] = [];
        for( let m of matches ) {
            let nm = this.cloneMatch(m);
            nms.push(nm);
        }
        return nms;
    }
    private cloneMatch(m: Match) : Match {
        let nm = new Match();
        nm.id = m.id;
        nm.players1 = m.players1;
        nm.players2 = m.players2;
        nm.score1 = m.score1;
        nm.score2 = m.score2;
        nm.status = m.status;
        return nm;
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
     * @param l  the current eliminatory level index
     * @param el the current eliminatory object
     */
    private resolveNextLevel(eliminatoryLevels: Array<EliminatoryLevel>, l: number, selectedEliminatoryLevelIndex : number, el: EliminatoryLevel) {

        if(selectedEliminatoryLevelIndex != 0) {
            this.meetingService.qualifyingRounds = [];
        }
        if(el.isOptional) { // for 3° and 4° classification position
            this.execute3And4Position(el, l, eliminatoryLevels, selectedEliminatoryLevelIndex);
            return;
        }

        let prevIndex: number = l-1;
        let previousEliminatoryLevel: Array<Eliminatory> = new Array<Eliminatory>();
        for( let e of eliminatoryLevels[prevIndex].eliminatories ) {
            previousEliminatoryLevel.push(e);
            if(selectedEliminatoryLevelIndex != 0) {
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
        }
    }
    
    private execute3And4Position(el: EliminatoryLevel, l: number, eliminatoryLevels: EliminatoryLevel[], selectedEliminatoryLevelIndex: number) {
        let e = el.eliminatories[0];

        let prevIndex: number = l - 2;
        let semifinalLevel: Array<Eliminatory> = new Array<Eliminatory>();
        for (let e of eliminatoryLevels[prevIndex].eliminatories) {
            semifinalLevel.push(e);
            if (selectedEliminatoryLevelIndex != 0) {
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
        
        if( this.selectedRow.isSkiping ) {
            return;
        }
        if(this.tourneyService.selectedEliminatoryLevelIndex==-1) {
            this.meetingService.selectedMeetingDb.eliminatoryBId = this.selectedRow.containerId;
        } else {
            this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedRow.containerId
        }

        let el : Eliminatory  = this.eliminatories.find( e => e.id == this.selectedRow.containerId );
        this.meetingService.selectedRound = el.round;

        this.meetingService.selectedRound.label = this.makeEliminatoryLabel();

        this.gotoDetailView();
    }

    protected makeEliminatoryLabel() : string {
        let mm = this.tourneyService.selectedEliminatoryTabIndex == 0 ? "Andata" : "Ritorno";
        return this.tourneyService.selectedEliminatoryLevel.name + "(" + this.meetingService.selectedRound.name + ") - " + mm;
    }
}

