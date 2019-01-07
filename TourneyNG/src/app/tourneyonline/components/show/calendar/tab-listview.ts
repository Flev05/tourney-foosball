import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Round } from 'app/tourneyonline/domain/round';

@Component({
    templateUrl: './tab-listview.html'
})
export class CalendarTabListView extends AbstractEliminatoryListView {
    static tabDvRedirect: string = "calendar/lv/eliminatories";
    activeIndex: any;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(CalendarTabListView.tabDvRedirect, tourneyService, router, location, dfp);
        console.log("Entering CalendarTabListView.constructor()");
    }

    ngOnInit() {
        this.activeIndex = this.tourneyService.selectedTabIndex;

        super.ngOnInit();

        if(super.containsRound()) {
            super.loadRounds(this.selectedTourney.isOnewayRound);
        }

        if(super.containsPlayoff()) {
            super.loadPlayoffs(this.selectedTourney.isOnewayPlayoff);
        }

        if(super.containsEliminatory()) {
            super.loadEliminatoryLevels();
        }
    }
    
    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.activeIndex = index;
        this.tourneyService.selectedTabIndex = this.activeIndex;
    }
    
    protected processEliminationTree(): void {
        super.processEliminationTree();
        
        for(let el of this.selectedTourney.eliminatoryLevels) {
            let allRounds: Array<Round> = new Array<Round>();

            for(let e of el.eliminatories) {
                allRounds.push(e.round);
            }
            
            const eRows = super.prepareEliminatoryRound(allRounds, el.isOneway);
            for(let er of eRows) {
                er.roundName = el.name + " - " + er.roundName;
            }
            this.eliminatoryRows = this.eliminatoryRows.concat(eRows);
        }
    }
    
    /**
     * Specializes the corresponing base method to prepare the meeting list GUI found in the 
     * received list of rounds
     * 
     * @param rounds the list of round containg the meetings
     */
    protected prepareRoundsGui(rounds: Round[], isOneway: boolean): any[] {

        return super.prepareCalendarGui(rounds, isOneway);
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");
      
        this.selectedEliminatoryLevel = this.selectedRow.e;
        this.tourneyService.selectedEliminatoryLevel = this.selectedEliminatoryLevel;
        
        for(let l=0; l<this.selectedTourney.eliminatoryLevels.length; l++) {
            let el = this.selectedTourney.eliminatoryLevels[l];
            if(el.id == this.selectedEliminatoryLevel.id) {
                this.tourneyService.selectedEliminatoryLevelIndex = l;
                this.tourneyService.selectedEliminatoryIndex = -1;
                break;
            }
        }

        this.router.navigate([CalendarTabListView.tabDvRedirect]);
    }
}

