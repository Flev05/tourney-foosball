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
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

@Component({
    templateUrl: './round-listview.html',
})
export class RoundListView extends AbstractListView {
    static meetingListviewRedirect: string = "adminround/lv/meetingLv";
    
    cols: TableCols[] = TeamService.cols;
    selectedTeam: Team;
    teams: Team[];

    selectedRound: Round;
    mdbList:  MeetingDb[];

    constructor(
        protected location: Location,
        protected router: Router,
        protected tourneyService: TourneyService,
        protected meetingRoundService: MeetingRoundService,
        public teamService: TeamService,
    ) { 
        super(TeamDetailView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("RoundPickList.ngOnInit() ");

        super.ngOnInit();
        
        this.selectedRound = this.tourneyService.selectedRound;
        this.teamService.readOnly = false;

        this.teams = [];
        for (let tn of this.selectedRound.teamNames ) {
            let t: Team = TeamService.getTeamByName(this.selectedTourney, tn);
            let clone: Team = this.cloneObject(t);
            this.teams.push(clone);
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
        this.teamService.readOnly = true;
        this.gotoDetailView();
    }
}
