import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Round } from 'app/tourneyonline/domain/round';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractListView } from '../../common/abstract-listview';

@Component({
    templateUrl: './result-listview.html'
})
export class ResultListView extends AbstractListView {
    static meetingLvRedirect:   string = "result/lv/meetingLv";
    static eliminatoryRedirect: string = 'result/lv/eliminatoryLv/dv';

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

        this.playoffs = this.comletePlayoff(this.selectedTourney.playoffs);

        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
    }

    comletePlayoff(playoffs: Playoff[]): Playoff[] {
        let pls : Playoff[] = [];
        for(let p of playoffs) {
            if(p.playoffRules==undefined) {
                continue;
            }

            p.round.teams = [];
            
            for(let rule of p.playoffRules) {
                let pos = rule.fromRound.position.value;
                let label = rule.fromRound.round.label;
                let round: Round = null;
                for(let r of this.selectedTourney.rounds) {
                    if(r.name == label) {
                        round = r;
                        break;
                    }
                }
                if(round != null && round.classification.length > 0) {
                    let c = round.classification[pos];
                    let team = c.team;
                    p.round.teams.push(team);
                    pls.push(p);
                }
            }
        }
        return pls;
    }

    onRoundSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedRound = this.selectedRound;

        this.gotoMeetingListView();
    }

    onPlayoffSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedPlayoff = this.selectedPlayoff;

        this.gotoMeetingListView();
    }
    
    private gotoMeetingListView() {
        this.router.navigate([ResultListView.meetingLvRedirect]);
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

