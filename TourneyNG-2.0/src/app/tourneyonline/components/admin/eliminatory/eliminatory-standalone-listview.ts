import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from '../../../service/tourney-service';
import { DateFormatPipe } from '../../../components/common/date-format-pipe';
import { Eliminatory } from '../../../domain/eliminatory';
import { AbstractListView } from '../../../components/common/abstract-listview';
import { LevelService } from './level-service';
import { EliminatoryLevel } from '../../../domain/eliminatory-level';
import { EliminatoryVO } from '../../../domain/eliminatory.vo';
import { TableCols } from '../../../domain/table-cols';

@Component({
    templateUrl: './eliminatory-standalone-listview.html',
    standalone: false
})
export class StandaloneEliminatoryListView extends AbstractListView {

    selectedEliminatoryLevel:  EliminatoryLevel = new EliminatoryLevel();
    eliminatoryRows: EliminatoryVO[] = [];
    eliminatoryCols: TableCols[] = [];
    
    constructor(
        public override tourneyService: TourneyService,
        public levelService: LevelService,
        protected override router: Router,
        protected override location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(LevelService.autoRedirect, tourneyService, router, location);
    }
 
    override ngOnInit() {
        super.ngOnInit();
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
        this.levelService.prepareGui();
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }
    
    getPosition1(e: Eliminatory): string {
        // let position1 = e.rule1.fromRound.position.label;
        // return position1;
        return "0";
    }

    getPosition2(e: Eliminatory): string {
        // let position2 = e.rule2.fromRound.position.label;
        // return position2;
        return "0";
    }

    onEliminatoryRowSelect(event : any) {
        console.log("Entering onEliminatoryRowSelect()");
        console.log(event);

        this.tourneyService.selectedEliminatory = event.data.eliminatory;
        if(this.tourneyService.selectedEliminatory.isSkiping) {
            return;
        }

        this.levelService.eliminatorySelectedRow = event.data;
        this.router.navigate([LevelService.autoRedirect]);
    }
    
    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.levelService.onOnewayClick();
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.levelService.onRoundtripClick();
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }
}

