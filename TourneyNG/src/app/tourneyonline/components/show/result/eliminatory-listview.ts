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
import { ReorderableColumn } from 'primeng/table';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractEliminatoryListView {
    static autoRedirect: string = 'result/lv/meetingLv/dv';
    
    selectedMeetingRow: any;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(EliminatoryListView.autoRedirect, tourneyService, router, location);
    }
    
    ngOnInit() {
        super.ngOnInit();

        this.processEliminationTree();
    }
    
    protected processEliminationTree(): void {

        if(!this.isStandalone && this.isTopLevel) {
            for(let e of this.eliminatories) {
                let fr = e.rule1.fromRound;
                let position = fr.position.value;

                let m = e.round.meetings[0];

                let roundName = fr.round.label;
                if(position > 0 && roundName != "") {
                    let classification: Array<Classification>;
                    for(let r of this.selectedTourney.rounds) {
                        if(r.name == roundName) {
                            classification = r.classification;
                            break;
                        }
                    }
                    m.team1 = classification[position-1].team;
                } else {
                    let fp = e.rule1.fromPlayoff;
                    position = fp.position.value;
                    roundName = fp.round.label;
                    if(position > 0 && roundName != "") {
                        let classification: Array<Classification>;
                        for(let p of this.selectedTourney.playoffs) {
                            if(p.round.name == roundName) {
                                classification = p.round.classification;
                                break;
                            }
                        }
                        m.team1 = classification[position-1].team;
                    } else {
                        m.team1 = this.newDummyTeam();
                    }
                }

                fr = e.rule2.fromRound;
                position = fr.position.value;
                roundName = fr.round.label;
                if(position > 0 && roundName != "") {
                    let classification: Array<Classification>;
                    for(let r of this.selectedTourney.rounds) {
                        if(r.name == roundName) {
                            classification = r.classification;
                            break;
                        }
                    }
                    m.team2 = classification[position-1].team;
                } else {
                    let fp = e.rule2.fromPlayoff;
                    position = fp.position.value;
                    roundName = fp.round.label;
                    if(position > 0 && roundName != "") {
                        let classification: Array<Classification>;
                        for(let p of this.selectedTourney.playoffs) {
                            if(p.round.name == roundName) {
                                classification = p.round.classification;
                                break;
                            }
                        }
                        m.team2 = classification[position-1].team;
                    } else {
                        m.team2 = this.newDummyTeam();
                    }
                }

                e.round.meetings[1].team1 = m.team2;
                e.round.meetings[1].team2 = m.team1;
            }
        }

        this.eliminatoryRows = [];
        for(let level=0; level<this.eliminatories.length; level++) {
            let e = this.eliminatories[level];
            let classificationMap: Map<string, Classification> = new Map<string, Classification>();

            let row = this.prepareEliminatoryMeetingGui(e, 0, classificationMap);
            this.eliminatoryRows = this.eliminatoryRows.concat(row);
            if(!this.selectedEliminatoryLevel.isOneway) {
                row = this.prepareEliminatoryMeetingGui(e, 1, classificationMap);
                this.eliminatoryRows.push(row);
            }
        }
        super.processEliminationTree();
    }

    private prepareEliminatoryMeetingGui(e: Eliminatory, meetingIndex: number,classificationMap: Map<string, Classification> ): any {
        let round: Round = e.round;
        let m: Meeting = round.meetings[meetingIndex];

        let row: any = {m};

        row.meetingIndex = meetingIndex;
        row.id = m.id;
        row.round = round;
        row.roundNo = meetingIndex == 0 ? "A" : "R";
        row.roundId = round.id;
        row.eliminatoryId = e.id;    
        
        row.roundName = round.name;
        row.teamName1 = m.team1.teamName;
        row.teamName2 = m.team2.teamName;
        row.points1 = m.points1;
        row.points2 = m.points2;

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

        this.router.navigate([MeetingDetailView.meetingDvRedirect]);
    }
}

