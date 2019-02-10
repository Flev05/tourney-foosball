import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RoundType } from 'app/tourneyonline/domain/enumerations';
import { Message } from 'primeng/api';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from '../../common/abstract-listview';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './playoff-listview.html'
})
export class PlayoffListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRuleLv";
    
    msgs: Message[] = [];
    selectedTourney: Tourney;
    selectedPlayoff: Playoff;
    playoffs: any[];
    playoffRows: Playoff[];

    atLeastOnePlayoff: boolean;
    displayDialog: boolean;
    newRound: Playoff;
    newPlayoff: boolean;

    playoffCols: TableCols[] = TourneyService.playoffCols;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(PlayoffListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.playoffs = this.selectedTourney.playoffs;
        this.newPlayoff = false;
   
        this.atLeastOnePlayoff = this.selectedTourney.rounds.length > 0;
        for(let p of this.playoffs) {
            p.playoffName = p.round.name;
        }
    }

    showDialogToAdd() {
        this.newPlayoff = true;
        this.displayDialog = true;

        this.newRound = {
              id:this.tourneyService.getSequenceNumber()
            , round:{id: this.tourneyService.getSequenceNumber()
                , name: ""
                , type: RoundType.P
                , teams:[]
                , onewayMeetings: []
                , classification: []
              }
            , playoffRules: null
        };
    }

    save() {

        this.displayDialog = false;
        if(this.newRound.round.name != "") {
            let pls = [...this.playoffs];
            
            if (this.newPlayoff) {
                pls.push(this.newRound);
            } else {
                const index = this.playoffs.indexOf(this.selectedPlayoff);
                if(index > -1) {
                    pls[index] = this.newRound;
                }
            }
            this.playoffs = pls;
        }

        this.newRound = null;
        this.newPlayoff = false;
        
        this.selectedTourney.playoffs = this.playoffs;
    }

    onRowSelect(event) {
        let playoff= event.data;
    }

    doDelete(playoff: Playoff) {
        this.tourneyService.doPlayoffDelete(playoff);
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiunta configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

