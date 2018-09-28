import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng/api';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffConfig } from 'app/tourneyonline/domain/playoff-config';

@Component({
    templateUrl: './playoff-detailview.html'
})
export class PlayoffDetailView extends AbstractListView {
    msgs: Message[] = [];
    position: number;
    roundName: string;

    positions: SelectItem[];
    rounds: SelectItem[];
    playoffConfigs: PlayoffConfig[];
    selectedPlayoffConfig; PlayoffConfig;

    selectedPlayoff: Playoff;

    row: PlayoffConfig;  
    displayDialog: boolean;

    teamNoSelectItem: number;
    teamsSelectItem: SelectItem[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {
        this.displayDialog = false;

        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.positions = this.tourneyService.positionsSelectItem;
        this.rounds = this.tourneyService.roundsSelectItem;

        this.teamNoSelectItem = this.selectedTourney.teams.length / this.selectedTourney.rounds.length;

        this.teamsSelectItem = [];
        for(let i=2; i<=this.teamNoSelectItem; i++ ) {
            let item = { label: "" + i, value: i  };
            this.teamsSelectItem.push(item);
        }

        this.teamNoSelectItem = 0;

        if(this.tourneyService.newPlayoff) {
            this.selectedPlayoff = {
                  id:this.tourneyService.getSequenceNumber()
                , round:{id: this.tourneyService.getSequenceNumber(), name: ""}
                , playoffConfigs: [{
                        id: this.tourneyService.getSequenceNumber()
                        , fromRound: {id: this.tourneyService.getSequenceNumber()
                        , position:{label: "1°", value: 1}
                        , roundName: ""
                    }
                }
            ]};

            this.selectedTourney.playoffs.push(this.selectedPlayoff);
        } else {
            this.selectedPlayoff = this.tourneyService.selectedPlayoff;
            this.playoffConfigs = this.selectedPlayoff.playoffConfigs;
        }
    }

    onChange(event) {
        console.log(event);

        this.playoffConfigs = [];
        for(let i=1; i<=this.teamNoSelectItem; i++ ) {
            let pc: PlayoffConfig = {
                  id: this.tourneyService.getSequenceNumber()
                , fromRound: {
                      id: this.tourneyService.getSequenceNumber()
                    , position:{label: 1 + "°", value: 1}
                    , roundName:""
                }                
              };
    
            this.playoffConfigs.push(pc);
        }
    }

    showDialogToAdd() {
        this.row = {
              id: this.tourneyService.getSequenceNumber()
            , fromRound: {id: this.tourneyService.getSequenceNumber()
                , position:{label: this.selectedPlayoffConfig.label, value: this.selectedPlayoffConfig.value}
                , roundName: this.selectedPlayoffConfig.roundName
            }  
        };
        this.displayDialog = true;
    }

    onRowSelect(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialog = true;
    }

    done() {
        this.playoffConfigs[this.playoffConfigs.indexOf(this.selectedPlayoffConfig)] = this.row;

        this.row = null;
        this.displayDialog = false;
    }

    save() {
        this.selectedPlayoff.playoffConfigs = this.playoffConfigs;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
            
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

