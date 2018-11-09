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
    templateUrl: './playoff-config-listview.html'
})
export class PlayoffConfigListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRoundLv/dv";
    static redirectToMeeting: string = "adminplayoff/lv/meetingLv";

    playoffFormGroup: FormGroup;

    msgs: Message[] = [];
    position: number;
    roundName: string;

    playoffConfigs: PlayoffConfig[];

    selectedPlayoff: Playoff;
 
    // nameIsMandatory: boolean;
    selectedPlayoffConfig: PlayoffConfig; 

    roudName: string;

    constructor(private fb: FormBuilder,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(PlayoffConfigListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();
        if(this.tourneyService.newPlayoff) {
            this.tourneyService.selectedPlayoff = {
                  id:this.tourneyService.getSequenceNumber()
                , round:{id: this.tourneyService.getSequenceNumber(), name: "", type: RoundType.P}
                , playoffConfigs: [this.newPlaoffConfig()]};
        }

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffConfigs = this.selectedPlayoff.playoffConfigs;

        this.playoffFormGroup = this.fb.group({

            'roundName':  new FormControl(this.selectedPlayoff.round.name, Validators.compose([Validators.required])),
     
        });
    }

    goMeeting() {
        this.router.navigate([PlayoffConfigListView.redirectToMeeting]);
    }

    add() {

        let newpc = this.newPlaoffConfig();
        this.tourneyService.newRule = true;
        this.tourneyService.playoffsConfigs = this.playoffConfigs;
        this.tourneyService.selectedPlayoffConfig = newpc;
        this.tourneyService.selectedIndex = this.playoffConfigs.length-1;

        this.router.navigate([PlayoffConfigListView.redirect]);
    }

    save() {

        this.beforeSave();

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    private beforeSave() {
        if (this.tourneyService.newPlayoff) {
            this.tourneyService.newPlayoff = false;
            this.selectedPlayoff.round.name = this.playoffFormGroup.get('roundName').value;
            this.selectedTourney.playoffs.push(this.tourneyService.selectedPlayoff);
        }
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

    private newPlaoffConfig(): PlayoffConfig {
        return {
            id: this.tourneyService.getSequenceNumber(),
            fromRound: {
                id: this.tourneyService.getSequenceNumber(),
                position: { label: 1 + "°", value: 1 },
                round: { label: "", value: 0 }
            }
        };
    }

    onRowSelect(event) {

        if(this.tourneyService.newPlayoff) {
            this.beforeSave();
        }

        this.tourneyService.playoffsConfigs = this.playoffConfigs;

        this.tourneyService.selectedPlayoffConfig = this.selectedPlayoffConfig;

        let index = this.playoffConfigs.indexOf(this.selectedPlayoffConfig);

        this.tourneyService.selectedIndex = index;

        this.router.navigate([PlayoffConfigListView.redirect]);
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

