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

    eliminatories: Eliminatory[];
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
        
        if( this.containsPhase(PhaseType.R, this.selectedTourney.phases) && 
            this.containsPhase(PhaseType.E, this.selectedTourney.phases) && 
            !this.containsPhase(PhaseType.R, this.selectedTourney.phases)) 
        {
            this.isModeEnabled = true;
        } else {
             this.isModeEnabled = false;
        }

        if( this.selectedTourney.phases.length == 1 && 
                this.containsPhase(PhaseType.E, this.selectedTourney.phases)) {
            this.isStandalone = true;
            this.isManual = false;
            this.prepareEliminatoryLevels(this.eliminatoryLevels.length);
        } else {
            this.isManual = true;
        }
    }

    private prepareEliminatoryLevels(N: number ): any {
        
        if(this.levelsCombobox.length >  N) {

            for(let lcb of this.levelsCombobox){
                let found: boolean = false;
                for(let el of this.eliminatoryLevels) {
                    if(lcb.value == el.id) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    let el: EliminatoryLevel = {id: this.tourneyService.getSequenceNumber()
                        ,name: lcb.label
                        ,level: Math.pow(2,lcb.value)
                        ,isOneway: this.selectedEliminatoryLevel.isOneway
                        ,eliminatories: this.eliminatories
                    };
                    this.eliminatoryLevels.push(el);
                }
            }
        }

        if(this.levelsCombobox.length < N) {

            let index: number = 0;
            for(let el of this.eliminatoryLevels) {

                let found: boolean = false;
                for(let lcb of this.levelsCombobox){
                    if(lcb.value == el.id) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    this.eliminatoryLevels.slice(1, index);
                }
                index++;
            }        
        }
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
        
        this.selectedTourney.selectedEliminatoryLevel = this.selectedEliminatoryLevel;
        this.selectedTourney.selectedLevelCombobox = this.selectedLevelCombobox;
        this.selectedTourney.selectedTeamsNumCombobox = this.selectedTeamsNumCombobox;
        this.selectedEliminatoryLevel.isOneway = this.isOneway=="true" ? true : false;

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

        let N: number = Math.pow(2, this.selectedLevelCombobox.value);

        this.prepareEliminatoryLevels(N);
    }

    onTeamNumChange(event) {
        console.log("Entering onTeamNumChange(): " + this.selectedTeamsNumCombobox);
        this.selectedTeamsNumCombobox
    }
}

