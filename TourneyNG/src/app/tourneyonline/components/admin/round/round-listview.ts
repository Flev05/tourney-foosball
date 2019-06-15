import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Team } from 'app/tourneyonline/domain/team';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from '../../common/abstract-listview';
import { TeamDetailView } from '../team/team-detailview';

@Component({
    templateUrl: './round-listview.html',
})
export class RoundListView extends AbstractListView {
    static meetingListviewRedirect: string = "adminround/lv/meetingLv";
    
    cols: TableCols[] = TeamService.cols;
    selectedTeam: Team;
    teams: Team[];

    selectedRound: Round;

    constructor(
        protected location: Location,
        protected router: Router,
        protected tourneyService: TourneyService,
        public teamService: TeamService,
    ) { 
        super(TeamDetailView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("RoundPickList.ngOnInit() ");

        super.ngOnInit();
        
        this.selectedRound = this.tourneyService.selectedRound;

        this.teams = [];
        for (let t of this.selectedRound.teams ) {
            this.teams.push(t);
        } 
    }
 
    goMeeting() {        
        this.router.navigate([RoundListView.meetingListviewRedirect]);
    }
    
    goBack(): void {
        super.goBack();
    }
 
    onRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedTeam;
        this.gotoDetailView();
    }
}
