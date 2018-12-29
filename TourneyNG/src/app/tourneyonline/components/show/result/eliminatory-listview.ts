import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { Classification } from 'app/tourneyonline/domain/classification';
import { MeetingDetailView } from './meeting-detailview';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { DateFormatPipe } from '../../common/date-format-pipe';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractEliminatoryListView {
    static autoRedirect: string = 'result/lv/meetingLv/dv';
    
    selectedMeetingRow: any;
    incompleteConfiguration: boolean;
    incompleteMessage: string;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(EliminatoryListView.autoRedirect, tourneyService, router, location, dfp);
    }
            
    /**
        <th>N°</th>
        <th>Squadra 1</th>
        <th>Squadra 2</th>
        <th>Pt.1</th>
        <th>Pt.2</th>

        <td>{{rowData.rowNumber}}</td>                
        <td>{{rowData.teamName1}}</td>
        <td>{{rowData.teamName2}}</td>
        <td>{{rowData.points1}}</td>
        <td>{{rowData.points2}}</td>
     */
    ngOnInit() {
        super.ngOnInit();

        this.incompleteMessage = "Attenzione! Le regole per il passaggio del turno alle eliminazioni dirette non sono complete!";
        this.incompleteConfiguration = true;

        super.loadEliminatoryLevels();
    }
    
    protected processEliminationTree(): void {
        
        if(this.isTopLevel) {
            if(!this.isStandalone) {
                this.resolveNotStadaloneRules();
            } else {
                for(let level=0; level<this.eliminatories.length; level++) {
                    let e = this.eliminatories[level];
                    this.updateDefaultNextLevel(e, level);
                }
            }
        } else {
            this.incompleteConfiguration = true;
            this.incompleteMessage = "Attenzione! Non è stato giocato alcun incontro del livello precedente!";
            for(let e of this.tourneyService.selectedEliminatoryLevel.eliminatories) {
                if(e.round.teams[0].teamName != "" || e.round.teams[1].teamName != "") {
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

            let row = this.prepareEliminationMeetingGui(e, 0, classificationMap);
            this.eliminatoryRows = this.eliminatoryRows.concat(row);
            if(!this.selectedEliminatoryLevel.isOneway) {
                row = this.prepareEliminationMeetingGui(e, 1, classificationMap);
                this.eliminatoryRows.push(row);
            }
        }
        super.processEliminationTree();
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

            let m1 = e.round.meetings[0];
            let m2 = e.round.meetings[1];

            let classification: Array<Classification> = null;

            if(pr1 > 0 && fr1.round.value > 0) {
                let roundName = fr1.round.label;
                for(let r of this.selectedTourney.rounds) {
                    if(r.name == roundName) {
                        classification = r.classification;
                        m1.team1 = classification[pr1-1].team;
                        break;
                    }
                }
            } else {
                let roundName = fp1.round.label;
                for(let p of this.selectedTourney.playoffs) {
                    if(p.round.name == roundName) {
                        classification = p.round.classification;
                        m1.team1 = classification[pp1-1].team;
                        break;
                    }
                }
            }
            
            if(pr2 > 0 && fr2.round.value > 0) {
                let roundName = fr2.round.label;
                for(let r of this.selectedTourney.rounds) {
                    if(r.name == roundName) {
                        classification = r.classification;
                        m1.team2 = classification[pr2-1].team;
                        break;
                    }
                }
            } else {
                let roundName = fp2.round.label;
                for(let p of this.selectedTourney.playoffs) {
                    if(p.round.name == roundName) {
                        classification = p.round.classification;
                        m1.team2 = classification[pp2-1].team;
                        break;
                    }
                }
            }

            e.round.teams[0] = m1.team1;
            e.round.teams[1] = m1.team2;
            m2.team1 = m1.team2;
            m2.team2 = m1.team1;

            if(this.tourneyService.selectedEliminatoryLevelIndex >= 2) {
                continue;
            }

            this.updateDefaultNextLevel(e, level);
        }
    }

    /**
     * Updates the lower level in function of the default position found in received current level
     * 
     * @param e the current eliminatory object
     * @param level the current level
     */
    private updateDefaultNextLevel(e: Eliminatory, level: number) {
        if (e.round.teams[0].teamName != "" && e.round.teams[1].teamName == "") {
            const els = this.selectedTourney.eliminatoryLevels;

            let nextEliminatoryLevelIndex = this.tourneyService.selectedEliminatoryLevelIndex + 1;
            let nextEliminatoryLevel: EliminatoryLevel = els[nextEliminatoryLevelIndex];
            let nextEliminatoryIndex: number = Math.floor(level / 2);
            let nextEliminatory: Eliminatory = nextEliminatoryLevel.eliminatories[nextEliminatoryIndex];
            
            let nr = nextEliminatory.round;
            let nm = nr.meetings[0];

            if (level % 2 == 0) {
                nm.team1 = e.round.teams[0];
                nr.teams[0] = e.round.teams[0];
            } else {
                nm.team2 = e.round.teams[0];
                nr.teams[1] = e.round.teams[0];
            }
            let mdb: MeetingDb = this.tourneyService.prepareMdb(nm, this.selectedTourney.id, 0, 0, nextEliminatory.id);
            this.tourneyService.updateMeeting(mdb).subscribe(n => this.next(n), e => this.onError(e));
        }
    }

    private prepareEliminationMeetingGui(e: Eliminatory, meetingIndex: number, classificationMap: Map<string, Classification> ): any {

        this.cols = this.prepareResultColums();

        let round: Round = e.round;
        let m: Meeting = round.meetings[meetingIndex];

        let row: any = {m};

        row.meetingIndex = meetingIndex;
        row.dateAndTime = this.dfp.transform(m.datetime);
        row.id = m.id;
        row.round = round;
        row.rowNumber = meetingIndex == 0 ? "A" : "R";
        row.roundId = round.id;
        row.eliminatoryId = e.id;    
        
        row.roundName = round.name  + "° Eliminatoria";
        row.teamName1 = m.team1.teamName;
        row.teamName2 = m.team2.teamName;
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
            let len = round.meetings.length;
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

        let mdb: MeetingDb = this.tourneyService.prepareMdb(m
            , this.selectedTourney.id
            , 0
            , 0
            , this.selectedMeetingRow.eliminatoryId
        );
        this.tourneyService.selectedMeetingDb = mdb;

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

