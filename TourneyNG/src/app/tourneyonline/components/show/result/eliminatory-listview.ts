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

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractEliminatoryListView {
    static autoRedirect: string = 'result/lv/meetingLv/dv';
    
    selectedMeetingRow: any;
    incompleteConfiguration: boolean;
    incompleteMessage: string;
    cols: TableCols[] ;

    constructor(
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(EliminatoryListView.autoRedirect, tourneyService, meetingService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();

        this.incompleteMessage = "Attenzione! Le regole per il passaggio del turno alle eliminazioni dirette non sono complete!";
        this.incompleteConfiguration = this.selectedTourney.wizardModeIndex != -1;
        this.resolveRules();
    }
    
    private resolveRules(): void {
        this.cols = this.tourneyService.resultCols;

        this.incompleteConfiguration = false;
        if(this.isTopLevel) {
            if( this.isStandAlone(this.selectedTourney) ) {
                for(let level=0; level<this.eliminatories.length; level++) {
                    let e = this.eliminatories[level];
                    this.updateDefaultNextLevel(e, level);
                }
            } else {
                this.resolveNotStadaloneRules();
            }
        } else {
            this.incompleteConfiguration = true;
            this.incompleteMessage = "Attenzione! Non è stato giocato alcun incontro del livello precedente!";
            for(let e of this.tourneyService.selectedEliminatoryLevel.eliminatories) {
                if(e.round.teamNames[0] != "" || e.round.teamNames[1] != "") {
                    this.incompleteConfiguration = false;
                    break;
                }
            }
            if(this.incompleteConfiguration) {
                return;
            }
        }

        this.eliminatoryRows = [];
        for(let level=0; level<this.eliminatories.length; level++) {
            let e = this.eliminatories[level];
            let classificationMap: Map<string, Classification> = new Map<string, Classification>();

            let m: Meeting = e.round.onewayMeetings[0];
            let row = this.prepareEliminationMeetingGui(e, m, classificationMap);
            this.eliminatoryRows = this.eliminatoryRows.concat(row);
            if(this.selectedEliminatoryLevel.direction == Direction.RoundTrip) {
                m = e.round.roundtripMeetings[0];
                row = this.prepareEliminationMeetingGui(e, m, classificationMap);
                this.eliminatoryRows.push(row);
            }
        }
    }

    /**
     * Resolves the rules, not stand alone, defined in the Round and Playoff classifications.
     * For a given position > 0, verify the round and, if doesn't exist, verify the playoff.
     * One of them must contains a valued name, otherwise the configuration was not completed
     */
    private resolveNotStadaloneRules(): void {
        this.incompleteConfiguration = false;

        for(let level=0; level<this.eliminatories.length; level++) {
            let e = this.eliminatories[level];

            if(e.rule1.fromRound.isAutomatic) {
                this.resolveAutomatic(e);
            } else {
                this.resolveManual(e);
            }

            if(this.tourneyService.selectedEliminatoryLevelIndex >= 2) {
                continue;
            }

            this.updateDefaultNextLevel(e, level);
        }
    }

    /**
     * Resolves the rules related to the eliminatories configurated in automatic mode.
     * In function of the classification reached in the previous rounds or playoffs, the method
     * finds the teams that gained the right for the direct eliminations
     */
    private resolveAutomatic(e: Eliminatory) {
        let rounds: Array<Round> = new Array<Round>();
        if( this.isPlayoff ) {
            for(let p of this.selectedTourney.playoffs) {
                rounds.push(p.round);
            }
        } else {
            rounds = [...this.selectedTourney.rounds];
        }

        rounds = this.paddingRounds(rounds);

        let roundMatrix: Array<Array<Classification>> = this.tourneyService.createRoundMatrix(rounds);

        let col1  = e.rule1.fromRound.bandPosition;
        let row1  = e.rule1.fromRound.position.value;
        let team1 = roundMatrix[row1-1][col1-1].teamName;

        let col2  = e.rule1.fromRound.bandPosition;
        let row2  = e.rule1.fromRound.position.value;
        let team2 = roundMatrix[row2-1][col2-1].teamName;

        let onewayMeeting:    Meeting = this.meetingService.newMeeting(team1, team2, 1, Direction.OneWay, false);
        let roundtripMeeting: Meeting = this.meetingService.newMeeting(team2, team1, 1, Direction.RoundTrip, false);

        e.round.onewayMeetings =    [onewayMeeting];
        e.round.roundtripMeetings = [roundtripMeeting];
    }

    /**
     * Resolves the rules related to the eliminatories configurated in manual mode.
     * In function of the classification reached in the previous rounds or playoffs, the method
     * finds the teams that gained the right for the direct eliminations
     */
    private resolveManual(e: Eliminatory) {
        let fr1 = e.rule1.fromRound;
        let fp1 = e.rule1.fromPlayoff;
                   
        let pr1 = fr1.position.value;
        let pp1 = fp1.position.value;
        if( (pr1 <= 0 && pp1 <= 0) || (fr1.round.value <= 0 && fp1.round.value <= 0)) {
            this.incompleteConfiguration = true;
            return;
        }

        let fr2 = e.rule2.fromRound;
        let fp2 = e.rule2.fromPlayoff;
        let pr2 = fr2.position.value;
        let pp2 = fp2.position.value;

        if( (pr2 <= 0 && pp2 <= 0) || (fr2.round.value <= 0 && fp2.round.value <= 0)) {
            this.incompleteConfiguration = true;
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
     * @param e the current eliminatory object
     * @param level the current level
     */
    private updateDefaultNextLevel(e: Eliminatory, level: number) {
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

        this.tourneyService.selectedRound = this.selectedMeetingRow.round;

        let m: Meeting = this.selectedMeetingRow.round.meetings[this.selectedMeetingRow.meetingIndex];

        let mdb = this.meetingService.completeEliminatoryMeetingDb(m
            , this.selectedTourney.id
            , this.selectedMeetingRow.eliminatoryId
        );
        this.meetingService.selectedMeetingDb = mdb;

        for(let level=0; level<this.eliminatories.length; level++) {
            let e = this.eliminatories[level];
            if(e.id == this.selectedMeetingRow.eliminatoryId) {
                this.tourneyService.selectedEliminatoryIndex = level;
                break;
            }
        }

        this.router.navigate([MeetingDetailView.meetingDvRedirect]);
    }
}

