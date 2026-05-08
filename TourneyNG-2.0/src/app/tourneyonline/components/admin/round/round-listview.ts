import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Round } from '../../../domain/round';
import { TourneyService } from '../../../service/tourney-service';
import { Team } from '../../../domain/team';
import { TableCols } from '../../../domain/table-cols';
import { TeamService } from '../../../service/team-service';
import { AbstractListView } from '../../../components/common/abstract-listview';
import { TeamDetailView } from '../../../components/admin/team/team-detailview';
import { MeetingRoundService } from './meeting-round-service';
import { MeetingDb } from '../../../domain/meeting-db';
import { TourneyVO } from '../../../domain/tourney.vo';
import { ClientService } from '../../../service/client-service';
import * as XLSX from 'xlsx';
import { Meeting } from '../../../domain/meeting';
import { MeetingService } from '../../../service/meeting-service';
import { MeetingDto } from './meeting-dto';
import { DateFormatPipe } from '../../common/date-format-pipe';

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
        this.teamService.readOnly = false;
        this.isRoundAutoGen = this.meetingRoundService.isRoundAutoGen;

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

    private getOnewayMeetingsOfDay(md: number) : Meeting[] {
        let onewayMeetingDaysMap = this.meetingRoundService.onewayMeetingDaysMap;
        let onewayMeetings = onewayMeetingDaysMap.get(md);
        if( onewayMeetings ) {
            onewayMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
            return onewayMeetings;
        }
        return [];
    }

    private getRoundtripMeetingsOfDay(md: number) : Meeting[]{
        let roundtripMeetingDaysMap = this.meetingRoundService.roundtripMeetingDaysMap;
        let roundtripMeetings = roundtripMeetingDaysMap.get(md);
        if( roundtripMeetings ) {
            roundtripMeetings.sort((m1, m2) => this.meetingService.sortMeeting(m1, m2));
            return roundtripMeetings;
        }
        return [];
    }

    public printExcelMeeting() {    
        const workbook = XLSX.utils.book_new();
        let meetings : MeetingDto[] = [];
        for( let r of this.selectedTourney.roundVO.rounds ) {
            this.meetingRoundService.prepareMeetingsMap(r); 
            for( let md = 1; md <= r.daysNo; md ++ ) {
                let ms = this.getOnewayMeetingsOfDay(md);
                let newDate = new Date(ms[0].datetime);
                let range = this.meetingService.getWeekDaysRange(newDate);
                let dto = new MeetingDto();
                dto.round = r.name;
                dto.direction = "Andata,";
                dto.separator = true;
                dto.md = md;
                dto.days = r.daysNo;
                dto.weekRange = range;
                meetings.push(dto);
                for( let m of ms ) {
                    let dto = {round: r.name,direction: "Andata,", separator: false, md: m.day, days: r.daysNo, weekRange: range, meeting: m};
                    meetings.push(dto);
                }
            } 
            for( let md = 1; md <= r.daysNo; md ++ ) {
                let ms = this.getRoundtripMeetingsOfDay(md);
                let newDate = new Date(ms[0].datetime);
                let range = this.meetingService.getWeekDaysRange(newDate);
                let dto = new MeetingDto();
                dto.round = r.name;
                dto.direction = "Ritorno,";
                dto.separator = true;
                dto.md = md;
                dto.days = r.daysNo;
                dto.weekRange = range;
                meetings.push(dto);
                for( let m of ms ) {
                    let dto = {round: r.name,direction: "Ritorno,", separator: false, md: m.day, days: r.daysNo, weekRange: range, meeting: m};
                    meetings.push(dto);
                }
            } 
        }
        const workSheetData = meetings.map((dto) => {
            if( dto.separator ) {
                return {
                    Giornata: dto.round + ": " + dto.direction + " Settimana " + dto.weekRange + ", Giornata " + dto.md + "/" + dto.days
                };    
            }
            return {
                "In Casa": dto.meeting.teamName1,
                Data:  this.dateFormatPipe.transformWeek(dto.meeting.datetime),
                "In Trasferta": dto.meeting.teamName2,
            };
        })
        const worksheet = XLSX.utils.json_to_sheet(workSheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Meetings" );
        XLSX.writeFile(workbook, this.selectedTourney.tourneyName + "-Meetings.xlsx");
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
}
