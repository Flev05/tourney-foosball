import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Classification } from 'app/tourneyonline/domain/classification';
import { TeamService } from 'app/tourneyonline/service/team-service';

@Component({
    templateUrl: './classification-detailview.html',
})
export class ClassificationDetailView extends AbstractDetailView {
    public static redirect : string = "/classification/dv";
    selectedClassificationRow:  Classification;
    selectedClassificationName: string;
    playerLv: boolean = true;
    addPlayerEnabled : boolean = false;

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected teamService: TeamService,
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("ClassificationDetailView.ngOnInit() ");
        this.selectedClassificationRow = this.tourneyService.selectedClassificationRow;
        let teamName = this.selectedClassificationRow.teamName.replace("*","").trim();
        let index = this.tourneyService.selectedTourney.teams.findIndex( e => e.teamName === teamName);
        if(index !== -1) {
            this.teamService.selectedTeam = this.tourneyService.selectedTourney.teams[index];
        }
        this.selectedClassificationName = this.tourneyService.getClassificationName();
        super.ngOnInit();
    }
}
