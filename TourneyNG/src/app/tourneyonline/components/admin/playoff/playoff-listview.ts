import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../../domain/tourney';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { Playoff } from '../../../domain/playoff';
import { RoundType } from 'app/tourneyonline/domain/enumerations';
import { Message } from 'primeng/api';

@Component({
    templateUrl: './playoff-listview.html'
})
export class PlayoffListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRoundLv";
    
    msgs: Message[] = [];
    selectedTourney: Tourney;
    selectedPlayoff: Playoff;
    playoffs: Playoff[];

    atLeastOneRound: boolean;
    displayDialog: boolean;
    newRound: Playoff;
    newPlayoff: boolean;

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
   
        this.atLeastOneRound = this.selectedTourney.rounds.length > 0;
    }

    showDialogToAdd() {
        this.newPlayoff = true;
        this.displayDialog = true;

        this.newRound = {
            id:this.tourneyService.getSequenceNumber()
            , round:{id: this.tourneyService.getSequenceNumber(), name: "", type: RoundType.P, meetings: []}
            , playoffConfigs: null
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

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e) );
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedPlayoff = this.selectedPlayoff;

        this.gotoDetailView();
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiunta configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

