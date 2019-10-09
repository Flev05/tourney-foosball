import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { AbstractListView } from '../../common/abstract-listview';
import { LevelService } from './level-service';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { EliminatoryVO } from 'app/tourneyonline/domain/eliminatory.vo';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './eliminatory-full-listview.html'
})
export class FullEliminatoryListView extends AbstractListView {
    selectedEliminatoryLevel:  EliminatoryLevel;
    eliminatoryRows:  EliminatoryVO[];
    eliminatoryCols: TableCols[];
    isOneway: string;
    isAutoGen: string;

    constructor(
        protected tourneyService: TourneyService,
        protected levelService: LevelService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(LevelService.manualRedirectDV, tourneyService,   router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
        this.levelService.ngOnInit();
        this.isAutoGen  = this.selectedEliminatoryLevel.isAutoGen == undefined ? "true" : this.selectedEliminatoryLevel.isAutoGen;
        this.levelService.isAutomatic = this.isAutoGen == "true" ? true : false;
        this.levelService.prepareGui();
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
        this.isOneway  = this.levelService.isOneway;
    }
 
    getPosition1(e: Eliminatory): string {
        let position1 = e.rule1.fromRound.position.value > 0 ? e.rule1.fromRound.position.label : e.rule1.fromPlayoff.position.label;
        return position1;
    }

    getPosition2(e: Eliminatory): string {
        let position2 = e.rule2.fromRound.position.value > 0 ? e.rule2.fromRound.position.label : e.rule2.fromPlayoff.position.label;
        return position2;
    }

    onEliminatoryRowSelect(event) {
        console.log("Entering onEliminatoryRowSelect()");
        console.log(event);

        this.tourneyService.selectedEliminatory = event.data.eliminatory;
        this.levelService.eliminatorySelectedRow = event.data;

        this.router.navigate([LevelService.manualRedirectDV]);
    }

    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.levelService.onOnewayClick();
        this.isOneway = this.levelService.isOneway;
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.levelService.onRoundtripClick();
        this.isOneway = this.levelService.isOneway;
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }
    onAutoGenClick() {
        console.log("Entering onAutoGenClick()");
        let isAuto = this.isAutoGen == "true" ? true : false;
        this.selectedEliminatoryLevel.isAutoGen = this.isAutoGen;
        let teamNo = this.selectedTourney.selectedEliminatoryTeamsCB.value;
        this.levelService.prepareAutomaticEliminatoryRules(teamNo, isAuto);
        this.ngOnInit();
    }

    onManualGenClick() {
        console.log("Entering onManualGenClick()");
        let isAuto = this.isAutoGen == "false" ? false : true;
        this.selectedEliminatoryLevel.isAutoGen = this.isAutoGen;
        let teamNo = this.selectedTourney.selectedEliminatoryTeamsCB.value;
        this.levelService.prepareAutomaticEliminatoryRules(teamNo, isAuto);
        this.ngOnInit();
    }
}

