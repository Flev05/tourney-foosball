import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { Round } from '../../../domain/round';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { RoundType } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';


@Component({
    templateUrl: './round-listview.html'
})
export class RoundListView extends AbstractListView {
    static redirect: string = "adminround/lv/dv";

    selectedTourney: Tourney;
    selectedRound: Round;

    rounds: Round [];
    mdbs: MeetingDb[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(RoundListView.redirect, tourneyService, router, location);
    }    

    ngOnInit() {
        super.ngOnInit();

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.rounds = this.tourneyService.selectedTourney.rounds;
        this.tourneyService.newRound = false;
    }

    create() {
        this.selectedRound={id: this.tourneyService.getSequenceNumber(), name: "", type: RoundType.R};
        this.tourneyService.selectedRound = this.selectedRound;
        this.tourneyService.newRound = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        const subscr = this.tourneyService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subscr.subscribe(t => this.mdbs = t, e => this.onError(e), () => this.onComplete());   

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoDetailView();
    }

    onComplete(): void {
        this.selectedRound.meetings = [];
        for(let mdb of this.mdbs) {
            let m: Meeting = JSON.parse(mdb.json);
            this.selectedRound.meetings.push(m);
        }
        this.tourneyService.selectedRound = this.selectedRound;
    }

    onError(n:any) {
        let msgerr : string = 'Meeting reload failed';
        console.log(msgerr);
    }

    goBack(): void {
        this.location.back();
    }
}

