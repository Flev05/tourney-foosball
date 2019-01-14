import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Round } from 'app/tourneyonline/domain/round';

@Component({
    templateUrl: './tab-listview.html'
})
export class ClassificationTabListView extends AbstractEliminatoryListView {
    static tabDvRedirect: string = "classification/lv/eliminatories";
    activeIndex: any;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(ClassificationTabListView.tabDvRedirect, tourneyService, router, location, dfp);
        console.log("Entering ClassificationTabListView.constructor()");
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

        this.router.navigate([ClassificationTabListView.tabDvRedirect]);
    }
}

