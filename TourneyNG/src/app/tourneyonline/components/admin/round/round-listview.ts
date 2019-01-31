import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from '../../common/abstract-listview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './round-listview.html'
})
export class RoundListView extends AbstractListView {
    static redirect: string = "adminround/lv/dv";

    selectedTourney: Tourney;
    selectedRound: Round;

    rounds: Round [];
    roundCols: TableCols[] = TourneyService.roundCols;

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
        this.roundCols = TourneyService.roundCols;
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
        for(let m of this.mdbs) {
            this.selectedRound.meetings.push(m);
        }
        this.tourneyService.selectedRound = this.selectedRound;
    }

    add() {
        this.tourneyService.newRound = true;
        this.tourneyService.selectedIndex = 0;
        this.router.navigate([RoundListView.redirect]);
    }

    doDelete(round: Round) {
        this.tourneyService.doRoundDelete(round);
    }

    onError(n:any) {
        let msgerr : string = 'Meeting reload failed';
        console.log(msgerr);
    }

    goBack(): void {
        this.location.back();
    }
}

