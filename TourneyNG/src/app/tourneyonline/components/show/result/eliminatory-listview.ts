import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { Classification } from 'app/tourneyonline/domain/classification';
import { MeetingDetailView } from './meeting-detailview';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { MeetingStatus, Direction } from 'app/tourneyonline/domain/enumerations';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { LevelService } from '../../admin/eliminatory/level-service';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractEliminatoryListView {
    static autoRedirect: string = 'result/lv/meetingLv/dv';
    
    cols: TableCols[] ;
    pageSize: number = 10;
    classificationCols: TableCols[];
    eliminatoryClassification: any[];

    selectedRow: Meeting;
    onewayMeetings: Meeting[];
    roundtripMeetings: Meeting[];

    constructor(
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected levelService: LevelService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, meetingService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
        this.classificationCols = this.tourneyService.classificationCols;

        this.levelService.loadAllEliminatoryMeetingByIdList(this.selectedTourney.eliminatoryLevels, () => this.onLoadComplete());
    }
 
    onChangeTab(e) {
        let index=e.index;
        this.tourneyService.selectedEliminatoryTabIndex = index;
    }

    private onLoadComplete(): void {
        this.cols = this.tourneyService.resultCols;

        if( this.isStandAlone(this.selectedTourney) ) {
            for(let level=0; level<this.eliminatories.length; level++) {
                let e = this.eliminatories[level];
                // this.updateDefaultNextLevel(e, level);
            }
        } else {
            for( let el of this.selectedTourney.eliminatoryLevels) {
                if( el.isTopLevel ) {
                    this.resolveNotStadaloneRules( el );
                } else {
                    this.updateDefaultNextLevel( el );
                }
            }
        }

        this.eliminatoryRows = [];
        this.onewayMeetings  = [];

        for(let level=0; level<this.eliminatories.length; level++) {
            let e = this.eliminatories[level];
            let classificationMap: Map<string, Classification> = new Map<string, Classification>();

            let m: Meeting = e.round.onewayMeetings[0];
            let row = this.prepareEliminationMeetingGui(e, m, classificationMap);
            this.eliminatoryRows = this.eliminatoryRows.concat(row);
            
            
            if(this.tourneyService.selectedEliminatoryLevel.direction == Direction.RoundTrip) {
                m = e.round.roundtripMeetings[0];
                row = this.prepareEliminationMeetingGui(e, m, classificationMap);
                this.eliminatoryRows.push(row);
            }

            if(this.tourneyService.selectedEliminatoryLevel.direction == Direction.OneWay) {
                this.onewayMeetings.push(m);
            }
            if(this.tourneyService.selectedEliminatoryLevel.direction == Direction.RoundTrip) {
                this.roundtripMeetings.push(m);
            }
            this.eliminatoryClassification = this.tourneyService.prepareRoundsGui([e.round]);
        }
    }

    /**
     * Fills the next eliminatory level, up to the final level, in function of the results in the current
     * meeting of the current level. If the match is in balance, no fill will take place in the next level
     * and all remain as is.
     */
    private updateLevelFromPrevious(): void {
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
            // if(m.id == this.selectedMeeting.id) {
            //     l.round.onewayMeetings[i] = this.selectedMeeting;
            // }
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

        // let mdb = this.meetingService.completeEliminatoryMeetingDb(nextMeeting
        //     , this.selectedTourney.id
        //     , nextEliminatory.id
        // );        
        // this.meetingService.updateMeetingMdb(mdb).subscribe(n => this.next(n), e => this.onError(e));
    }

    /**
     * Resolves the rules, not stand alone, defined in the Round and Playoff classifications.
     * For a given position > 0, verify the round and, if doesn't exist, verify the playoff.
     * One of them must contains a valued name, otherwise the configuration was not completed
     */
    private resolveNotStadaloneRules(el : EliminatoryLevel ): void {
        let rounds: Array<Round> = new Array<Round>();
        if( this.isPlayoff ) {
            rounds = this.selectedTourney.playoffs.map((p) => {return p.round;});
            // for(let p of this.selectedTourney.playoffs) {
            //     rounds.push(p.round);
            // }
        } else {
            rounds = [...this.selectedTourney.rounds];
        }

        for(let e of el.eliminatories ) {
            if(e.rule1.fromRound.isAutomatic) {
                this.resolveTolevelAutomatic(e, rounds);
            } else {
                this.resolveToplevelManual(e);
            }

            if(this.tourneyService.selectedEliminatoryLevelIndex >= 2) {
                continue;
            }
        }
    }

    /**
     * Resolves the rules related to the eliminatories configurated in automatic mode.
     * In function of the classification reached in the previous rounds or playoffs, the method
     * finds the teams that gained the right for the direct eliminations
     */
    private resolveTolevelAutomatic( e: Eliminatory, rounds: Array<Round> ) {

        for( let m of e.round.onewayMeetings ) {
            this.meetingService.resolveAutomaticRules(m, rounds);
        }
        for( let m of e.round.roundtripMeetings ) {
            this.meetingService.resolveAutomaticRules(m, rounds);
        }
    }

    /**
     * Resolves the rules related to the eliminatories configurated in manual mode.
     * In function of the classification reached in the previous rounds or playoffs, the method
     * finds the teams that gained the right for the direct eliminations
     */
    private resolveToplevelManual(e: Eliminatory) {
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
            for(let r of this.selectedTourney.rounds) {
                if(r.name == roundName) {
                    let teamName = r.classification[pr1-1].teamName;
                    m1.teamName1 = teamName;
                    break;
                }
            }
        } else {
            let roundName = fp1.round.label;
            for(let p of this.selectedTourney.playoffs) {
                if(p.round.name == roundName) {
                    let teamName = p.round.classification[pp1-1].teamName;
                    m1.teamName1 = teamName;
                    break;
                }
            }
        }
        
        if(pr2 > 0 && fr2.round.value > 0) {
            let roundName = fr2.round.label;
            for(let r of this.selectedTourney.rounds) {
                if(r.name == roundName) {
                    let teamName = r.classification[pr2-1].teamName;
                    m1.teamName1 = teamName;
                    break;
                }
            }
        } else {
            let roundName = fp2.round.label;
            for(let p of this.selectedTourney.playoffs) {
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
    }

    private paddingRounds(rounds: Round[]): Round[] {
        let max = 0;
        for( let r of rounds ) {
            if( r.classification.length > max ) {
                max = r.classification.length;
            }
        }
        let newRounds: Round[] = [...rounds];
        for(let i=0; i<rounds.length; i++ ) {
            let r = rounds[i];

            if( r.classification.length < max ) {
                for( let j=r.classification.length; j < max; j++ )  {
                    let dc = this.tourneyService.newClassification(this.newDummyTeam().teamName, -1);
                    newRounds[i].classification.push(dc);
                }
            }
        } 
        return newRounds;
    }

    /**
     * Updates the next lower level in function of the default position found in received current level
     * 
     * @param el the current eliminatory object
     * @param level the current level
     */
    private updateDefaultNextLevel(el: EliminatoryLevel) {
        for(let level=0; level<el.eliminatories.length; level++) {
            let e = this.eliminatories[level];

            if (e.round.teamNames[0] != "" && e.round.teamNames[1]  == "") {
                const els = this.selectedTourney.eliminatoryLevels;
    
                let nextEliminatoryLevelIndex = this.tourneyService.selectedEliminatoryLevelIndex + 1;
                let nextEliminatoryLevel: EliminatoryLevel = els[nextEliminatoryLevelIndex];
                let nextEliminatoryIndex: number = Math.floor(level / 2);
                let nextEliminatory: Eliminatory = nextEliminatoryLevel.eliminatories[nextEliminatoryIndex];
                
                let nr = nextEliminatory.round;
                let nm = nr.onewayMeetings[0];
    
                if (level % 2 == 0) {
                    nm.teamName1 = e.round.teamNames[0];
                    nr.teamNames[0] = e.round.teamNames[0];
                } else {
                    nm.teamName2 = e.round.teamNames[0];
                    nr.teamNames[1] = e.round.teamNames[0];
                }
                
                // this.meetingService.completeEliminatoryMeetingDb(nm, this.selectedTourney.id,nextEliminatory.id);
            }
        }
    }

    private prepareEliminationMeetingGui(e: Eliminatory, m: Meeting, classificationMap: Map<string, Classification> ): any {
        console.log("Entering prepareEliminationMeetingGui()");

        this.eliminatoryLevelCols = this.prepareResultColums();

        let round: Round = e.round;
        
        let row: any = {m};

        row.meetingIndex = 0;
        row.dateAndTime = this.dfp.transform(m.datetime);
        row.id = m.id;
        row.round = round;
        row.rowNumber = m.direction == Direction.OneWay ? "A" : "R";
        row.roundId = round.id;
        row.eliminatoryId = e.id;    
        
        row.roundName = round.name  + "° Eliminatoria";
        row.teamName1 = m.teamName1;
        row.teamName2 = m.teamName2;
        row.points1 = m.points1;
        row.points2 = m.points2;

        row.goals1 = 0;
        row.goals2 = 0;
        for(let ma of m.matches) {
            row.goals1 += ma.score1;
            row.goals2 += ma.score2;
        }

        if(row.teamName2 == "" || row.teamName1 == "") {
            m.status = MeetingStatus.Terminated;
        }

        let currentKey = round.name;
        if (!classificationMap.has(currentKey)) {
            let len = round.onewayMeetings.length;
            classificationMap.set(currentKey, m);
            row.rowspanSize = len;
        }
        else {
            row.rowspanSize = undefined;
        }
        
        return row;
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.meetingService.selectedMeeting = this.selectedRow;
        
        if( this.selectedRow.isSkiping ) {
            return;
        }

        this.gotoDetailView();
    }
}

