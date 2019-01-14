import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RoundType } from 'app/tourneyonline/domain/enumerations';
import { Message } from 'primeng/api';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from '../../common/abstract-listview';

@Component({
    templateUrl: './playoff-listview.html'
})
export class PlayoffListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRuleLv";
    
    msgs: Message[] = [];
    selectedTourney: Tourney;
    selectedPlayoff: Playoff;
    playoffs: Playoff[];

    atLeastOneRound: boolean;
    displayDialog: boolean;
    newRound: Playoff;
    newPlayoff: boolean;
    mdbs: MeetingDb[];
    
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
            , round:{id: this.tourneyService.getSequenceNumber()
                , name: ""
                , type: RoundType.P
                , teams:[]
                , meetings: []
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

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e) );
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedPlayoff = this.selectedPlayoff;

        const subscr = this.tourneyService.loadPlayoffMeeting(this.selectedTourney.id, this.selectedPlayoff.id);
        subscr.subscribe(t => this.mdbs = t, e => this.onError(e), () => this.onComplete());   

        this.tourneyService.selectedPlayoff = this.selectedPlayoff;

        this.gotoDetailView();
    }

    private onComplete(): void {
        this.selectedPlayoff.round.meetings = [];
        for(let mdb of this.mdbs) {
            let m: Meeting = JSON.parse(mdb.json);
            this.selectedPlayoff.round.meetings.push(m);
        }
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiunta configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

