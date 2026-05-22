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
import { Injectable } from '@angular/core';
import { ClientService } from 'app/tourneyonline/service/client-service';
 
@Injectable()
export abstract class AbstractResultEliminatoryListView extends AbstractEliminatoryListView {
    cols: TableCols[] = [];
    pageSize: number = 10;
    classificationCols: TableCols[] = [];
    eliminatoryClassification: any[] = [];

    selectedRow: Meeting = new Meeting();
    onewayMeetings: Meeting[] = [];
    roundtripMeetings: Meeting[] = [];
    isRoundTrip: boolean = false;
    selectedClassificationRow: Classification = new Classification();
    isLevelB: boolean = false;

    constructor(
        public override redirect: string,
        public override tourneyService: TourneyService,
        protected override meetingService: MeetingService,
        protected levelService: LevelService,
        protected clientService: ClientService,
        protected override router: Router,
        protected override location: Location,
        public dfp: DateFormatPipe
    ) {
        super(redirect, tourneyService, meetingService, router, location, dfp);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.classificationCols = this.tourneyService.classificationCols;
        this.isRoundTrip = this.isOneway == "true" ? false : true;
    }
    
    refresh(): void {        
        this.ngOnInit(); 
    }

    override onTabChange(value: string | number | undefined) {
        super.onTabChange(value);
        let index=value;
        console.log("Entering onTabChange("+index+")");
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
                    this.compileNextLevel(this.eliminatoryLevels, l, el );
                }
            } else {
                if( el.isTopLevel ) {
                    let selectedTeamsNo : number = 0; 
                    if( el.topLevelTeamNo ) {
                        selectedTeamsNo = el.topLevelTeamNo; // the original selected number of eliminatories, like 18, or all
                    } else {
                        selectedTeamsNo = el.eliminatories.length * 2; 
                    }   
                    this.compileTopLevel( el, selectedTeamsNo );
                } else {
                    this.compileNextLevel(this.eliminatoryLevels, l, el );
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
     * In the 1° case, we create the playoffs to eliminate the spare teams so we can have the perfect power of 2 teams. 
     * 
     * We need of a list of the best position teams in their rounds: the list of the 1°, the list of the 2°, the 3°, and so on
     * It is necessary when we have to create the new couple between the 1-st and the winner of the playoffs. 
     * After that, the first elimination level will contain the union of those
     * teams coming from the rounds and those coming from the playoffs.
     *  
     * In the 2-nd case, we would not use the unique classification on all rounds unless configured.
     * We only want to apply the fixed schema, or round robin schema, on the list
     * of the rounds anywhere they are coming from, every round has the same weight of each other so we select the best teams from
     * each round on their classification base. 
     * 
     * First of all, we have to check if the number of teams we want to pass to
     * the elimination phase, is a power of 2, like 4, 8, 16, 32,.... 
     * If it does not, we have to create the playoff
     * on the spare teams to eliminate them and have the correct power of 2 teams.
     * 
     * Example if we have 18 teams that we want 
     * to pass in the elimination phase, we have to play 2 match: the 15-th vs the 18-th and the 16-th vs the 17-th.
     * The winners will play against the best 1-st and the 2-nd in the rounds 
     */
     private compileTopLevel(topEl : EliminatoryLevel, selectedTeamsNo : number ): void {
        console.log("Entering compileTopLevel(" + topEl.level +")");
        if(!this.selectedTourney.isEliminatoryAutoGen) {
            for(let e of topEl.eliminatories ) {
                this.resolveToplevelManual(topEl, e);
            }
            return;
        }

        let fullRounds: Array<Round>;
        if( this.isPlayoff ) {
            fullRounds =  this.selectedTourney.playoffVO.playoffs.map((p: { round: any; }) => {return p.round;});
        } else {
            fullRounds = this.selectedTourney.roundVO.rounds;
        }

        let rounds: Array<Round> = [...fullRounds];
        this.meetingService.qualifyingRounds = [...fullRounds];
        let sortedRounds: Round[]  = rounds.sort((r1, r2) => {
            if( r1.teamNames.length < r2.teamNames.length ) {
                return 1;
            }
            if( r1.teamNames.length > r2.teamNames.length ) {
                return -1;
            }
            return 0;
        });
        rounds = sortedRounds;
        let R : number = rounds.length;
        let currentIndex : number = 0;
        let nextIndex    : number = R == 1 ? 0 : 1; // If we have only 1 round, the indexes are the same
        if( this.isLevelB ) {
            const highestPow2Le : number =  this.levelService.highestPowerOf2LE(selectedTeamsNo);
            let flm : number[][] = this.buildFirstLastMatrix( rounds, highestPow2Le );
            const teamsBNo = selectedTeamsNo - highestPow2Le; 
            let roundsB : Round[] = [];
            let Rb = R;
            if( teamsBNo < 2*R ) {
                Rb = Math.floor(teamsBNo / 2);
            }
            for( let t=0; t<Rb; t++ ) {
                let round = new Round();
                roundsB.push(round);
            }
            let r : number = 0;
            let rb : number = 0;
            let t=0;
            while( t<teamsBNo ) {
                flm[r][1]++;
                let li = flm[r][1];
                let round = rounds[r];
                if( li >= round.classification.length ) {
                    r = (r + 1) % R;
                    continue;
                }
                let roundB = roundsB[rb];
                roundB.id = round.id;
                roundB.label = round.label;
                roundB.name = round.name;
                roundB.direction = round.direction;
                roundB.pageSize = round.pageSize;
                roundB.type = round.type;
                roundB.teamNo = round.teamNo;

                roundB.teamNames.push(round.classificatedTeamNames[li]);
                roundB.classificatedTeamNames.push(round.classificatedTeamNames[li]);
                roundB.classification.push(round.classification[li]);

                r = (r + 1) % R;
                rb = (rb + 1) % Rb;
                t++;
            }
            selectedTeamsNo = teamsBNo;
            rounds = roundsB;
            this.levelService.roundsB = roundsB;
            R = roundsB.length;
            for( let r of rounds ) {
                r.classification = this.tourneyService.sortTeamsDesc(r.classification);
            }
            for( let i=0; i<rounds.length; i++ ) {
                const r = rounds[i];
                r.teamNames = [];
                r.classificatedTeamNames = [];
                for( let c=0; c<r.classification.length; c++ ) {
                    r.teamNames.push(r.classification[c].teamName);
                    r.classificatedTeamNames.push(r.classification[c].teamName);
                }
            }
        }

        let firstLastMatrix : number[][] = this.buildFirstLastMatrix( rounds, selectedTeamsNo );
        for( let po=0; po< topEl.eliminatories.length; po++ ) {
            let counter = rounds.length;
            while(firstLastMatrix[currentIndex][0] > firstLastMatrix[currentIndex][1] || 
                firstLastMatrix[nextIndex][0] > firstLastMatrix[nextIndex][1] )  
            {
                currentIndex = (currentIndex + 1) % R;
                nextIndex = (nextIndex + 1) % R;
                if( --counter < 0 ) {
                    console.log("Try to find a next non consecutive round with valid teams to couple in the current round");
                    counter = rounds.length;
                    while(firstLastMatrix[nextIndex][0] > firstLastMatrix[nextIndex][1] ) {
                        nextIndex = (nextIndex + 1) % R;
                        if( --counter < 0 ) {
                            console.error("Unable to find a next ROUND to couple with the round " + currentIndex + " in FLM");
                            return;
                        }
                    }
                }
            }

            let currentRound : Round = rounds[currentIndex];
            let nextRound : Round = rounds[nextIndex];

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
     * containing the first and the last index in the round R to get the first and the second team to form the new
     * playoff round 
     * 
     * @param rounds  the rounds in the tournament
     * @param selectedTeamsNo the selected number of teams to organize as playoff or a power of 2: 2, 4, 8, 16,...
     * @returns the Rx2 mantrix
     */
    private buildFirstLastMatrix( rounds: Round[], selectedTeamsNo: number): number[][] {
        const R : number = rounds.length; // R: the number of rounds, ex = 5
        let flm : number[][] = [];
        // from rule: N = n * q + r, where: n=playoffNo * 2, p=n / rounds.length and r is the module n % p
        const n : number = selectedTeamsNo; // Ex: S = 21 for playoff, or S = 16 for perfect eliminatories
        const q : number = Math.floor(n / R); // like q=4 in 24 = pq + r = 5*4 + 4
        const lastRemaing : number = n % R;
        let fi = 0;
        let li : number = q; // ... 21 / 5 = 4

        let maxTeamsPerRound : number = rounds[0].classification.length;
        let minTeamsPerRound : number = rounds[R-1].classification.length;
        if( maxTeamsPerRound > minTeamsPerRound ) {
            for( let r of rounds ) {
                if( r.classification.length > minTeamsPerRound ) {
                    this.tourneyService.normalizeClassificationList(r);
                }
            }
        }

        const highestPow2Le : number =  this.levelService.highestPowerOf2LE(selectedTeamsNo);
        let playoffNo : number = selectedTeamsNo - highestPow2Le; // 21 - 16 = 5. If 0, we do not have playoff
        let playoffTeamsNo : number = playoffNo * 2; // 5 * 2 = 10
        let qualifiedTeamsNo = selectedTeamsNo - playoffTeamsNo; // Ex: 21 - 10(21-16=5, 5*2=10) = 11;  
        const isEliminatoryPlayoff : boolean = playoffNo > 0;
        const firstRemaing = qualifiedTeamsNo % R;

        if( isEliminatoryPlayoff ) {
            fi = Math.floor(qualifiedTeamsNo / R); // ... 11 / 5 = 2
            if( firstRemaing == 0 && R > 1) {
                fi--; // 2 - 1 = 1, if we have qualifiedTeamsNo=10 (a mulply of 5), fi=1
            }
            if( lastRemaing == 0 && li > 0 ) {
                li--; // ... 5 - 1 = 4
            }
            flm = [];
            for( let i=0; i<R; i++ ) {
                let row : number[] = [];
                row.push( fi );     // first index in the round (=2)
                row.push( li );     // last index in the round (=5)
                flm.push( row );    // round 0,1,2...
            }

            if( firstRemaing > 0 ) {
                let fiBetterTeamClassification : Classification[] = [];
                for( let i=0; i<R; i++ ) {
                    let c : Classification;
                    if( fi >= rounds[i].classification.length ) {
                        c = new Classification();
                        c.teamName = "000";
                        c.points = -1000;
                    } else {
                        c = rounds[i].classification[fi];
                    }
                    c.roundIndex = i;
                    fiBetterTeamClassification.push(c);
                }
                const fiWorstTeams = (qualifiedTeamsNo % R);
                fiBetterTeamClassification = this.tourneyService.sortTeamsDesc(fiBetterTeamClassification);                
                for( let i=0; i < fiWorstTeams; i++ ) { // 11 % 5 = 1;
                    const ri = fiBetterTeamClassification[i].roundIndex;
                    flm[ri][0]++; // increment by 1 to exclude the better teams
                }
            }
           
            if( lastRemaing > 0 ) {
                let liBetterTeamClassification : Classification[] = [];
                for( let i=0; i < R; i++ ) {
                    let c : Classification;
                    if( li >= rounds[i].classification.length ) {
                        c = new Classification();
                        c.teamName = "000";
                        c.points = -1000;
                    } else {
                        c = rounds[i].classification[li];
                    }
                    c.roundIndex = i;
                    liBetterTeamClassification.push(c);
                }
                liBetterTeamClassification = this.tourneyService.sortTeamsDesc(liBetterTeamClassification);
                const liWorstTeams = (selectedTeamsNo % R); // 21 % 5 = 1
                for( let i=R-1; i >= liWorstTeams; i-- ) { // 11 % 5 = 1; 5 - 1 = 4
                    const ri = liBetterTeamClassification[i].roundIndex;
                    flm[ri][1]--; // decrement by 1 to exclude the worst teams
                }
            }
            return flm;
        }

        // No playoff, perfect power of 2
        if( lastRemaing == 0 && li > 0 ) {
            li--; // ... 16 / 4 = 4; 4 - 1 = 3
        }

        for( let i=0; i<R; i++ ) {
            let row : number[] = [];
            row.push( fi );     // first index in the round (=0)
            row.push( li );     // last index in the round (=3)
            flm.push( row );    // round 0,1,2...
        }
        
        let allTeamsNo : number = 0;
        for( let i=0; i<R; i++ ) {
            allTeamsNo += rounds[i].classification.length;
        }
        if( lastRemaing > 0 && allTeamsNo != selectedTeamsNo ) {
            let liBetterTeamClassification : Classification[] = [];
            for( let r=0; r<R; r++ ) {
                let c : Classification;
                if( li >= rounds[r].classification.length ) {
                    c = new Classification();
                    c.teamName = "000";
                    c.points = -1000;
                } else {
                    c = rounds[r].classification[li];
                }
                c.roundIndex = r;
                liBetterTeamClassification.push(c);
            }
            liBetterTeamClassification = this.tourneyService.sortTeamsDesc(liBetterTeamClassification);
            const liWorstTeams = (selectedTeamsNo % R); // 21 % 5 = 1
            for( let i=R-1; i >= liWorstTeams; i-- ) { // 11 % 5 = 1; 5 - 1 = 4
                const ri = liBetterTeamClassification[i].roundIndex;
                flm[ri][1]--; // decrements by 1 to esclude the worst teams
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
    private compileNextLevel(eliminatoryLevels: Array<EliminatoryLevel>, l: number,  el: EliminatoryLevel ) {
        console.log("Entering compileNextLevel(" + l +")");
        if(el.isOptional) { // for 3° and 4° classification position
            this.compile3And4Position(el, l, eliminatoryLevels);
            return;
        }

        let prevLevel: number = l-1;
        let previousEliminatoryLevel: Array<Eliminatory> = new Array<Eliminatory>();
        for( let e of eliminatoryLevels[prevLevel].eliminatories ) {
            previousEliminatoryLevel.push(e);
        }

        let topEl : EliminatoryLevel = eliminatoryLevels[0];
        let selectedTeamsNo = topEl.topLevelTeamNo;

        if(this.isLevelB) {
            this.meetingService.qualifyingRounds = [];
            const highestPow2Le : number =  this.levelService.highestPowerOf2LE(topEl.topLevelTeamNo);
            selectedTeamsNo = topEl.topLevelTeamNo - highestPow2Le;
        }
        const highestPow2Le : number =  this.levelService.highestPowerOf2LE(selectedTeamsNo); // if 15, pow2 = 8
        
        const playoffNo : number = selectedTeamsNo - highestPow2Le; // 21 - 16 = 5. If 0, we do not have playoff
        const playoffTeamsNo : number = playoffNo * 2; // 5 * 2 = 10
        const isTopLevelPlayoff = playoffTeamsNo > 0;

        if( l == 1 && isTopLevelPlayoff ) { // l is at least 1
            let fullRounds: Array<Round>;
            if( this.isPlayoff ) {
                fullRounds =  this.selectedTourney.playoffVO.playoffs.map((p: { round: any; }) => {return p.round;});
            } else {
                fullRounds = this.selectedTourney.roundVO.rounds;
            }
            let rounds: Array<Round> = [...fullRounds];
            let remaingRounds: Array<Round> = [...fullRounds];

            let currentIndex : number = 0;
            let nextIndex : number = 1;
            let row : number = 0;
            let col : number = 0;
            if(this.isLevelB) {
                rounds = [...this.levelService.roundsB];
                remaingRounds = [...this.levelService.roundsB];
            }
            const alreadyQualifiedTeamsNo = (selectedTeamsNo - playoffTeamsNo); 
            let qualifiedCounter : number = alreadyQualifiedTeamsNo;
            let playoffCounter : number = playoffNo;
            let playoffIndex : number = previousEliminatoryLevel.length - 1;
            const R = rounds.length;
            
            let flm : number[][] = [];
            for( let p=0; p<el.eliminatories.length; p++ ) {
                let e: Eliminatory = el.eliminatories[p];
                let c1 : Classification;
                let c2 : Classification;
                let t1 : string = "";
                let t2 : string = "";
                if( alreadyQualifiedTeamsNo <= playoffNo ) {
                    // Ex: when we select 15 teams, highestPow2Le=8, we have alreadyQualifiedTeamsNo=1(15-(15-8)*2) and playoffNo=7(15-8)
                    console.log("Case: alreadyQualifiedTeamsNo("+ alreadyQualifiedTeamsNo + ") <= playoffNo("+playoffNo +")");
                    if( qualifiedCounter > 0 ) {
                        // couple the already qualified teams with the playoff's winner
                        c1 = rounds[row++].classification[col];
                        t1 = c1.teamName;
                        let poRound = previousEliminatoryLevel[playoffIndex].round;
                        c1 = poRound.classification[0];
                        c2 = poRound.classification[1];
                        if( c1.points >= c2.points ) {
                            t2 = poRound.classification[0].teamName;
                        } else {
                            t2 = poRound.classification[1].teamName;                        
                        }
                        if( row == R ) {
                            col++;
                        }
                        row = row % R;
                        qualifiedCounter--;
                    } else {
                        // Complete the next level with the remaining teams in the playoff top level
                        console.log("Case: alreadyQualifiedTeamsNo("+ alreadyQualifiedTeamsNo + ") <= playoffNo("+playoffNo +") and qualifiedCounter <= 0");
                        let poRound = previousEliminatoryLevel[playoffIndex].round;
                        c1 = poRound.classification[0];
                        c2 = poRound.classification[1];
                        if( c1.points >= c2.points ) {
                            t1 = poRound.classification[0].teamName;
                        } else {
                            t1 = poRound.classification[1].teamName;                        
                        }
                        playoffIndex--;
                        poRound = previousEliminatoryLevel[playoffIndex].round;
                        c1 = poRound.classification[0];
                        c2 = poRound.classification[1];
                        if( c1.points >= c2.points ) {
                            t2 = poRound.classification[0].teamName;
                        } else {
                            t2 = poRound.classification[1].teamName;                        
                        }
                    }
                } else {
                    // Ex: when we select 17 teams, highestPow2Le=16, we have alreadyQualifiedTeamsNo=15(17-(17-16)*2) and playoffNo=1(17-16)
                    if( playoffCounter > 0 ) {
                        console.log("Case: couple the already qualified teams with the playoff's winner");
                        c1 = rounds[row++].classification[col];
                        t1 = c1.teamName;
                        remaingRounds = this.removeTeamFromRounds(remaingRounds, t1);
                        let poRound = previousEliminatoryLevel[playoffIndex].round;
                        c2 = poRound.classification[1];
                        if( poRound.classification[0].points >= poRound.classification[1].points ) {
                            t2 = poRound.classification[0].teamName;
                            // remove the playoff loser
                            remaingRounds = this.removeTeamFromRounds(remaingRounds, c2.teamName);
                            remaingRounds = this.removeTeamFromRounds(remaingRounds, t2);
                        } else {
                            t2 = poRound.classification[1].teamName;                        
                            // remove the playoff loser
                            remaingRounds = this.removeTeamFromRounds(remaingRounds, c1.teamName);
                            remaingRounds = this.removeTeamFromRounds(remaingRounds, t2);
                        }
                        if( row == R ) {
                            col++;
                        }
                        row = row % R;
                        playoffCounter--;
                    } else {
                        console.log("Case: couple the already qualified teams with the remaining already qualified teams from the remaingRounds");
                        for( let i=0; i<R; i++ ) {
                            let row : number[] = [];
                            row.push( 0 );     // the first index in the remaingRounds
                            row.push( remaingRounds[i].classification.length - 1 );     // the last index in the remaingRounds
                            flm.push( row );    // round 0,1,2...
                        }
                        let counter = remaingRounds.length;
                        if( R == 1 ) {
                            nextIndex = 0;
                        } else {
                            while(flm[currentIndex][0] > flm[currentIndex][1] || 
                                flm[nextIndex][0] > flm[nextIndex][1] )  
                            {
                                currentIndex = (currentIndex + 1) % R;
                                nextIndex = (nextIndex + 1) % R;
                                if( --counter < 0 ) {
                                    break;
                                }
                            }
                        }
                        if( counter < 0 ) {
                            console.log("Try to find a round with valid teams to couple in the same round");
                            counter = remaingRounds.length;
                            while(flm[currentIndex][0] > flm[currentIndex][1] ) {
                                currentIndex = (currentIndex + 1) % R;
                                if( --counter < 0 ) {
                                    break;
                                }
                            }
                            if( counter < 0 ) {
                                console.error("We cannot find any valid round neither a single round");
                                return;
                            }
                            let currentRound : Round = remaingRounds[currentIndex];
                            let nextRound : Round = remaingRounds[currentIndex];
                            let c1 : Classification = currentRound.classification[ flm[currentIndex][0]++ ];
                            let c2 : Classification = nextRound.classification[ flm[currentIndex][1]-- ];
                            t1 = c1.teamName;
                            t2 = c2.teamName;
                            currentIndex = (currentIndex + 1) % R;
                        } else {
                            let currentRound : Round = remaingRounds[currentIndex];
                            let nextRound : Round = remaingRounds[nextIndex];
                            let c1 : Classification = currentRound.classification[ flm[currentIndex][0]++ ];
                            let c2 : Classification = nextRound.classification[ flm[nextIndex][1]-- ];
                            t1 = c1.teamName;
                            t2 = c2.teamName;
                            currentIndex = (currentIndex + 1) % R;
                            nextIndex = (nextIndex + 1) % R;
                        }
                    }
                }
                playoffIndex--;

                let round = e.round;
                round.teamNames = [t1, t2];
                let m1 = round.onewayMeetings[0];
                m1.teamName1 = t1;
                m1.teamName2 = t2;
                this.updateVPoints(m1, topEl.abstractRoundVO.pointsNeededToWin);
                let m2 = round.roundtripMeetings[0];
                m2.teamName1 = t2;
                m2.teamName2 = t1;
                this.updateVPoints(m2, topEl.abstractRoundVO.pointsNeededToWin);
                this.tourneyService.createClassification(round, false);
                for( let c of round.classification ) {
                    console.log(c);
                }
            }
        } else {
            this.onPerfectPowerOf2(el, previousEliminatoryLevel);
        }
    }

    private removeTeamFromRounds(rounds: Round[], teamName: string): Round[] {
        let ra = rounds.map(round => ({
            ...round,
            teamNames: round.teamNames.filter(tn => tn !== teamName)
        }));
        ra = ra.map(round => ({
            ...round,
            classificatedTeamNames: round.classificatedTeamNames.filter(tn => tn !== teamName)
        }));
        ra = ra.map(round => ({
            ...round,
            classification: round.classification.filter(c => c.teamName !== teamName)
        }));
        return ra;
    }

    private onPerfectPowerOf2(el: EliminatoryLevel, previousEliminatoryLevel: Eliminatory[]) {
        let previousEliminatoryIndex: number = 0;
        for (let p = 0; p < el.eliminatories.length; p++) {
            let e = el.eliminatories[p];
            let round = e.round;
            let prevEliminatory1: Eliminatory = previousEliminatoryLevel[previousEliminatoryIndex];
            let team1: string = this.fromClassification(prevEliminatory1, 0);
            let prevEliminatory2: Eliminatory = previousEliminatoryLevel[previousEliminatoryIndex + 1];
            let team2: string = this.fromClassification(prevEliminatory2, 0);
            round.teamNames = [team1, team2];
            round.classification[0].teamName = team1;
            round.classification[1].teamName = team2;

            round.onewayMeetings[0].teamName1 = team1;
            round.onewayMeetings[0].teamName2 = team2;
            round.onewayMeetings[0].name = team1 + " - " + team2;

            round.roundtripMeetings[0].teamName1 = team2;
            round.roundtripMeetings[0].teamName2 = team1;
            round.roundtripMeetings[0].name = team2 + " - " + team1;

            let m = round.onewayMeetings[0];
            this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);
            m = round.roundtripMeetings[0];
            this.updateVPoints(m, el.abstractRoundVO.pointsNeededToWin);
            previousEliminatoryIndex += 2;
            this.tourneyService.createClassification(round, false);
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

        if( m1.teamName1 == null || m1.teamName2 == null ) return;

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
        let team1 = e.round.onewayMeetings[0].teamName1;
        let team2 = e.round.onewayMeetings[0].teamName2;
        if( team1 == null || team2 == null ) return;

        let prevIndex: number = l - 2;
        let semifinalLevel: Array<Eliminatory> = new Array<Eliminatory>();
        for (let e of eliminatoryLevels[prevIndex].eliminatories) {
            semifinalLevel.push(e);
            if (this.isLevelB) {
                this.meetingService.qualifyingRounds.push(e.round);
            }
        }

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

    onEliminatoryRowSelect(event : any) {
        console.log("Entering onEliminatoryRowSelect("+event+")");
        if( this.selectedRow.teamName2==null || this.selectedRow.teamName2.includes('Fittizio') ) {
            return;
        }
        this.meetingService.selectedMeeting = this.selectedRow;
        if(this.tourneyService.selectedEliminatoryLevelIndex==-1) {
            this.meetingService.selectedMeetingDb.eliminatoryBId = this.selectedRow.containerId;
        } else {
            this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedRow.containerId
        }
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
        let el = this.eliminatories.find(e => e.round.teamNames[0] === this.selectedRow.teamName1 && e.round.teamNames[1] === this.selectedRow.teamName2);
        if( el == null ) {
            return;
        }
        this.meetingService.selectedRound = el.round;
        this.meetingService.selectedRound.label = this.makeEliminatoryLabel();
        this.gotoDetailView();
    }

    protected makeEliminatoryLabel() : string {
        let mm = this.tourneyService.selectedEliminatoryTabIndex == 0 ? "Andata" : "Ritorno";
        return this.tourneyService.selectedEliminatoryLevel.name + "(" + this.meetingService.selectedRound.name + ") - " + mm;
    }
}

