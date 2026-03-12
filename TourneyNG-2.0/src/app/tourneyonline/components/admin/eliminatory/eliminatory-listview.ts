import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { LevelService } from './level-service';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { EliminatoryVO } from 'app/tourneyonline/domain/eliminatory.vo';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';

@Component({
    templateUrl: './eliminatory-listview.html',
    standalone: false
})
export class EliminatoryListView extends AbstractListView {
    selectedEliminatoryLevel:  EliminatoryLevel = new EliminatoryLevel();
    eliminatoryRows:  EliminatoryVO[] = [];
    eliminatoryCols: TableCols[] = [];
    
    constructor(
        public override tourneyService: TourneyService,
        public levelService: LevelService,
        protected override router: Router,
        protected override location: Location,
        protected dfp: DateFormatPipe,
        protected clientService: ClientService,
    ) {
        super(LevelService.manualRedirectDV, tourneyService,  router, location);
    }

    override ngOnInit() {
        console.log("FullEliminatoryListView.ngOnInit()");
        super.ngOnInit();
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        this.levelService.prepareGui();
        
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }
 
    getPosition1(e: Eliminatory): string {
        // let position1 = e.rule1.fromRound.position.value > 0 ? e.rule1.fromRound.position.label : e.rule1.fromPlayoff.position.label;
        // return position1;
        return "0";
    }

    getPosition2(e: Eliminatory): string {
        // let position2 = e.rule2.fromRound.position.value > 0 ? e.rule2.fromRound.position.label : e.rule2.fromPlayoff.position.label;
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

        this.router.navigate([LevelService.manualRedirectDV]);
    }

    onOnewayClick() {
        this.levelService.onOnewayClick();
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }

    onRoundtripClick() {
        this.levelService.onRoundtripClick();
        this.eliminatoryRows = this.levelService.eliminatoryRows;
        this.eliminatoryCols = this.levelService.eliminatoryCols;
    }
 
    onEliminatorySpinnerChange(event : any) {
        let spin = this.selectedEliminatoryLevel.abstractRoundVO.maxMatchesPerMeeting;
        if(spin == 1 || spin == 2) {
            this.selectedEliminatoryLevel.abstractRoundVO.allMatchesEnabled = false;
        } else {
            this.selectedEliminatoryLevel.abstractRoundVO.allMatchesEnabled = true;
        }
        this.selectedEliminatoryLevel.abstractRoundVO.bestOfWinner = spin;
    }

    onAllEliminatoryMatchesClick() {
        this.selectedEliminatoryLevel.abstractRoundVO.isAllMatches = "true";
    }

    save() {
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);

        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () => this.goBack());
    }
}

