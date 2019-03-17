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
import { Observable, of } from 'rxjs';

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
    newRoundPlayoff: Playoff;
    newPlayoff: boolean;

    playoffCols: TableCols[] = TourneyService.playoffCols;
    onDeletePlayoffError: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(PlayoffListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.onDeletePlayoffError = false;

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

        this.newRoundPlayoff = {
              id:this.tourneyService.getSequenceNumber()
            , round:{id: this.tourneyService.getSequenceNumber()
                , name: ""
                , type: RoundType.P
                , teams:[]
                , onewayMeetings: []
                , roundtripMeetings: []
                , classification: []
              }
            , playoffRules: null
        };
    }

    save() {

        this.displayDialog = false;
        if(this.newRoundPlayoff.round.name != "") {
            let pls = [...this.playoffs];
            
            if (this.newPlayoff) {
                pls.push(this.newRoundPlayoff);
            } else {
                const index = this.playoffs.indexOf(this.selectedPlayoff);
                if(index > -1) {
                    pls[index] = this.newRoundPlayoff;
                }
            }
            this.playoffs = pls;
        }

        this.newRoundPlayoff = null;
        this.newPlayoff = false;
        
        this.selectedTourney.playoffs = this.playoffs;
    }

    onRowSelect(event) {
        let playoff= event.data;
    }

    doDelete(playoff: Playoff) {
        this.onDeletePlayoffError = false;
        this.tourneyService.doPlayoffDelete(playoff, this.deletePlayerErrorHandler("Delete playoff operation"));
    }

    private deletePlayerErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering deletePlayerErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onDeletePlayoffError = true;
      
            return of(result as T);
        };
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiunta configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

