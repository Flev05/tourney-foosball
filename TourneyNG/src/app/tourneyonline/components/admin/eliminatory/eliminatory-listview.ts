import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {SelectItem} from 'primeng/api';

import { Tourney } from 'app/tourneyonline/domain/tourney';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import {Message} from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import {DialogModule} from 'primeng/dialog';

const redirect: string = "admineliminatory/lv/dv";

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractListView {
    msgs: Message[] = [];
    position1: number;
    roundName1: string;
    playoffName1: string;

    position2: number;
    roundName2: string;
    playoffName2: string;

    levels: SelectItem[];
    currentLevelSelectItem: SelectItem;
    isEliminatoryLoaded: boolean = false;

    positions: SelectItem[];
    rounds: SelectItem[];
    playoffs: SelectItem[];
    
    // eliminatoryFormGroup: FormGroup;
    selectedTourney: Tourney;
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    row: Eliminatory;  
    displayDialog: boolean;
    newEliminatory: boolean;

    constructor(
        // private fb: FormBuilder,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {
        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.levels = this.tourneyService.levelsSelectItem;
        this.positions = this.tourneyService.positionsSelectItem;
        this.rounds = this.tourneyService.roundsSelectItem;
        this.playoffs = this.tourneyService.playoffsSelectItem;

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.eliminatories = this.tourneyService.selectedTourney.eliminatories;
        this.tourneyService.newEliminatory = false;

        this.currentLevelSelectItem = {label:"" + this.selectedTourney.eliminatoryLevel, value:this.selectedTourney.eliminatoryLevel};

        this.isEliminatoryLoaded = this.eliminatories.length > 0 ? true : false;
        for(let e of this.eliminatories ) {
            e.enabled = false;
        }
        this.row = {id:this.tourneyService.getSequenceNumber()
            , enabled: false
            , round: {}
            , level: this.tourneyService.levelsSelectItem.length
            , tc1:{
                  id: this.tourneyService.getSequenceNumber()
                , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
                , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
            }
            , tc2:{
                  id: this.tourneyService.getSequenceNumber()
                , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
                , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
            }
        }
    }

    showDialogToAdd() {
        this.newEliminatory = true;
        this.row = {id:this.tourneyService.getSequenceNumber()
            , enabled: false
            , round: {}
            , level: this.tourneyService.levelsSelectItem.length
            , tc1:{
                  id: this.tourneyService.getSequenceNumber()
                , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
                , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
            }
            , tc2:{
                  id: this.tourneyService.getSequenceNumber()
                , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
                , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
            }
        };
        this.displayDialog = true;
    }

    save() {
        let eliminatories = [...this.eliminatories];
        if (this.newEliminatory)
            eliminatories.push(this.row);
        else
            eliminatories[this.eliminatories.indexOf(this.selectedEliminatory)] = this.row;

        this.eliminatories = eliminatories;
        this.row = null;
        this.displayDialog = false;
    }

    delete() {
        let index = this.eliminatories.indexOf(this.selectedEliminatory);
        this.eliminatories = this.eliminatories.filter((val, i) => i != index);
        this.row = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newEliminatory = false;
        this.row = this.cloneObject(event.data);
        this.displayDialog = true;
    }

    onChange(event) {
        console.log(event);

        this.isEliminatoryLoaded = true;
        this.eliminatories = [];
        for(let i=0; i<=this.currentLevelSelectItem.value; i++ ) {
            let se = {id:this.tourneyService.getSequenceNumber()
                , enabled: false
                , round: {}
                , level: this.tourneyService.levelsSelectItem.length
                , tc1:{
                      id: this.tourneyService.getSequenceNumber()
                    , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
                    , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
                }
                , tc2:{
                      id: this.tourneyService.getSequenceNumber()
                    , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
                    , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
                }
            };
    
            this.eliminatories.push(se);
        }
    }

    // addRule() {
    //     this.selectedEliminatory = {id:this.tourneyService.getSequenceNumber()
    //         , enabled: true
    //         , round: {}
    //         , level: this.tourneyService.levelsSelectItem.length
    //         , tc1:{
    //               id: this.tourneyService.getSequenceNumber()
    //             , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
    //             , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
    //         }
    //         , tc2:{
    //               id: this.tourneyService.getSequenceNumber()
    //             , fromRound: {id: this.tourneyService.getSequenceNumber(),  position:0, roundName:""}
    //             , fromPlayoff:{id: this.tourneyService.getSequenceNumber(), position:0, roundName:""}
    //         }
    //     };
    //     this.tourneyService.newEliminatory = true;

    //     this.position1 = 0;
    //     this.roundName1 = "";
    //     this.playoffName1 = "";
    
    //     this.position2 = 0;
    //     this.roundName2 = "";
    //     this.playoffName2 = "";

    //     this.eliminatories.push(this.selectedEliminatory)
    // }

    // onRowSelect(event) {
    //     console.log("Entering onRowSelect()");

    //     for(let e of this.eliminatories ) {
    //         e.enabled = false;
    //     }
    //     this.selectedEliminatory.enabled = true;
    // }
    
    // onSubmit(value: string) {

    //     console.log(value);

    //     this.tourneyService.newEliminatory = false;

    //     if(this.position1 !=0 ) {
    //         this.selectedEliminatory.tc1.fromRound.position=this.position1;
    //         this.selectedEliminatory.tc1.fromRound.roundName = this.roundName1;
    //         this.selectedEliminatory.tc1.fromPlayoff.roundName = this.playoffName1;
    //     }
    //     if(this.position2 !=0 ) {
    //         this.selectedEliminatory.tc2.fromRound.position=this.position2;
    //         this.selectedEliminatory.tc2.fromRound.roundName = this.roundName2;
    //         this.selectedEliminatory.tc2.fromPlayoff.roundName = this.playoffName2;
    //     }

    //     this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    // }
        
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newEliminatory) {
            msgerr = 'Creazione nuova configurazione eliminatory fallita';
        } else {
            msgerr = 'Modifica configurazione eliminatory fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

