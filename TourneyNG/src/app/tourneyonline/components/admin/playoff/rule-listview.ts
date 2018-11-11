import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';
import { RoundType } from 'app/tourneyonline/domain/enumerations';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './rule-listview.html'
})
export class RuleListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRoundLv/dv";
    static redirectToMeeting: string = "adminplayoff/lv/meetingLv";

    playoffFormGroup: FormGroup;

    msgs: Message[] = [];

    playoffConfigs: PlayoffConfig[];

    selectedPlayoff: Playoff;
 
    selectedPlayoffConfig: PlayoffConfig; 

    atLeast2Rules: boolean;
    atLeast1Rule: boolean;

    constructor(private fb: FormBuilder,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(RuleListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();
        
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffConfigs = this.selectedPlayoff.playoffConfigs;

        this.atLeast1Rule = this.playoffConfigs != null && this.playoffConfigs.length >= 0 ? true: false;
        this.atLeast2Rules = this.playoffConfigs != null && this.playoffConfigs.length >= 2 ? true: false;

        this.playoffFormGroup = this.fb.group({
            'roundName':  new FormControl(this.selectedPlayoff.round.name, Validators.compose([Validators.required])),     
        });
    }

    goMeeting() {
        this.router.navigate([RuleListView.redirectToMeeting]);
    }

    add() {

        this.tourneyService.newRule = true;
        this.tourneyService.selectedIndex = 0;
        this.router.navigate([RuleListView.redirect]);
    }

    onRowSelect(event) {

        this.tourneyService.selectedPlayoffConfig = this.selectedPlayoffConfig;

        let index = this.playoffConfigs.indexOf(this.selectedPlayoffConfig);
        this.tourneyService.selectedIndex = index;

        this.router.navigate([RuleListView.redirect]);
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedPlayoff.round.name);
        let popup = 'Sicuro di voler rimuovere il girone: ';

        if(confirm(popup + this.selectedPlayoff.round.name + "?")) {

            let index = this.selectedTourney.playoffs.indexOf(this.selectedPlayoff);
            if(index > -1 ) {
                this.selectedTourney.playoffs.splice(index, 1);
    
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
        }
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

