import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Team } from 'app/tourneyonline/domain/team';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TeamDetailView } from 'app/tourneyonline/components/admin/team/team-detailview';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';

const ROUND_CHANGE_TEAMS_POPUP = "ATTENZIONE! L'operazione ricrea tutti gli incontri fra le squadre del girone facendo perdere tutte le impostazioni preesistenti. Confermi?";

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
    isRoundAutoGen: string;

    constructor(
        protected location: Location,
        protected router: Router,
        protected tourneyService: TourneyService,
        protected meetingRoundService: MeetingRoundService,
        public teamService: TeamService,
        private clientService: ClientService
    ) { 
        super(TeamDetailView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("RoundPickList.ngOnInit() ");

        super.ngOnInit();
        
        this.selectedRound = this.tourneyService.selectedRound;
        this.teamService.readOnly = false;
        this.isRoundAutoGen = this.meetingRoundService.isRoundAutoGen;

        this.teams = [];
        for (let tn of this.selectedRound.teamNames ) {
            let t: Team = TeamService.getTeamByName(this.selectedTourney, tn);
            if(t == null) {
                t = {teamName: tn, address: "Indirizzo " + tn};
            }
            let clone: Team = this.cloneObject(t);
            this.teams.push(clone);
        } 
    }
 
    goMeeting() {
        const subsbr = this.meetingRoundService.loadRoundMeeting(this.selectedTourney, this.selectedRound);
        subsbr.subscribe(mdbList => this.onCompleteLoad(mdbList), e => this.onError(e) );
    }

    private onCompleteLoad(mdbList: MeetingDb[]): void {
        this.meetingRoundService.selectedTourney = this.selectedTourney;
        this.meetingRoundService.onCompleteLoad(this.selectedRound, mdbList, () => {this.router.navigate([RoundListView.meetingListviewRedirect]);});
    }

    redoMeetings() {        
        if(this.isRoundAutoGen == 'false') {
            if(!confirm(ROUND_CHANGE_TEAMS_POPUP)) {
                return;
            } 
            this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;
            for( let r of this.selectedTourney.roundVO.rounds ) {
                this.meetingRoundService.createRoundMeeting(this.selectedTourney, r);
            }
            this.meetingRoundService.saveRoundMeetings(this.selectedTourney
                ,(m,t) => this.saveTourneyErrorHandler(m,t)
                ,(m,t) => this.subscribeErrorHandler(m,t)
                ,()    => {this.goMeeting();}
            );
        }
    }

    goBack(): void {
        super.goBack();
    }
 
    onRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = false;
        if(this.isRoundAutoGen == 'true') {
            this.teamService.readOnly = true;
            this.teamService.isRoundAutoGen = 'true';
        } else {
            this.teamService.readOnly = false;
            this.teamService.isRoundAutoGen = 'false';
        }
        this.gotoDetailView();
    }

    saveRound(): void {
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => this.goBack());
    }
}
