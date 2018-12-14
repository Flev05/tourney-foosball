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

                if(position > 0) {
                    let roundName = fr.round.label;
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
                    let position = fp.position.value;
                    if(position > 0) {
                        let roundName = fp.round.label;
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
                if(position > 0) {
                    let roundName = fr.round.label;
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
                    let position = fp.position.value;
                    if(position > 0) {
                        let roundName = fp.round.label;
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

        let rounds: Array<Round> = new Array<Round>();

        for(let e of this.eliminatories) {
            rounds.push(e.round);
        }

        this.eliminatoryRows = super.prepareEliminatoryGui(rounds);
        super.processEliminationTree();
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");

        this.tourneyService.selectedRound = this.selectedMeetingRow.round;

        if(this.selectedEliminatory.round.meetings) {

        }
        let m: Meeting = this.selectedEliminatory.round.meetings[0];

        let mdb: MeetingDb = this.tourneyService.prepareMdb(m
            , this.selectedTourney.id
            , 0
            , 0
            , this.selectedEliminatory.id
        );
        this.tourneyService.selectedMeetingDb = mdb;

        this.router.navigate([MeetingDetailView.meetingDvRedirect]);
    }
}

