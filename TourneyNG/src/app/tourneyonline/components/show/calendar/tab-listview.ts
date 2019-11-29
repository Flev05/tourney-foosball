import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

@Component({
    templateUrl: './tab-listview.html'
})
export class CalendarTabListView extends AbstractEliminatoryListView {
    static tabDvRedirect: string = "calendar/lv/eliminatories";
    activeIndex: any;
    incompletePlayoffConfiguration: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(CalendarTabListView.tabDvRedirect, tourneyService, meetingService, router, location, dfp);
        console.log("Entering CalendarTabListView.constructor()");
    }

    ngOnInit() {
        this.activeIndex = this.selectedTourney.selectedTabIndex;

        super.ngOnInit();

        if(super.containsRound()) {
            this.roundRows = this.selectedTourney.rounds;
        }

        if(super.containsPlayoff()) {
            this.incompletePlayoffConfiguration = false;
            this.playoffRows = this.selectedTourney.playoffs;
            for(let p of this.playoffRows) {
                p.playoffName = p.round.name;
                if( p.playoffRules.length == 0 ) {
                    this.incompletePlayoffConfiguration = true;
                }
            }        
        }
    }
    
    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.activeIndex = index;
        this.selectedTourney.selectedTabIndex = this.activeIndex;
    }
    
    protected processEliminationTree(): void {
        // super.processEliminationTree();
        
        for(let el of this.selectedTourney.eliminatoryLevels) {
            let allRounds: Array<Round> = new Array<Round>();

            for(let e of el.eliminatories) {
                allRounds.push(e.round);
            }
        }
    }
    
    /**
     * Specializes the corresponing base method to prepare the meeting list GUI found in the 
     * received list of rounds
     * 
     * @param rounds the list of round containg the meetings
     */
    protected prepareRoundsGui(rounds: Round[]): any[] {

        return super.prepareCalendarGui(rounds);
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");
      
        this.tourneyService.selectedEliminatoryLevel = this.eliminatoryLevelSelectedRow.eliminatoryLevel;
        
        for(let l=0; l<this.selectedTourney.eliminatoryLevels.length; l++) {
            let el = this.selectedTourney.eliminatoryLevels[l];
            if(el.id == this.tourneyService.selectedEliminatoryLevel.id) {
                this.tourneyService.selectedEliminatoryLevelIndex = l;
                this.tourneyService.selectedEliminatoryIndex = -1;
                break;
            }
        }

        this.router.navigate([CalendarTabListView.tabDvRedirect]);
    }
}

