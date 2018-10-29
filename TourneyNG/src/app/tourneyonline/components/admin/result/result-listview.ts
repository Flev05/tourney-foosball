import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';
import { Eliminatory } from '../../../domain/eliminatory';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';


@Component({
    templateUrl: './result-listview.html'
})
export class ResultListView extends AbstractListView {
    static meetingLvRedirect:   string = "adminresult/lv/meetingLv";
    static eliminatoryRedirect: string = '/adminresult/lv/eliminatoryLv/dv';

    selectedPlayoff: Playoff;
    selectedRound: Round;

    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;

    rounds: Round[];
    playoffs: Playoff[];
    eliminatories: Eliminatory[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(ResultListView.meetingLvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.rounds = this.selectedTourney.rounds;
        this.playoffs = this.selectedTourney.playoffs;

        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
    }

    onRoundSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoMeetingListView();
    }

    private gotoMeetingListView() {
        this.router.navigate([ResultListView.meetingLvRedirect]);
    }

    onPlayoffSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedPlayoff.round;

        this.gotoMeetingListView();
    }
    
    onEliminatoryRowSelect(event) {
        console.log("Entering onRowSelect()");
      
        this.tourneyService.selectedEliminatoryLevel = this.selectedEliminatoryLevel;

        this.router.navigate([ResultListView.eliminatoryRedirect]);
    }

    goBack(): void {
        this.location.back();
    }
}

