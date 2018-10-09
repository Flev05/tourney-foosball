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
   
    positions: Combobox[];
    rounds: Combobox[];
    playoffs: Combobox[];
    teams: Combobox[];

    levels: Combobox[];
    eliminatoryLevel: number;
    eliminatoryMode: string;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    row: Eliminatory;  
    displayDialog: boolean;
    displayDialogConfig: boolean;
    isPlayoff: boolean;
    isDerivate: boolean;
    isManual: boolean;

    rowCombobox1: Combobox;
    rowCombobox2: Combobox;

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
        this.teams = this.tourneyService.teamsCombobox;
        this.playoffs = this.tourneyService.playoffsCombobox;

        this.eliminatories = this.selectedTourney.eliminatories;
        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;

        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isManual = this.eliminatoryMode=="manual" ? true : false;
        
        if( this.selectedTourney.phases.length == 1 && this.containsPhase("eliminatory", this.selectedTourney.phases)) {
            this.isDerivate = false;
            let pow2 = Math.pow(2, this.tourneyService.levelNo);
            if(this.eliminatories.length==0 || this.eliminatories.length != pow2) {
                this.eliminatories = [];
                for(let i = 0; i < pow2; i++) {
                    let se = this.newEliminatory();    
                    this.eliminatories.push(se);
                }
            } else {

            }
        } else {
            this.isDerivate = true;
        }
    }

    onManualClick() {
        console.log("Entering onManualClick()");
        this.eliminatoryMode="manual";
        this.isManual = true;
    }

    onAutoClick() {
        console.log("Entering onAutoClick()");
        this.eliminatoryMode="auto";
        this.isManual = false;
    }

    onChange(event) {
        console.log(event);

        this.eliminatories = [];
        for(let i=0; i<=this.eliminatoryLevel; i++ ) {
            let se = this.newEliminatory();
    
            this.eliminatories.push(se);
        }
    }

    private newEliminatory(): Eliminatory {
        let e: Eliminatory = {
            id: this.tourneyService.getSequenceNumber(),
            enabled: false,
            round:{id: this.tourneyService.getSequenceNumber()
                , name: ""
                , type: RoundType.E
                , isRoundTrip: true
                , teams:[
                     {id:0, teamName:""}
                    ,{id:1, teamName:""}
                ]},
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

        return e;
    }

    onRowSelect(event) {
        this.rowCombobox1 = {label: this.selectedEliminatory.round.teams[0].teamName, value: this.selectedEliminatory.round.teams[0].id};
        this.rowCombobox2 = {label: this.selectedEliminatory.round.teams[1].teamName, value: this.selectedEliminatory.round.teams[1].id};

        this.displayDialog = true;
    }

    done() {
        this.selectedEliminatory.round.teams[0].teamName = this.rowCombobox1.label;
        this.selectedEliminatory.round.teams[0].id = this.rowCombobox1.value;

        this.selectedEliminatory.round.teams[1].teamName = this.rowCombobox2.label;
        this.selectedEliminatory.round.teams[1].id = this.rowCombobox2.value;

        this.eliminatories[this.eliminatories.indexOf(this.selectedEliminatory)] = this.selectedEliminatory;

        this.rowCombobox1 = null;
        this.rowCombobox2 = null;

        this.displayDialog = false;
        this.displayDialogConfig = false;
    }

    onRowSelectConfig(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialogConfig = true;
    }

    doneConfig() {
        this.eliminatories[this.eliminatories.indexOf(this.selectedEliminatory)] = this.row;

        this.row = null;
        this.displayDialog = false;
        this.displayDialogConfig = false;
    }

    save() {
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
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

