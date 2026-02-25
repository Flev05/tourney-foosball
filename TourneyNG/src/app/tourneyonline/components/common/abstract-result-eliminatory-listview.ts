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
import { Direction, MeetingStatus, RoundType } from 'app/tourneyonline/domain/enumerations';
import { Injectable } from '@angular/core';
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
    }

    protected onLoadComplete(eliminatoryLevels : Array<EliminatoryLevel>, isLevelB : boolean): void {
        this.cols = this.tourneyService.resultCols;

        this.eliminatoryLevels = eliminatoryLevels;
        this.isLevelB = isLevelB;

        let topLevelTeamNo : number = 0;
        let highestPow2Le : number  = 0;
        let playoffNo : number   = 0;
        let isPlayoff : boolean     = false;
        for( let l=0; l < this.eliminatoryLevels.length; l++ ) {
            let el = eliminatoryLevels[l];
            if( l==0 ) {
                topLevelTeamNo = el.topLevelTeamNo; // the original selected number of eliminatories, like 18
                if( isLevelB ) {
                }
                highestPow2Le =  this.levelService.highestPowerOf2LE(topLevelTeamNo); // if 18, highestPow2Le = 16
                playoffNo = topLevelTeamNo - highestPow2Le; // 18 - 16 = 2
                isPlayoff = playoffNo > 0;
            }
            if( this.isStandAlone(this.selectedTourney) ) {
                if( el.isTopLevel ) {
                    this.resolveStandaloneTopLevel(el);
                } else {
                    this.compileNextLevel(this.eliminatoryLevels, l, el, isPlayoff);
                }
            } else {
                if( el.isTopLevel ) {
                    this.compileTopLevel( el, topLevelTeamNo, isPlayoff, playoffNo, highestPow2Le );
                } else {
                    this.compileNextLevel(this.eliminatoryLevels, l, el, isPlayoff);
                }
            }
        }

        this.tourneyService.updateEliminatoryLevelsAndGui(this.eliminatoryLevels);
        this.prepareEliminatoryGuiLevels(this.eliminatoryLevels);
    }

    /**
     * It manages 2 use cases:
     * 1) the number of eligible teams, candidate to eliminations, are not a power of 2
     * 2) the number of eligible teams, candidate to eliminations, are a perfect power of 2: like 2, 4, 8, 16, 32, ...
     * 
     * In 1° case, we create the playoffs to eliminate the spare teams so we can have the perfect power of 2 teams. 
     * 
     * We need of a list of the best position teams in their rounds: the list of the 1°, the list of the 2°, the 3°, and so on
     * It is necessary when we have to create the new couple between the 1-st and the winner of the playoffs. 
     * After that, the first eliminatione level will contain the union of those
     * teams coming from the rounds and those coming from the playoffs.
     *  
     * In the 2-nd case, we would not use the unique classification on all rounds unless configured.
     * We only want to apply the fixed schema, or round robin schema, on the list
     * of the rounds anywhere they are coming from, every round has the same weight of each other so we select the best teams from
     * each round on their classification base. 
     * 
     * First off all we have to check if the number of teams we want to pass to
     * the elimination phase, is a power of 2, like 4, 8, 16, 32,.... 
     * If it does not, we have to create the playoff
     * on the spare teams to eliminate them and have the correct power of 2 teams.
     * 
     * Example if we have 18 teams that we want 
     * to pass in the eleimination phase, we have to play 2 match: the 15-th vs the 18-th and the 16-th vs the 17-th.
     * The winners will play against the best 1-st and the 2-nd in the rounds 
     */
     private compileTopLevel(topEl : EliminatoryLevel, topLevelTeamNo : number, isPlayoff : boolean, playoffNo : number, highestPow2Le : number ): void {
        console.log("Entering compileTopLevel(" + topEl.level +")");
        if(!this.selectedTourney.isEliminatoryAutoGen) {
            for(let e of topEl.eliminatories ) {
                this.resolveToplevelManual(topEl, e);
            }
            return;
        }

        let fullRounds: Array<Round>;
        if( this.isPlayoff ) {
            fullRounds =  this.selectedTourney.playoffVO.playoffs.map((p) => {return p.round;});
        } else {
            fullRounds = this.selectedTourney.roundVO.rounds;
        }
        let rounds: Array<Round> = [...fullRounds];

        this.meetingService.qualifyingRounds =  rounds;
 
        let elimNo : number = 0;
        const R : number = rounds.length;

        let currentIndex : number = 0;
        let nextIndex    : number = R == 1 ? 0 : 1; // If we have only 1 round, the indexes are the same
        if( isPlayoff )  { // we have 2 playoffs
            const playoffTeams : number = playoffNo * 2;
            elimNo = playoffTeams; // = 2
        } else { // the perfect power of 2, we apply the round robin schema: 
            elimNo = topLevelTeamNo;
        }

        let firstLastMatrix : number[][] = this.buildFirstLastMatrix( rounds, elimNo, isPlayoff );
        for( let po=0; po< topEl.eliminatories.length; po++ ) {
            let currentRound : Round = rounds[currentIndex];
            let nextRound : Round = rounds[nextIndex];
            
            if(firstLastMatrix[currentIndex][0] >  firstLastMatrix[currentIndex][1] )  {
                currentIndex = (currentIndex + 1) % R;
                nextIndex = (nextIndex + 1) % R;
            }

            let c1 : Classification = currentRound.classification[ firstLastMatrix[currentIndex][0]++ ];
            let c2 : Classification = nextRound.classification[ firstLastMatrix[nextIndex][1]-- ];

            const t1 = c1.teamName;
            const t2 = c2.teamName;
            let el: Eliminatory = topEl.eliminatories[po];

            let round = el.round;
            round.teamNames = [t1, t2] ;
            let m1 = round.onewayMeetings[0];
            m1.teamName1 = t1;
            m1.teamName2 = t2;
            this.updateVPoints(m1, topEl.abstractRoundVO.pointsNeededToWin);
            let m2 = round.roundtripMeetings[0];
            m2.teamName1 = t2;
            m2.teamName2 = t1;
            this.updateVPoints(m2, topEl.abstractRoundVO.pointsNeededToWin);
            this.tourneyService.createClassification(round, false);

            currentIndex = (currentIndex + 1) % R;
            nextIndex = (nextIndex + 1) % R;
        }
    }
    
    /**
     * Prepares a matrix Rx2 where R is the number of the round in the tournament and 2 is the number of columns
     * containing the first and the last index in the round r to get the first and the second team to form the new
     * playoff round 
     * 
     * @param rounds  the rounds in the tournament
     * @param teamsNo  the number of teams to manage
     * @returns the Rx2 mantrix
     */
    private buildFirstLastMatrix( rounds: Round[], teamsNo: number, isPlayoff : boolean ): number[][] {
        const R : number = rounds.length;
        let flm : number[][] = [];
        // from rule: n = p * q + r, where: n=playoffNo * 2, p=n / rounds.length and r is the module n % p
        const n : number = teamsNo; // like 24 = (28 - 16 = 12) * 2 on 5 rounds and 28 teams
        const q : number = Math.floor(n / R); // like q=4 in 24 = pq + r = 5*4 + 4
        const r : number = n % R;
        let fi = 0;
        let li : number = q;
        
        for( let i=0; i<R; i++ ) {
            if( isPlayoff ) {
                li = rounds[i].classification.length;
                fi = li - q;
            }
            let row : number[] = [];
            row.push( fi );     // first index in the round
            row.push( li - 1 ); // last index in the round
            flm.push( row );    // round 0,1,2...
        }
        if( r > 0 ) {
            let minTeamsPerRound : number = rounds[R-1].classification.length;
            if( rounds[0].classification.length > minTeamsPerRound ) {
                for( let r of rounds ) {
                    if( r.classification.length > minTeamsPerRound ) {
                        this.tourneyService.normalizeClassificationList(r);
                    }
                }
            }
            let betterTeamClassification : Classification[] = [];
            for( let i=0; i<R; i++ ) {
                const li : number = rounds[i].classification.length;
                let fi = li - 1;
                if( isPlayoff ) {
                    fi = li - q - 1;
                }
                const c : Classification = rounds[i].classification[fi];
                c.roundIndex = i;
                betterTeamClassification.push(c);
            }
            betterTeamClassification = this.tourneyService.sortTeamsDesc(betterTeamClassification);
            if( isPlayoff ) {
                betterTeamClassification = betterTeamClassification.reverse();
                for( let i=0; i<r; i++ ) { // r is the remaing in N = p*q + r like 4 in: 24 = 5 * 4 + 4
                    const ri = betterTeamClassification[i].roundIndex;
                    flm[ri][0]--; // decrements by 1 the first index in first/last index matrix
                }
            } else {
                for( let i=r; i<R; i++ ) { // r is the remaing in N = p*q + r like 4 in: 24 = 5 * 4 + 4
                    const ri = betterTeamClassification[i].roundIndex;
                    flm[ri][1]--; // decrements by 1 the last index in first/last index matrix
                }
            }
        }
        return flm;
    }

    /**
     * Updates the next lower level in function of the default position found in received current level
     * 
     * @param eliminatoryLevels the list of eliminatory levels
     * @param l  the current eliminatory level index
     * @param el the current eliminatory object to compile
     */
    private compileNextLevel(eliminatoryLevels: Array<EliminatoryLevel>, l: number,  el: EliminatoryLevel, isPlayoff : boolean) {
        console.log("Entering compileNextLevel(" + l + "," + isPlayoff +")");
        if(this.isLevelB) {
            this.meetingService.qualifyingRounds = [];
        }
        if(el.isOptional) { // for 3° and 4° classification position
            this.compile3And4Position(el, l, eliminatoryLevels);
            return;
        }

        let prevLevel: number = l-1;
        let previousEliminatoryLevel: Array<Eliminatory> = new Array<Eliminatory>();
        for( let e of eliminatoryLevels[prevLevel].eliminatories ) {
            previousEliminatoryLevel.push(e);
            if(this.isLevelB) {
                this.meetingService.qualifyingRounds.push(e.round);
            }
        }

        if( l == 1 && isPlayoff ) { // l is at least 1
            let topEl : EliminatoryLevel = eliminatoryLevels[0];
            const pow2LE : number =  this.levelService.highestPowerOf2LE(topEl.topLevelTeamNo); // if 18, pow2 = 16
            const playoffNo = topEl.topLevelTeamNo - pow2LE; // 18 - 16 = 2
            isPlayoff = playoffNo > 0;
            let rounds: Array<Round>;
            if( this.isPlayoff ) { // this is the playoff at round level, if any, not the one at elimination level
                rounds =  this.selectedTourney.playoffVO.playoffs.map((p) => {return p.round;});
            } else {
                rounds = this.selectedTourney.roundVO.rounds;
            }
            let sortedClassificationList: Array<Classification> = this.tourneyService.getPackedBandPositions(rounds, topEl.topLevelTeamNo);
            let lastIndex    : number = topEl.topLevelTeamNo - 1; // 18 - 1 = 17
            let firstIndex   : number =0;

            let playoffIndex : number = 0;
            for( let p=0; p<el.eliminatories.length; p++ ) {
                let e: Eliminatory = el.eliminatories[p];
                let firstClassificationTeam = sortedClassificationList[firstIndex++];
                let lastClassificationTeam  = sortedClassificationList[lastIndex--];
                let t1 = firstClassificationTeam.teamName;
                let t2 : string = "";
                if( playoffIndex < topEl.eliminatories.length ) {
                    // t2 is the winner of the selected playoff
                    const c1 : Classification = topEl.eliminatories[playoffIndex].round.classification[0];
                    const c2 : Classification = topEl.eliminatories[playoffIndex].round.classification[1];
                    if( c1.points >= c2.points ) {
                        t2 = topEl.eliminatories[playoffIndex].round.classification[0].teamName;
                    } else {
                        t2 = topEl.eliminatories[playoffIndex].round.classification[1].teamName;                        
                    }
                    playoffIndex++;
                } else {
                    t2 = lastClassificationTeam.teamName;
                }
                e.round.teamNames = [t1, t2];
                let m1 = e.round.onewayMeetings[0];
                m1.teamName1 = t1;
                m1.teamName2 = t2;
                this.updateVPoints(m1, topEl.abstractRoundVO.pointsNeededToWin);
                let m2 = e.round.roundtripMeetings[0];
                m2.teamName1 = t2;
                m2.teamName2 = t1;
                this.updateVPoints(m2, topEl.abstractRoundVO.pointsNeededToWin);
                this.tourneyService.createClassification(e.round, false);
                for( let c of e.round.classification ) {
                    console.log(c);
                }
            }
        } else {
            this.onPerfectPowerOf2(el, previousEliminatoryLevel);
        }
    }

    private onPerfectPowerOf2(el: EliminatoryLevel, previousEliminatoryLevel: Eliminatory[]) {
        let previousEliminatoryIndex: number = 0;
        for (let p = 0; p < el.eliminatories.length; p++) {
            let e = el.eliminatories[p];
            let prevEliminatory1: Eliminatory = previousEliminatoryLevel[previousEliminatoryIndex];
            let team1: string = this.fromClassification(prevEliminatory1, 0);
            let prevEliminatory2: Eliminatory = previousEliminatoryLevel[previousEliminatoryIndex + 1];
            let team2: string = this.fromClassification(prevEliminatory2, 0);
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
            this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);
            m = e.round.roundtripMeetings[0];
            this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);
            previousEliminatoryIndex += 2;
            this.tourneyService.createClassification(e.round, false);
        }
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
                this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);
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
                this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);
            }
        }
    }

    private updateVPoints(om: Meeting, pointsNeededToWin : Number) {
        om.vpoints1 = 0;
        om.vpoints2 = 0;
        for (let m of om.matches) {
            if(m.score1 == pointsNeededToWin ) {
                om.vpoints1++;
            }
            if(m.score2 == pointsNeededToWin ) {
                om.vpoints2++;
            }
        }
    }

    /**
     * Resolves the rules related to the eliminatories configurated in manual mode.
     * In function of the classification reached in the previous rounds or playoffs, the method
     * finds the teams that gained the right for the direct eliminations
     */
    private resolveToplevelManual(el : EliminatoryLevel, e: Eliminatory) {
        let m1 = e.round.onewayMeetings[0];
        let m2 = e.round.roundtripMeetings[0];

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
        this.updateVPoints(m1, el.abstractRoundVO.pointsNeededToWin);
        this.updateVPoints(m2, el.abstractRoundVO.pointsNeededToWin);
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
        this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);

        m = e.round.roundtripMeetings[0];
        this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);
    }

    private fromClassification(e: Eliminatory, position: number): string {
        console.info("Entering fromClassification("+position+")");
        return e.round.classification[position].teamName;        
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect("+event+")");
        if( this.selectedRow.teamName2.includes('Fittizio') ) {
            return;
        }
        this.meetingService.selectedMeeting = this.selectedRow;
        if(this.tourneyService.selectedEliminatoryLevelIndex==-1) {
            this.meetingService.selectedMeetingDb.eliminatoryBId = this.selectedRow.containerId;
        } else {
            this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedRow.containerId
        }
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
        let el : Eliminatory  = this.eliminatories.find(e => e.round.teamNames[0] === this.selectedRow.teamName1 && e.round.teamNames[1] === this.selectedRow.teamName2);
        this.meetingService.selectedRound = el.round;
        this.meetingService.selectedRound.label = this.makeEliminatoryLabel();
        this.gotoDetailView();
    }

    protected makeEliminatoryLabel() : string {
        let mm = this.tourneyService.selectedEliminatoryTabIndex == 0 ? "Andata" : "Ritorno";
        return this.tourneyService.selectedEliminatoryLevel.name + "(" + this.meetingService.selectedRound.name + ") - " + mm;
    }
}

