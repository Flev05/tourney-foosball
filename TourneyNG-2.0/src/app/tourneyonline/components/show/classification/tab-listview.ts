import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractEliminatoryListView } from 'app/tourneyonline/components/common/abstract-eliminatory-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

@Component({
    templateUrl: './tab-listview.html'
})
export class ClassificationTabListView extends AbstractEliminatoryListView {
    static tabDvRedirect: string = "classification/lv/eliminatories";
    activeIndex: any;
    incompletePlayoffConfiguration: boolean = true;
    selectedTabIndex: number = 0; 

    constructor(
        protected override tourneyService: TourneyService,
        protected override meetingService: MeetingService,
        protected override router: Router,
        protected override location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(ClassificationTabListView.tabDvRedirect, tourneyService, meetingService, router, location, dfp);
        console.log("Entering ClassificationTabListView.constructor()");
    }

    override ngOnInit() {
        this.activeIndex = this.selectedTabIndex;

        super.ngOnInit();

        if(super.containsRound()) {
            // super.loadRounds();
        }

        if(super.containsPlayoff()) {
            // super.loadPlayoffs();

            this.incompletePlayoffConfiguration = false;
            this.playoffRows = this.selectedTourney.playoffVO.playoffs;
            for(let p of this.playoffRows) {
                p.playoffName = p.round.name;
                if( p.playoffRules.length == 0 ) {
                    this.incompletePlayoffConfiguration = true;
                }
            }
        }
    }
    
    override onChangeTab(e : any) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.activeIndex = index;
        this.selectedTabIndex = this.activeIndex;
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

    onEliminatoryRowSelect(event : any) {
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

        this.router.navigate([ClassificationTabListView.tabDvRedirect]);
    }
}

