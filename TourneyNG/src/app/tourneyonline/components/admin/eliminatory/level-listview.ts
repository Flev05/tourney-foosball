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
        let teamsNo = this.tourneyService.prepareEliminatoriesComboBoxes();

        this.selectedTourney = this.tourneyService.selectedTourney; 
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        if(this.selectedEliminatoryLevel==undefined) {
            this.isOneway = "true";
        }

        this.teamsCombobox = this.tourneyService.teamsCombobox;

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
            this.tourneyService.availableTeams = [];
        }

        this.prepareEliminatoryLevels(teamsNo);
    }

    pow2(level : number) : number {
        return Math.pow(2, level);
    }

    /**
     * Prepares the list view of the desired levels in function of the received parameter
     * 
     * @param teamsNo the number of teams to allocate on the eliminatory level
     */
    private prepareEliminatoryLevels(teamsNo: number): any {
        console.log("Entering prepareEliminatoryLevels("+teamsNo+")");

        let levelsCombobox =  this.tourneyService.prepareLevelCombobox(teamsNo);

        if(this.eliminatoryLevels.length==0) {
            for(let i=0; i<levelsCombobox.length; i++ ) {
                let lcb = levelsCombobox[i];
                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, lcb.value);
                this.eliminatoryLevels.push(el);
            }
            this.addOptionaLevel();  
            return;
        }     
        
        let selectedLevel = levelsCombobox[0].value;
        let maxCurrentLevel = this.eliminatoryLevels[0].level;

        if(selectedLevel > maxCurrentLevel) {
            let tempElimList: Array<EliminatoryLevel> = new Array<EliminatoryLevel>();
            
            let i = 0;
            let lcb : Combobox = levelsCombobox[i];
            while( lcb.value > maxCurrentLevel ) {                
                let level = lcb.value
                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, level);
                tempElimList.push(el);
                i++;
                lcb = levelsCombobox[i];
            }

            tempElimList =  tempElimList.concat(this.eliminatoryLevels);
            this.eliminatoryLevels = tempElimList;
        }

        if(selectedLevel < maxCurrentLevel) {
            this.eliminatoryLevels.splice(0, maxCurrentLevel - selectedLevel);
        }

        if(selectedLevel == 1) {
            if(this.eliminatoryLevels.length == 2) {
                this.eliminatoryLevels.splice(1, 1);
            }
        } else {
            let found: boolean = false;
            for(let e of this.eliminatoryLevels) {
                if(e.level == -1) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.addOptionaLevel();            
            }
        }
    }    
            
    private addOptionaLevel() {
        let lcb: Combobox = { label: "Finalina 3° e 4° posto", value: -1 };
        let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, -1);
        this.eliminatoryLevels.push(el);
    }

    private newEliminatoryLevel(lcb: Combobox, level: number): EliminatoryLevel {

        let el : EliminatoryLevel = {
            id: lcb.value,
            name: lcb.label,
            level: level,
            isTopLevel: lcb.value == 0 ? true : false,
            isOneway: true,
            eliminatories: []
        };

        return el;
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

        this.tourneyService.teamsCombobox = this.teamsCombobox;
        
        this.selectedTourney.eliminatoryLevels = this.eliminatoryLevels;
        this.tourneyService.selectedEliminatoryLevel = this.selectedEliminatoryLevel;

        this.router.navigate([LevelListView.redirect]);
    }

    onManualClick() {
        console.log("Entering onManualClick()");
        this.eliminatoryMode=EliminatoryMode.M;
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.isManual = true;
    }

    onAutoClick() {
        console.log("Entering onAutoClick()");
        this.eliminatoryMode=EliminatoryMode.A;
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.isManual = false;
        this.tourneyService.availableTeams = [];
    }
 
    onTeamNumChange(event) {
        console.log("Entering onTeamNumChange(): " + this.selectedTeamsNumCombobox);

        let N: number = this.selectedTeamsNumCombobox.value;
        
        this.prepareEliminatoryLevels(N);
    }
}

