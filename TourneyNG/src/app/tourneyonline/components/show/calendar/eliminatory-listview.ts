import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class CalendarEliminatoryListView extends AbstractEliminatoryListView {
    static autoRedirect: string = 'calendar/lv/dv';
    
    constructor(
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(CalendarEliminatoryListView.autoRedirect, tourneyService, meetingService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        // this.prepareClassificationGui();
    }
    
    // private prepareClassificationGui(): void {
        
    //     let allRounds: Array<Round> = new Array<Round>();

    //     let el = this.selectedEliminatoryLevel;

    //     for(let e of el.eliminatories) {
    //         allRounds.push(e.round);
    //     }
        
    //     this.eliminatoryRows = super.prepareEliminatoryRound(allRounds, el.isOneway);

    //     for(let er of this.eliminatoryRows) {
    //         er.roundName += "° Eliminatoria"; 
    //     }
    // }

    /**
     * Specializes the corresponing base method to prepare the meeting list GUI found in the 
     * received list of rounds
     * 
     * @param rounds the list of round containg the meetings
     */
    protected prepareRoundsGui(rounds: Round[]): any[] {
        return super.prepareCalendarGui(rounds);
    }
}

