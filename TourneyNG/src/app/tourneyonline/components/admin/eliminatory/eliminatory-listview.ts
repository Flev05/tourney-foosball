import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Team } from 'app/tourneyonline/domain/team';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { PhaseType, EliminatoryMode, Direction } from '../../../domain/enumerations';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractListView {
    static autoRedirect: string = '/admineliminatory/levelLv/eliminatoryLv/dv';
    static manualRedirect: string = '/admineliminatory/levelLv/eliminatoryLv/manualdv';

    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;

    eliminatoryMode: EliminatoryMode;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    isPlayoff: boolean;
    isManual: boolean;

    isTopLevel: boolean;

    isOneway: string;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(EliminatoryListView.autoRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.tourneyService.prepareEliminatoriesComboBoxes();
    
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
    
        this.eliminatories = this.selectedEliminatoryLevel.eliminatories;
        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;
    
        this.isOneway = this.selectedEliminatoryLevel.isOneway ? "true" : "false" ;
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;
    
        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;
    }
    
    onAutoEliminatoryRowSelect(event) {
        console.log("Entering onAutoEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
        this.router.navigate([EliminatoryListView.autoRedirect]);
    }

    onManualEliminatoryRowSelect(event) {
        console.log("Entering onManualEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
        this.router.navigate([EliminatoryListView.manualRedirect]);
    }

    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.selectedEliminatoryLevel.isOneway=true;

        this.manageMeeting(true);
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.selectedEliminatoryLevel.isOneway=false;
        this.manageMeeting(false);
    }

    private manageMeeting(isOneway: boolean) {

        for(let e of this.eliminatories) {
            if(isOneway) {
                if(e.round.meetings.length == 2) {
                    e.round.meetings.splice(1, 1);
                }
            } else {
                let m = this.newMeeting(e.round.meetings[0].team2, e.round.meetings[0].team1);
                e.round.meetings.push(m);
            }
        }
    }
    
    private newMeeting(t1: Team, t2: Team): Meeting {
        return {
            id: this.tourneyService.getSequenceNumber(),
            name: t1.teamName + " - " + t2.teamName,
            datetime: this.selectedTourney.datetime,
            team1: t1,
            team2: t2,
            address: this.selectedTourney.address,
            country: this.selectedTourney.country,
            score1: 0,
            score2: 0,
            direction: Direction.OneWay
        };
    }
}

