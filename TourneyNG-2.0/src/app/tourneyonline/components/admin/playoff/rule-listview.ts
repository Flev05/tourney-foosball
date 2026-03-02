import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from '../../../components/common/abstract-listview';
import { TourneyService } from '../../../service/tourney-service';
import { Playoff } from '../../../domain/playoff';
 
import { Meeting } from '../../../domain/meeting';
import { TableCols } from '../../../domain/table-cols';
import { Combobox } from '../../../domain/tourney-combobox';
import { PlayoffRule } from '../../../domain/playoff-rule';
import { ClientService } from '../../../service/client-service';
import { TourneyVO } from '../../../domain/tourney.vo';

@Component({
    templateUrl: './rule-listview.html'
})
export class RuleListView extends AbstractListView {
    static redirectToMeeting: string = "adminplayoff/lv/meetingLv";

    playoffRules: PlayoffRule[] = [];
    selectedPlayoff: Playoff = new Playoff();
    selectedPlayoffConfig: PlayoffRule = new PlayoffRule(); 

    atLeast2Rules: boolean = false;
    atLeast1Rule: boolean = false;
    mdbs: Meeting[] = [];

    positions: Combobox[] = [];
    rounds: Combobox[] = [];

    isAutoGen: boolean = true;
    playoffCols: TableCols[] = [];

    constructor(
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location,
        private clientService: ClientService
    ) {
        super("", tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();
        
        if(this.tourneyService.selectedPlayoff != null ) {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        } else {
            if(this.tourneyService.selectedPlayout != null ) {
                this.selectedPlayoff = this.tourneyService.selectedPlayout;
            }        
        }
        this.tourneyService.prepareDefaultComboBoxes();
        
        this.playoffRules = this.selectedPlayoff.playoffRules;

        this.atLeast1Rule = this.playoffRules != null && this.playoffRules.length >= 0 ? true: false;
        this.atLeast2Rules = this.playoffRules != null && this.playoffRules.length >= 2 ? true: false;

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds    = this.tourneyService.roundsCombobox;

        this.isAutoGen = this.selectedTourney.playoffVO.isPlayoffAutoGen == "true" ? true : false;
        if(this.tourneyService.selectedPlayoff == null ) {
            this.isAutoGen = this.selectedTourney.playoutVO.isPlayoffAutoGen == "true" ? true : false;
        }
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
 
    override onError(n:any) {
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        console.error(msgerr);
    }
    
    savePlayoff(): void {
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => this.goBack());
    }
}

