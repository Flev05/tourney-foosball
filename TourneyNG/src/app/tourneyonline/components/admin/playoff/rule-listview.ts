import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffRule } from '../../../domain/playoff-rule';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

@Component({
    templateUrl: './rule-listview.html'
})
export class RuleListView extends AbstractListView {
    static redirectToMeeting: string = "adminplayoff/lv/meetingLv";

    playoffConfigs: PlayoffRule[];
    playoffCols: TableCols[] = [
        { field: 'position', header: 'Classificata' },
        { field: 'round',    header: 'Girone' },
    ];

    selectedPlayoff: Playoff;
 
    selectedPlayoffConfig: PlayoffRule; 

    atLeast2Rules: boolean;
    atLeast1Rule: boolean;
    mdbs: MeetingDb[];

    positions: Combobox[];
    rounds: Combobox[];


    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();
        
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffConfigs = this.selectedPlayoff.playoffRules;

        this.atLeast1Rule = this.playoffConfigs != null && this.playoffConfigs.length >= 0 ? true: false;
        this.atLeast2Rules = this.playoffConfigs != null && this.playoffConfigs.length >= 2 ? true: false;

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds    = this.tourneyService.roundsCombobox;
    }

    goMeeting() {
        this.router.navigate([RuleListView.redirectToMeeting]);

        // const subscr = this.tourneyService.loadPlayoffMeeting(this.selectedTourney.id, this.selectedPlayoff.id);
        // subscr.subscribe(t => this.mdbs = t, e => this.onError(e), () => this.onComplete());   
    }

    // private onComplete(): void {
    //     this.selectedPlayoff.round.meetings = [];
    //     for(let mdb of this.mdbs) {
    //         let m: Meeting = JSON.parse(mdb.json);
    //         this.selectedPlayoff.round.meetings.push(m);
    //     }
    //     this.tourneyService.selectedPlayoff = this.selectedPlayoff;

    //     this.router.navigate([RuleListView.redirectToMeeting]);
    // }

    doDelete() {
        console.log("doDelete(): " + this.selectedPlayoff.round.name);
        let popup = 'Sicuro di voler rimuovere il girone: ';

        if(confirm(popup + this.selectedPlayoff.round.name + "?")) {

            let index = this.selectedTourney.playoffs.indexOf(this.selectedPlayoff);
            if(index > -1 ) {

                let pls: Playoff[] = this.selectedTourney.playoffs.splice(index, 1);
                for(let p of pls) {
                    this.removePlayoff(p);
                }
    
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
            }
        }
    }

    private removePlayoff(p: Playoff): any {
        for(let m of p.round.meetings) {
            this.tourneyService.deleteMeeting(m);
        }
        p.round.meetings = [];
    }

    onError(n:any) {
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        console.error(msgerr);
    }
}

