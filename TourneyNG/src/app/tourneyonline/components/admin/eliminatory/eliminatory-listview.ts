import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import {Message} from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { RoundType } from 'app/tourneyonline/domain/roundType';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractListView {
    msgs: Message[] = [];
    position1: number;
    round1: string;
    playoffName1: string;

    position2: number;
    round2: string;
    playoffName2: string;

    levels: Combobox[];
    eliminatoryLevel: number;
    isEliminatoryLoaded: boolean = false;

    positions: Combobox[];
    rounds: Combobox[];
    playoffs: Combobox[];
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    row: Eliminatory;  
    displayDialog: boolean;
    isPlayoff: boolean;

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
        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.levels = this.tourneyService.levelsCombobox;
        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;
        this.playoffs = this.tourneyService.playoffsCombobox;

        this.eliminatories = this.selectedTourney.eliminatories;

        this.eliminatoryLevel = this.selectedTourney.eliminatoryLevel;

        this.isEliminatoryLoaded = this.eliminatories.length > 0 ? true : false;
        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
    }

    onChange(event) {
        console.log(event);

        this.isEliminatoryLoaded = true;
        this.eliminatories = [];
        for(let i=0; i<=this.eliminatoryLevel; i++ ) {
            let se = this.newEliminatory();
    
            this.eliminatories.push(se);
        }
    }

    showDialogToAdd() {
        this.row = this.newEliminatory();
        this.displayDialog = true;
    }

    private newEliminatory(): Eliminatory {
        return {
        id: this.tourneyService.getSequenceNumber(),
            enabled: false,
            round:{id: this.tourneyService.getSequenceNumber(), name: "", type: RoundType.P, isRoundTrip: true},
            level: this.tourneyService.levelsCombobox.length,
            tc1: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound:   { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                },
                fromPlayoff: { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                }
            },
            tc2: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound:   { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                },
                fromPlayoff: { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                }
            }
        };
    }

    onRowSelect(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialog = true;
    }

    done() {
        this.eliminatories[this.eliminatories.indexOf(this.selectedEliminatory)] = this.row;

        this.row = null;
        this.displayDialog = false;
    }

    save() {
        this.selectedTourney.eliminatories = this.eliminatories;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );
    }
            
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione eliminatory fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

