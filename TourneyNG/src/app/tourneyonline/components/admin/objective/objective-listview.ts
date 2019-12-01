import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import {Message} from 'app/components/common/api';
import { ObjectiveConfig } from 'app/tourneyonline/domain/objective-config';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Final } from 'app/tourneyonline/domain/final';
import { PhaseType } from '../../../domain/enumerations';

@Component({
    templateUrl: './objective-listview.html'
})
export class ObjectiveListView extends AbstractListView {
    msgs: Message[] = [];
    position1: number;
    round1: string;
    playoffName1: string;

    position2: number;
    round2: string;
    playoffName2: string;

    objectiveLevel: number;
    isObjectiveLoaded: boolean = false;

    positions: Combobox[];
    rounds: Combobox[];
    playoffs: Combobox[];
    eliminatories: Combobox[];
    
    selectedObjective: ObjectiveConfig;
    selectedsObjective: ObjectiveConfig[];

    selectedFinal: Final;
    objectives: Final[];

    row: ObjectiveConfig;  
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
        // this.tourneyService.prepareEliminatoriesComboBoxes();

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;
        this.playoffs = this.tourneyService.playoffsCombobox;
        this.objectives = this.selectedTourney.objectives;

        this.isObjectiveLoaded = this.objectives.length > 0 ? true : false;
        
        this.isPlayoff = this.containsPhase(PhaseType.P, this.selectedTourney.phases);
    }

    showDialogToAdd() {
        this.row = this.newObjective();
        this.displayDialog = true;
    }

    private newObjective(): ObjectiveConfig {
        let obj : ObjectiveConfig = {
            id: null // this.tourneyService.getSequenceNumber()
            , fromRound:   { id: null // this.tourneyService.getSequenceNumber()
                , position: { label: "1°", value: 0 }
                , round: { label: "", value: 0 } 
                , bandPosition: 0
                , isAutomatic:true
            }
            , fromPlayoff: { id: null //this.tourneyService.getSequenceNumber()
                , position: { label: "1°", value: 0 }
                , round: { label: "", value: 0 } 
                , bandPosition: 0
                , isAutomatic:true
            }
            , fromEliminatory: { id: null // this.tourneyService.getSequenceNumber()
                , position: { label: "1°", value: 0 }
                , round: { label: "", value: 0 } 
                , bandPosition: 0
                , isAutomatic:true
            }
        };

        return obj;
    }

    onRowSelect(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialog = true;
    }

    done() {
        this.objectives[this.objectives.indexOf(this.selectedObjective)] = this.row;

        this.selectedTourney.objectives = this.objectives;
        // this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );

        this.row = null;
        this.displayDialog = false;
    }

    create() {
        let se = this.newObjective();
        this.objectives.push(se);
    }
            
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione objective fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

