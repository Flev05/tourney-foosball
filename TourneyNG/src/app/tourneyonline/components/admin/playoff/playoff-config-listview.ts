import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { RoundType } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './playoff-config-listview.html'
})
export class PlayoffConfigListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/playoffRoundLv/dv";
    static redirectToMeeting: string = "adminplayoff/lv/playoffRoundLv/meeting";

    msgs: Message[] = [];
    position: number;
    roundName: string;

    playoffConfigs: PlayoffConfig[];

    selectedPlayoff: Playoff;
 
    nameIsMandatory: boolean;
    selectedPlayoffConfig: PlayoffConfig; 

    constructor(
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

            this.selectedTourney.playoffs.push(this.selectedPlayoff);
        }
        this.selectedPlayoff = this.tourneyService.selectedPlayoff;
        this.playoffConfigs = this.selectedPlayoff.playoffConfigs;
    }

    goMeeting() {
        this.router.navigate([PlayoffConfigListView.redirectToMeeting]);
    }

    add() {

        let item = this.newPlaoffConfig();
        this.playoffConfigs.push(item);
        this.router.navigate([PlayoffConfigListView.redirect]);
    }

    save() {
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
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

        this.tourneyService.playoffsConfigs = this.playoffConfigs;

        this.tourneyService.selectedPlayoffConfig = this.selectedPlayoffConfig;
        this.router.navigate([PlayoffConfigListView.redirect]);
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

