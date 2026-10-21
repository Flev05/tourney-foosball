import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Classification } from 'app/tourneyonline/domain/classification';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Team } from 'app/tourneyonline/domain/team';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './classification-detailview.html',
    standalone: false
})
export class ClassificationDetailView extends AbstractDetailView {
    public static redirect : string = "/classification/dv";
    selectedClassificationRow:  Classification = new Classification();
    selectedClassificationName: string = "";

    addPlayerEnabled : boolean = false;
    teamName: string = "";
    selectedTeam: Team = new Team();
    detachedClassificationPoint: number = 0;

    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected teamService: TeamService,
        protected meetingRoundService: MeetingRoundService,
        protected dfp: DateFormatPipe,
        private   route: ActivatedRoute
    ) {
        super(tourneyService, location);
    }

    override ngOnInit() {
        console.log("ClassificationDetailView.ngOnInit() ");
        
        this.route.queryParams.subscribe(params => {
            this.detachedClassificationPoint = params['detachedClassificationPoint'];
        });

        this.selectedClassificationRow = this.tourneyService.selectedClassificationRow;
        let teamName = this.selectedClassificationRow.teamName.replace("*","").trim();
        let index = this.tourneyService.selectedTourney.teams.findIndex( e => e.teamName === teamName);
        if(index !== -1) {
            this.teamService.selectedTeam = this.tourneyService.selectedTourney.teams[index];
        }

        this.selectedClassificationName = this.tourneyService.getClassificationName();

        this.teamName = this.selectedClassificationRow.teamName;
        this.selectedTeam = this.teamService.selectedTeam;

        super.ngOnInit();
    }
}
