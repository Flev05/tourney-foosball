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
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Meeting } from 'app/tourneyonline/domain/meeting';

const ROUND_CHANGE_TEAMS_POPUP = "ATTENZIONE! L'operazione ricrea tutti gli incontri fra le squadre del girone facendo perdere tutte le impostazioni preesistenti. Confermi?";

@Component({
    templateUrl: './round-listview.html',
    standalone: false
})
export class RoundListView extends AbstractListView {
    static meetingListviewRedirect: string = "adminround/lv/meetingLv";
    
    cols: TableCols[] = TeamService.cols;
    selectedTeam: Team = new Team();
    teams: Team[] = [];

    selectedRound: Round = new Round();
    mdbList:  MeetingDb[] = [];
    isRoundAutoGen: string = "";

    constructor(
        protected override location: Location,
        protected override router: Router,
        protected override tourneyService: TourneyService,
        protected meetingRoundService: MeetingRoundService,
        public teamService: TeamService,
        private clientService: ClientService,
        public meetingService: MeetingService,
        protected dateFormatPipe: DateFormatPipe
    ) { 
        super(TeamDetailView.redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        console.log("RoundPickList.ngOnInit() ");
        super.ngOnInit();
        this.selectedRound = this.tourneyService.selectedRound;
        // this.teamService.readOnly = false;
        this.isRoundAutoGen = this.meetingRoundService.isRoundAutoGen;

        if( this.teamService.addedTeamInProgress != null ) {
            for( let t of this.selectedRound.teamNames ) {
                if( t !== this.teamService.addedTeamInProgress) {
                    const m = new Meeting();
                    m.teamName1 = this.teamService.addedTeamInProgress;
                    m.teamName2 = t;
                    m.name = m.teamName1 + " - " + m.teamName2;
                    this.selectedRound.roundtripMeetings.push(m);
                }
            }
        }
        this.teams = [];
        for (let tn of this.selectedRound.teamNames ) {
            let t = TeamService.getTeamByName(this.selectedTourney, tn);
            if(t == null) {
                t = new Team();
                t.teamName = tn;
                t.address = "Indirizzo " + tn;
            }
            this.teams.push(t);
        } 
    }

    addTeam() {
        this.router.navigate([TeamDetailView.redirect], { 
            queryParams: { tourneyTeams: true, chaosEnabled:false}
        });
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
            // let tvo = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
            this.meetingRoundService.saveRoundMeetings(this.selectedTourney
                ,(m,t) => this.saveTourneyErrorHandler(m,t)
                ,(m,t) => this.subscribeErrorHandler(m,t)
                ,()    => {this.goMeeting();}
            );
        }
    }

    override goBack(): void {
        super.goBack();
    }
 
    onRowSelect(event : any) {
        console.log(event.data);
        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = false;
        if(this.isRoundAutoGen == 'true') {
            this.teamService.isRoundAutoGen = 'true';
        } else {
            this.teamService.isRoundAutoGen = 'false';
        }
        this.gotoDetailView();
    }

    saveRound(): void {
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => this.goBack());
    }

    addTeamToRound() {
        console.log("Entering addTeamToRound()");
        this.router.navigate([TeamDetailView.redirect], { 
            queryParams: { tourneyTeams: true, chaosEnabled: this.selectedTourney.chaosEnabled, addTeamInProgress:true}
        });
    }
}
