import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService} from 'primeng/api';

import { AbstractListView } from '../../../components/common/abstract-listview';
import { TourneyService } from '../../../service/tourney-service';
import { ObjectiveConfig } from '../../../domain/objective-config';
import { Combobox } from '../../../domain/tourney-combobox';
import { Final } from '../../../domain/final';
import { PhaseType } from '../../../domain/enumerations';

@Component({
    templateUrl: './objective-listview.html',
    standalone: false
})
export class ObjectiveListView extends AbstractListView {
    position1: number = 0;
    round1: string = "";
    playoffName1: string = "";

    position2: number = 0;
    round2: string = "";
    playoffName2: string = "";

    objectiveLevel: number = 0;
    isObjectiveLoaded: boolean = false;

    positions: Combobox[] = [];
    rounds: Combobox[] = [];
    playoffs: Combobox[] = [];
    eliminatories: Combobox[] = [];
    
    selectedObjective: ObjectiveConfig = new ObjectiveConfig();
    selectedsObjective: ObjectiveConfig[] = [];

    selectedFinal: Final = new Final();
    objectives: Final[] = [];

    row: ObjectiveConfig = new ObjectiveConfig();  
    displayDialog: boolean = false;
    isPlayoff: boolean = false;

    constructor(
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location
        ,private messageService: MessageService
    ) {
        super("", tourneyService, router, location);
    }

    override ngOnInit() {
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
        let obj : ObjectiveConfig = new ObjectiveConfig();
        return obj;
    }

    onRowSelect(event : any) {
        // this.row = this.cloneObject(event.data);
        this.displayDialog = true;
    }

    done() {
        // this.objectives[this.objectives.indexOf(this.selectedObjective)] = this.row;
        this.selectedTourney.objectives = this.objectives;
        // this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );
        // this.row = null;
        this.displayDialog = false;
    }

    create() {
        let se = new Final();
        this.objectives.push(se);
    }
            
    override onError(n:any) {
        let msgerr : string = 'Modifica configurazione objective fallita';
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: msgerr
        });
    }
}

