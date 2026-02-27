import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { AbstractResultEliminatoryListView } from 'app/tourneyonline/components/common/abstract-result-eliminatory-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { ClassificationDetailView } from '../classification/classification-detailview';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';

@Component({
    templateUrl: './eliminatory-listview.html',
    styleUrls: ['../classification/classification-view.css']
    
})
export class EliminatoryListView extends AbstractResultEliminatoryListView {
    constructor(
        public tourneyService: TourneyService
        ,protected meetingService: MeetingService
        ,protected levelService: LevelService
        ,protected clientService: ClientService
        ,protected router: Router
        ,protected location: Location
        ,public dfp: DateFormatPipe
        ,public loginService: LoginService
        ,private teamService: TeamService
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, meetingService, levelService, clientService, router, location, dfp)
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.meetingService.abstractRoundVO = this.tourneyService.selectedEliminatoryLevel.abstractRoundVO;
        this.levelService.selectedTourney = this.selectedTourney;
        this.isOneway = this.meetingService.abstractRoundVO.direction == Direction.OneWay ? "true" : "false";
        this.isRoundTrip = this.isOneway == "true" ? false : true;
        if(this.tourneyService.selectedEliminatoryLevelIndex==-1) {
            this.levelService.loadAllEliminatoryBMeetingByIdList(this.selectedTourney.eliminatoryBLevels, () => this.onEliminatoryBLoadComplete(), e => this.serverUnreachableHandler(e));
        } else {
            this.levelService.loadAllEliminatoryMeetingByIdList(this.selectedTourney.eliminatoryLevels, () => this.onEliminatoryLoadComplete(), e => this.serverUnreachableHandler(e));
        }
    }

    private onEliminatoryLoadComplete(): void {
        super.onLoadComplete(this.selectedTourney.eliminatoryLevels, false);
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols.concat(this.tourneyService.classificationCols);
        this.teamService.setMeetingAddress(this.onewayMeetings,this.roundtripMeetings);
        this.updateTourney();
    }
    
    private onEliminatoryBLoadComplete(): void {
        super.onLoadComplete(this.selectedTourney.eliminatoryBLevels, true);
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols.concat(this.tourneyService.classificationCols);
        this.teamService.setMeetingAddress(this.onewayMeetings,this.roundtripMeetings);
        this.updateTourney();
    }

    private updateTourney(): void {
        console.log("Entering updateTourney()");
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => {}, e => this.subscribeErrorHandler(e), () => {});
    }

    onClassifcationRowSelect(event) {
        console.log(event.data);
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.tourneyService.selectedEliminatoryLevel.name);
        this.router.navigate([ClassificationDetailView.redirect]);
    }
}

