import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import {Message} from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { RoundType } from 'app/tourneyonline/domain/roundType';
import { DoubleCombobox } from 'app/tourneyonline/domain/double-combobox';

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
    displayDialogConfig: boolean;
    isPlayoff: boolean;
    isDerivate: boolean;
    isManual: boolean;

    combobox1Row: Combobox;
    combobox2Row: Combobox;

    availableTeams: Combobox[];

    luckyTeamDisplayDialog: boolean;
    luckyTeams: Combobox[];
    selectedLuckyTeam: Combobox;
    luckyTeamRow: Combobox;

    unluckyDisplayDialog: boolean;
    unluckyTeams: DoubleCombobox[];
    selectedUnluckyTeam: DoubleCombobox;
    unluckyTeamRow: Combobox;
    unluckyTeamDisplayDialog: boolean;

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
            this.luckyTeamRow = null;


            let pow2 = Math.pow(2, this.tourneyService.levelNo-1);
            let X = this.selectedTourney.teams.length - pow2;
            let Y = pow2 - X;

            this.luckyTeams = [];
            this.unluckyTeams = [];
            this.availableTeams = [];
            for(let cb of this.teams) {
                this.availableTeams.push(cb);
            }
        
            if(this.eliminatories.length==0 || this.eliminatories.length != pow2) {
                for(let i = 0; i < X; i++) {
                    let cb1: Combobox = {label:"", value: i};
                    let cb2: Combobox = {label:"", value: i};
                    let dcb: DoubleCombobox = {id:0, "cb1": cb1, "cb2": cb2};
                    this.unluckyTeams.push(dcb);
                }

                for(let i=0; i<Y; i++) {
                    let cb: Combobox = {label:"", value: i};
                    this.luckyTeams.push(cb);
                }    
            } else {
                for(let e of this.eliminatories) {
                    if(e.round.teams[0].id!=0 && e.round.teams[1].id==0){
                        let cb: Combobox = {label:e.round.teams[0].teamName, value: e.round.teams[0].id};
                        this.luckyTeams.push(cb);

                        let index: number = this.availableTeams.indexOf(cb);
                        if(index > -1) {
                            this.availableTeams.splice(index, 1);
                        }
                
                    } else {
                        let cb1: Combobox = {label:e.round.teams[0].teamName, value: e.round.teams[0].id};
                        let cb2: Combobox = {label:e.round.teams[1].teamName, value: e.round.teams[1].id};
                        let dcb: DoubleCombobox = {id:0, "cb1": cb1, "cb2": cb2};
                        this.unluckyTeams.push(dcb);

                        let index: number = this.availableTeams.indexOf(cb1);
                        if(index > -1) {
                            this.availableTeams.splice(index, 1);
                        }
                        index  = this.availableTeams.indexOf(cb2);
                        if(index > -1) {
                            this.availableTeams.splice(index, 1);
                        }
                    }
                }
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

    onLuckyTeamRowSelect(event) {
        this.luckyTeamRow = this.selectedLuckyTeam;
        this.luckyTeamDisplayDialog = true;
    }   
    onUnluckyTeamRowSelect(event) {
        this.combobox1Row = {label: this.selectedUnluckyTeam.cb1.label, value: this.selectedUnluckyTeam.cb1.value};
        this.combobox2Row = null;

        this.unluckyDisplayDialog = true;
    }

    luckyTeamDone() {
        this.luckyTeamDisplayDialog = false;
        if(this.luckyTeamRow.value == 0) {
            this.availableTeams.push(this.selectedLuckyTeam);
            let index: number = this.luckyTeams.indexOf(this.selectedLuckyTeam);
            if(index > -1) {
                this.luckyTeams.splice(index, 1);
            }
        } else {
            let index: number = this.availableTeams.indexOf(this.luckyTeamRow);
            if(index > -1) {
                this.availableTeams.splice(index, 1);
            }
    
            index  = this.luckyTeams.indexOf(this.selectedLuckyTeam);
            if(index > -1) {
                this.luckyTeams[index] = this.luckyTeamRow;
            }
        }
        
        this.luckyTeamRow = null;
    }
    unluckyTeamDone() {
        if(this.combobox1Row.value == 0) {
            this.availableTeams.push(this.selectedUnluckyTeam.cb1);
        }        
        if(this.combobox2Row.value == 0) {
            this.availableTeams.push(this.selectedUnluckyTeam.cb2);
        }
        if(this.combobox1Row.value == 0 && this.combobox2Row.value == 0) {
            let index: number = this.unluckyTeams.indexOf(this.selectedUnluckyTeam);
            if(index > -1) {
                this.unluckyTeams.splice(index, 1);
            }
        }

        if(this.combobox1Row.value != 0 && this.combobox2Row.value != 0) {
            this.selectedUnluckyTeam.cb1.label = this.combobox1Row.label;
            this.selectedUnluckyTeam.cb1.value = this.combobox1Row.value;

            this.selectedUnluckyTeam.cb2.label = this.combobox2Row.label;
            this.selectedUnluckyTeam.cb2.value = this.combobox2Row.value;
            let index: number = this.availableTeams.indexOf(this.combobox1Row);
            if(index > -1) {
                this.availableTeams.splice(index, 1);
            }
            index = this.availableTeams.indexOf(this.combobox2Row);
            if(index > -1) {
                this.availableTeams.splice(index, 1);
            }
        }

        this.combobox1Row = null;
        this.combobox2Row = null;

        this.unluckyDisplayDialog = false;
    }

    onCombobox1Change(event) {
        console.log(event);
        let index: number = this.availableTeams.indexOf(this.combobox1Row);
        if(index > -1) {
            this.availableTeams.splice(index, 1);
        }
        this.combobox2Row = {label: this.selectedUnluckyTeam.cb2.label, value: this.selectedUnluckyTeam.cb2.value};
    }
    onCombobox2Change(event) {
        console.log(event);
        let index: number = this.availableTeams.indexOf(this.combobox2Row);
        if(index > -1) {
            this.availableTeams.splice(index, 1);
        }
    }
    standaloneSave() {      
        this.eliminatories = [];
        for(let cb of this.luckyTeams) {

            let e = this.newEliminatory();
            e.round.teams[0].teamName = cb.label;
            e.round.teams[0].id = cb.value;
            e.round.teams[1].teamName = "";
            e.round.teams[1].id = 0;
            
            this.eliminatories.push(e);
        }
        for(let dcb of this.unluckyTeams) {

            let e = this.newEliminatory();
            e.round.teams[0].teamName = dcb.cb1.label;
            e.round.teams[0].id = dcb.cb1.value;
            e.round.teams[1].teamName = dcb.cb2.label;
            e.round.teams[1].id = dcb.cb2.value;
            
            this.eliminatories.push(e);
        }
        
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.selectedTourney.eliminatories = this.eliminatories;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );
    }

    onRowSelectConfig(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialogConfig = true;
    }

    doneConfig() {
        this.eliminatories[this.eliminatories.indexOf(this.selectedEliminatory)] = this.row;

        this.row = null;
        this.unluckyDisplayDialog = false;
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

