import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import {Message} from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { PhaseType, EliminatoryMode } from 'app/tourneyonline/domain/phase-type';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';

@Component({
    templateUrl: './level-listview.html'
})
export class LevelListView extends AbstractListView {
    static redirect: string = '/admineliminatory/levelLv/eliminatoryLv';

    msgs: Message[] = [];
   
    eliminatoryMode: EliminatoryMode;
    
    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;

    isPlayoff: boolean;
    isStandalone: boolean;
    isModeEnabled: boolean;
    isManual: boolean;
    isOneway: string;

    levelsCombobox: Combobox[];
    selectedLevelCombobox: Combobox;
    selectedTeamsNumCombobox: Combobox;
    teamsCombobox: Combobox[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(LevelListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {
        this.tourneyService.prepareEliminatoriesComboBoxes();
        this.selectedTourney = this.tourneyService.selectedTourney; 

        this.selectedEliminatoryLevel = this.selectedTourney.selectedEliminatoryLevel;
        this.levelsCombobox = this.tourneyService.levelsCombobox;   
        this.teamsCombobox = this.tourneyService.teamsCombobox;
        this.isOneway = this.selectedEliminatoryLevel.isOneway ? "true": "false";

        this.selectedLevelCombobox = this.selectedTourney.selectedLevelCombobox;
        this.selectedTeamsNumCombobox =  this.selectedTourney.selectedTeamsNumCombobox;

        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;

        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;
                
        this.isStandalone = false;
        this.isManual = true;

        if( this.containsPhase(PhaseType.R, this.selectedTourney.phases) && 
            !this.containsPhase(PhaseType.P, this.selectedTourney.phases) &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) 
        {
            this.isModeEnabled = true;
        } else {
             this.isModeEnabled = false;
        }

        if( this.selectedTourney.phases.length == 1 && 
                this.containsPhase(PhaseType.E, this.selectedTourney.phases)) {
            this.isStandalone = true;
            this.isManual = false;
            if(this.eliminatoryLevels.length==0) {
                this.prepareEliminatoryLevels(this.eliminatoryLevels.length);
            }
        }
    }

    /**
     * Prepares the list view of the desired levels in function of the received parameter
     * 
     * @param comboBoxIndex the index of the combobox to limit the list of levels
     */
    private prepareEliminatoryLevels(comboBoxIndex: number): any {
        console.log("Entering prepareEliminatoryLevels("+comboBoxIndex+")");

        let ell = this.eliminatoryLevels.length == 0 ? this.levelsCombobox.length : this.eliminatoryLevels[0].id; 

        if(comboBoxIndex <= ell) {
            let tempElimList: Array<EliminatoryLevel> = new Array<EliminatoryLevel>();
            
            let from = comboBoxIndex;
            let to = ell;

            for(let i=from; i<to; i++ ) {
                let lcb = this.levelsCombobox[i];
                let level = Math.pow(2, this.levelsCombobox.length - lcb.value - 1)
                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, level);
                tempElimList.push(el);
            }

            tempElimList =  tempElimList.concat(this.eliminatoryLevels);
            this.eliminatoryLevels =  tempElimList;
        }

        if(comboBoxIndex > ell) {
            this.eliminatoryLevels.splice(0, comboBoxIndex-ell);
        }

        if(comboBoxIndex == this.levelsCombobox.length-1) {
            if(this.eliminatoryLevels.length == 2) {
                this.eliminatoryLevels.splice(1, 1);
            }
        } else {
            if(this.eliminatoryLevels[this.eliminatoryLevels.length-1].level != 0) {
                let lcb: Combobox = {label:"Finalina 3° e 4° posto", value: 0};
                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, 0);
                this.eliminatoryLevels.push(el);
            }
        }
    }
            
    private newEliminatoryLevel(lcb: Combobox, level: number): EliminatoryLevel {
        return {
            id: lcb.value,
            name: lcb.label,
            level: level,
            isTopLevel: lcb.value == 0 ? true : false,
            isOneway: this.selectedEliminatoryLevel.isOneway,
            eliminatories: []
        };
    }

    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.selectedEliminatoryLevel.isOneway=true;
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.selectedEliminatoryLevel.isOneway=false;
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");

        this.tourneyService.levelsCombobox = this.levelsCombobox;   
        this.tourneyService.teamsCombobox = this.teamsCombobox;
        
        this.selectedTourney.selectedLevelCombobox = this.selectedLevelCombobox;
        this.selectedTourney.selectedTeamsNumCombobox = this.selectedTeamsNumCombobox;

        this.selectedEliminatoryLevel.isOneway = this.isOneway=="true" ? true : false;

        this.selectedTourney.eliminatoryLevels = this.eliminatoryLevels;
        this.selectedTourney.selectedEliminatoryLevel = this.selectedEliminatoryLevel;

        this.router.navigate([LevelListView.redirect]);
    }

    onManualClick() {
        console.log("Entering onManualClick()");
        this.eliminatoryMode=EliminatoryMode.M;
        this.isManual = true;
    }

    onAutoClick() {
        console.log("Entering onAutoClick()");
        this.eliminatoryMode=EliminatoryMode.A;
        this.isManual = false;
    }

    onChange(event) {
        console.log("Entering onChange()");

        this.prepareEliminatoryLevels(this.selectedLevelCombobox.value);
    }

    onTeamNumChange(event) {
        console.log("Entering onTeamNumChange(): " + this.selectedTeamsNumCombobox);
        let N: number = this.selectedTeamsNumCombobox.value;
        if(N==0) {
            N = this.selectedTourney.teams.length;
        }
        let level = Math.ceil(Math.log2(N));
        this.prepareEliminatoryLevels(level-1);
    }
}

