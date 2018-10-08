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
    eliminatoryType: string;
    eliminatoryMode: string;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    row: Eliminatory;  
    displayDialog: boolean;
    displayDialogConfig: boolean;
    isPlayoff: boolean;
    isDerivate: boolean;
    isManual: boolean;

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
        this.eliminatoryType = this.selectedTourney.eliminatoryType;
        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;

        this.eliminatoryLevel = this.selectedTourney.eliminatoryLevel;

        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isDerivate = this.eliminatoryType=="derivate" ? true : false;
        this.isManual = this.eliminatoryMode=="manual" ? true : false;
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

    onAutonomousClick() {
        console.log("Entering onAutonomousClick()");
        this.eliminatoryType="autonomous";
        this.isDerivate = false;
    }

    onDerivateClick() {
        console.log("Entering onDerivateClick()");
        this.eliminatoryType="derivate";
        this.isDerivate = true;
    }

    onChange(event) {
        console.log(event);

        this.eliminatories = [];
        for(let i=0; i<=this.eliminatoryLevel; i++ ) {
            let se = this.newEliminatoryConfig();
    
            this.eliminatories.push(se);
        }
    }

    private newEliminatoryConfig(): Eliminatory {
        return {
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
    }

    onRowSelect(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialog = true;
    }

    onRowSelectConfig(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialogConfig = true;
    }

    done() {
        this.eliminatories[this.eliminatories.indexOf(this.selectedEliminatory)] = this.row;

        this.row = null;
        this.displayDialog = false;
        this.displayDialogConfig = false;
    }

    save() {
        this.selectedTourney.eliminatoryType = this.eliminatoryType;
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

