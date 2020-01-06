import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { DateFormatPipe } from '../../common/date-format-pipe';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingPlayoffService } from '../../admin/playoff/meeting-playoff-service';
import { LevelService } from '../../admin/eliminatory/level-service';
import { AbstractPlayoffResultListView } from '../../common/abstract-playoff-result-listview';
import { ClassificationDetailView } from '../classification/classification-detailview';
import { Classification } from 'app/tourneyonline/domain/classification';

@Component({
    templateUrl: './playoff-result-listview.html',
    styleUrls: ['../classification/classification-view.css']
})
export class PlayoffResultListView extends AbstractPlayoffResultListView {
    selectedClassificationRow: Classification;

    constructor( public tourneyService: TourneyService
        , protected meetingPlayoffService: MeetingPlayoffService
        , protected meetingService: MeetingService
        , protected router: Router
        , protected location: Location
        , protected dfp: DateFormatPipe
        , protected levelService: LevelService
    ) {
        super(MeetingDetailView.meetingDvRedirect
            , tourneyService
            , meetingPlayoffService
            , meetingService
            , router
            , location
            , dfp
            , levelService
            );
    }

    ngOnInit() {
        super.ngOnInit();
     }

     onClassifcationRowSelect(event) {
        console.log(event.data);
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.selectedPlayoff.round.name);
        this.router.navigate([ClassificationDetailView.redirect]);
    }

}

