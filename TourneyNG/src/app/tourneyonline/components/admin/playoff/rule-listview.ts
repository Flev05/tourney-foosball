import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
 
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

@Component({
    templateUrl: './rule-listview.html'
})
export class RuleListView extends AbstractListView {
    static redirectToMeeting: string = "adminplayoff/lv/meetingLv";

    playoffRules: PlayoffRule[];

    selectedPlayoff: Playoff;
 
    selectedPlayoffConfig: PlayoffRule; 

    atLeast2Rules: boolean;
    atLeast1Rule: boolean;
    mdbs: Meeting[];

    positions: Combobox[];
    rounds: Combobox[];

    isAutoGen: boolean;
    playoffCols: TableCols[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.tourneyService.prepareDefaultComboBoxes();
        
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffRules = this.selectedPlayoff.playoffRules;

        this.atLeast1Rule = this.playoffRules != null && this.playoffRules.length >= 0 ? true: false;
        this.atLeast2Rules = this.playoffRules != null && this.playoffRules.length >= 2 ? true: false;

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds    = this.tourneyService.roundsCombobox;

        this.isAutoGen = this.selectedTourney.playoffVO.isPlayoffAutoGen == "true" ? true : false;
        if(this.isAutoGen) {
            this.playoffCols  = [
                { field: 'ruleName',    header: 'Regola' },
            ];
        } else {
            this.playoffCols  = [
                { field: 'position', header: 'Classificata' },
                { field: 'round',    header: 'Girone' },
            ];
        }
    }

    goMeeting() {
        this.router.navigate([RuleListView.redirectToMeeting]);
    }
 
    onError(n:any) {
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        console.error(msgerr);
    }
}

