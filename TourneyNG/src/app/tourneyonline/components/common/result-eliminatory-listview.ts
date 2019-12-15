import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { AbstractEliminatoryListView } from './abstract-eliminatory-listview';
import { LevelService } from '../admin/eliminatory/level-service';
import { DateFormatPipe } from './date-format-pipe';

export abstract class ResultEliminatoryListView extends AbstractEliminatoryListView {
    cols: TableCols[] ;
    pageSize: number = 10;
    classificationCols: TableCols[];
    eliminatoryClassification: any[];

    selectedRow: Meeting;
    onewayMeetings: Meeting[];
    roundtripMeetings: Meeting[];
    isRoundTrip: boolean = false;

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
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols;
        
        this.isRoundTrip = this.isOneway == "true" ? false : true;
        this.levelService.loadAllEliminatoryMeetingByIdList(this.selectedTourney.eliminatoryLevels, () => this.onLoadComplete());
    }
    
    onChangeTab(e) {
        let index=e.index;
        this.tourneyService.selectedEliminatoryTabIndex = index;
    }

    private onLoadComplete(): void {
        this.cols = this.tourneyService.resultCols;

        for( let l=0; l < this.selectedTourney.eliminatoryLevels.length; l++ ) {

            let el = this.selectedTourney.eliminatoryLevels[l];
            if( this.isStandAlone(this.selectedTourney) ) {
                if( !el.isTopLevel ) {
                    this.updateDefaultNextLevel( l , el);
                }
            } else {
                if( el.isTopLevel ) {
                    this.resolveNotStadaloneTopLevelRules( el );
                } else {
                    this.updateDefaultNextLevel( l , el);
                }
            }
            for(let elim of el.eliminatories ) {
                this.updateClassification(elim.round);
            }
        }

        this.onewayMeetings    = [];
        this.roundtripMeetings = [];
        this.eliminatoryClassification = [];

        let sel = this.tourneyService.selectedEliminatoryLevel;
        for(let level=0; level < sel.eliminatories.length; level++) {
            let e = sel.eliminatories[level];
            e.round.onewayMeetings.forEach(m => m.containerId = e.id);
            this.onewayMeetings = this.onewayMeetings.concat(e.round.onewayMeetings);

            e.round.roundtripMeetings.forEach( m => m.containerId = e.id);
            this.roundtripMeetings = this.roundtripMeetings.concat(e.round.roundtripMeetings);
            this.eliminatoryClassification = this.eliminatoryClassification.concat(this.tourneyService.prepareRoundsGui([e.round]));
        }
    }

    /**
     * Prepares the classification relatid to the selected eliminaory 
     */
    private updateClassification(round : Round): void {
        let allMeetings = round.onewayMeetings.concat(round.roundtripMeetings);
        round.classification = this.tourneyService.createClassification(allMeetings);
    }

    /**
     * Resolves the rules, not stand alone, defined in the Round and Playoff classifications.
     * For a given position > 0, verify the round and, if doesn't exist, verify the playoff.
     * One of them must contains a valued name, otherwise the configuration was not completed
     */
    private resolveNotStadaloneTopLevelRules(el : EliminatoryLevel ): void {
        let rounds: Array<Round> = new Array<Round>();
        if( this.isPlayoff ) {
            rounds = this.selectedTourney.playoffs.map((p) => {return p.round;});
        } else {
            rounds = [...this.selectedTourney.rounds];
        }

        for(let e of el.eliminatories ) {
            if(e.rule1.fromRound.isAutomatic) {
                this.resolveToplevelAutomatic(e, rounds);
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
    private resolveToplevelAutomatic( e: Eliminatory, rounds: Array<Round> ) {
        let roundMatrix: Array<Array<Classification>> = this.meetingService.createRoundMatrix(rounds);

        let row1 = this.isPlayoff ? e.rule1.fromPlayoff.position.value : e.rule1.fromRound.position.value;
        let col1 = this.isPlayoff ? e.rule1.fromPlayoff.bandPosition   : e.rule1.fromRound.bandPosition;

        let row2 = this.isPlayoff ? e.rule2.fromPlayoff.position.value : e.rule2.fromRound.position.value;  
        let col2 = this.isPlayoff ? e.rule2.fromPlayoff.bandPosition   : e.rule2.fromRound.bandPosition;
        
        for (let m of e.round.onewayMeetings) {
            this.resolveMeetingsRules(m, roundMatrix, row1, col1, row2, col2);
            e.round.teamNames = [m.teamName1, m.teamName2];
        }
        for (let m of e.round.roundtripMeetings) {
            this.resolveMeetingsRules(m, roundMatrix, row2, col2, row1, col1);
        }
    }

    private resolveMeetingsRules(m: Meeting, roundMatrix: Classification[][], row1: number, col1: number, row2: number, col2: number) {
        m.dateAndTime = this.dateFormatPipe.transform(m.datetime, false);
        if (row1 <= 0 || m.isDummy) {
            m.teamName1 = m.rule1.fromRound.round.label;
        } else {
            m.teamName1 = roundMatrix[row1 - 1][col1 - 1].teamName;
        }

        if (row2 <= 0 || m.isDummy) {
            m.teamName2 = m.rule2.fromRound.round.label;
        } else {
            m.teamName2 = roundMatrix[row2 - 1][col2 - 1].teamName;
        }
        m.name = m.teamName1 + " - " + m.teamName2;
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

    /**
     * Updates the next lower level in function of the default position found in received current level
     * 
     * @param el the current eliminatory object
     * @param level the current level
     */
    private updateDefaultNextLevel(l: number, el: EliminatoryLevel) {

        let prevLevelEliminatories: Array<Eliminatory> = new Array<Eliminatory>();
        let prevIndex: number = l-1;
        let position: number = 0;
        if(el.isOptional) { // for 3° and 4° classification position
            if( l < 2 ) {
                return;
            }
            prevIndex = l-2;
            position = 1;
        }
        for( let e of this.selectedTourney.eliminatoryLevels[prevIndex].eliminatories ) {
            prevLevelEliminatories.push(e);
        }

        for(let level=0; level<el.eliminatories.length; level++) {
            let e = el.eliminatories[level];

            let pi : number = level * 2;

            let prevEliminatory1 : Eliminatory = prevLevelEliminatories[pi];
            let team1: string = this.fromClassification(prevEliminatory1, position);

            let prevEliminatory2 : Eliminatory = prevLevelEliminatories[pi+1];
            let team2: string = this.fromClassification(prevEliminatory2, position);

            e.round.teamNames = [team1, team2];

            e.round.onewayMeetings =  [];
            let m1 = this.meetingService.createMeeting(team1, team2, null, null, 1, Direction.OneWay, false);
            e.round.onewayMeetings.push(m1);

            e.round.roundtripMeetings = [];
            let m2 = this.meetingService.createMeeting(team2, team1, null, null, 1, Direction.OneWay, false);
            e.round.roundtripMeetings.push(m2);
        }
    }
    
    private fromClassification(e: Eliminatory, position: number): string {
        return e.round.classification[position].teamName;        
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.meetingService.selectedMeeting = this.selectedRow;
        
        if( this.selectedRow.isSkiping ) {
            return;
        }
        this.meetingService.selectedMeetingDb.eliminatoryId = this.selectedRow.containerId;

        this.gotoDetailView();
    }
}

