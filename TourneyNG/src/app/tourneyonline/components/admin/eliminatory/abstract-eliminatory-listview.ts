import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { EliminatoryMode, Direction } from 'app/tourneyonline/domain/enumerations';

export abstract class AbstractEliminatoryListView extends AbstractListView {
    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;

    eliminatoryMode: EliminatoryMode;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    isPlayoff: boolean;
    isManual: boolean;

    isTopLevel: boolean;

    isOneway: string;
    isStandalone: boolean;

    constructor(
        protected redirect: string,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
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

        this.isStandalone = this.tourneyService.isStandalone;
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
                    this.tourneyService.deleteMeeting(e.round.meetings[1]);
                    e.round.meetings.splice(1, 1);
                }
            } else {
                let m = this.createMeeting(e.round.meetings[0].team2, e.round.meetings[0].team1, null, null, Direction.RoundTrip);
                e.round.meetings.push(m);

                this.tourneyService.addMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);
            }
        }
    }

}

