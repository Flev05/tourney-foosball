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
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { Player } from 'app/tourneyonline/domain/player';
import { Match } from 'app/tourneyonline/domain/match';

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
        this.isRoundAutoGen = this.meetingRoundService.isRoundAutoGen;

        if( this.teamService.addedTeamInProgress != null ) {
            this.addMeetingsForAddedTeams();
        }

        this.refreshTeams(); 
    }

    private refreshTeams() {
        this.teams = [];
        for (let tn of this.selectedRound.teamNames) {
            let t: Team | null = TeamService.getTeamByName(this.selectedTourney, tn);
            if (t == null) {
                t = new Team();
                t.teamName = tn;
                t.address = "Indirizzo " + tn;
            }
            this.teams.push(t);
        }
    }

    private addMeetingsForAddedTeams(): void {
        if( this.teamService.addedTeamInProgress != null ) {
            this.selectedRound.daysNo++;
            const onewayMeetings : Meeting[] = [];
            const roundtripMeetings : Meeting[] = [];
            for( let t of this.selectedRound.teamNames ) {
                let m = new Meeting();
                onewayMeetings.push(m);
                this.selectedRound.addedTeamInProgressList.push(m); // add to addedTeamInProgressList only to print the PDF alone
                m.datetime = this.selectedTourney.datetime;
                m.day = this.selectedRound.daysNo;
                m.direction = Direction.OneWay;
                m.teamName1 = this.teamService.addedTeamInProgress;
                m.teamName2 = t;
                m.name = m.teamName1 + " <--> " + m.teamName2;
                
                let match : Match = new Match();
                m.matches.push(match);
                let p1 : Player = new Player();
                p1.playerName = m.teamName1;
                match.players1.push(p1);
                let p2 : Player = new Player();
                p2.playerName = m.teamName2;
                match.players2.push(p1);

                m = new Meeting();
                roundtripMeetings.push(m);
                m.datetime = this.selectedTourney.datetime;
                m.day = this.selectedRound.daysNo;
                m.direction = Direction.RoundTrip;
                m.teamName1 = t; 
                m.teamName2 = this.teamService.addedTeamInProgress;
                m.name = m.teamName1 + " <--> " + m.teamName2;
                
                match = new Match();
                m.matches.push(match);
                p1 = new Player();
                p1.playerName = m.teamName1;
                match.players1.push(p1);
                p2 = new Player();
                p2.playerName = m.teamName2;
                match.players2.push(p1);
            }
            this.selectedRound.teamNames.push(this.teamService.addedTeamInProgress);
            this.selectedRound.teamNo = "" + this.selectedRound.teamNames.length;
            let nt: Team | null = TeamService.getTeamByName(this.selectedTourney, this.teamService.addedTeamInProgress);
            if( nt != null ) {
                nt.teamName = this.teamService.addedTeamInProgress;
                let split = nt.teamName.split("-");
                if( split.length == 1 ) {
                    split = nt.teamName.split(" ");
                }   
                const defender = split[0];
                const offender = split[1];
                const p1 : Player = new Player();
                p1.playerName = defender.trim();
                const p2 : Player = new Player();
                p2.playerName = offender.trim();
                nt.players = [p1, p2];
            }

            this.teamService.addedTeamInProgress = null;
            this.refreshTeams(); 
            this.meetingRoundService.addInProgressRoundMeetings(this.selectedTourney
                , this.selectedRound.id
                , onewayMeetings
                , roundtripMeetings 
            );

            let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, false);
            const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
            subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => {});
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
        // if(this.isRoundAutoGen == 'false') {
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
        // }
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
        this.selectedRound.teamNames = [];
        for (let t of this.teams) {
            this.selectedRound.teamNames.push(t.teamName);
        }
        let index = this.selectedTourney.roundVO.rounds.indexOf(this.selectedRound);
        if( index != -1 ) {
            this.selectedTourney.roundVO.rounds[index] = this.selectedRound;
            this.meetingRoundService.createRoundMeeting(this.selectedTourney, this.selectedRound);
            this.meetingRoundService.saveRoundMeetings(this.selectedTourney
                ,(m,t) => this.saveTourneyErrorHandler(m,t)
                ,(m,t) => this.subscribeErrorHandler(m,t)
                ,()    => {}
            );
        }
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => this.goBack());
    }

    addTeamToRound() {
        console.log("Entering addTeamToRound()");
        this.tourneyService.selectedRound = this.selectedRound;
        this.router.navigate([TeamDetailView.redirect], { 
            queryParams: { tourneyTeams: true
                , chaosEnabled: this.selectedTourney.chaosEnabled
                , addTeamInProgress:true
            }
        });
    }

    printPdfInProgressMeeting() {
        this.meetingRoundService.printPdfSingleRound(this.selectedTourney, this.selectedRound,  this.selectedRound.addedTeamInProgressList);
    }

    // Move row up by one position
    moveUp(index: number) {
        if (index > 0) {
            const temp = this.teams[index];
            this.teams[index] = this.teams[index - 1];
            this.teams[index - 1] = temp;
        }
    }

    // Move row down by one position
    moveDown(index: number) {
        if (index < this.teams.length - 1) {
            const temp = this.teams[index];
            this.teams[index] = this.teams[index + 1];
            this.teams[index + 1] = temp;
        }
    }

    // Move row all the way to the top
    moveToTop(index: number) {
        if (index > 0) {
            const item = this.teams.splice(index, 1)[0];
            this.teams.unshift(item);
        }
    }

    // Move row all the way to the bottom
    moveToBottom(index: number) {
        if (index < this.teams.length - 1) {
            const item = this.teams.splice(index, 1)[0];
            this.teams.push(item);
        }
    }
}
