import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MeetingDto } from 'app/tourneyonline/components/admin/round/meeting-dto';
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';

@Component({
    selector: 'app-team-matches',
    templateUrl: './team-matches.component.html',
    styleUrls: ['./team-matches.component.css']
})
export class TeamMatchesComponent implements OnInit {
    @Input() teamName: string = "";

    homeMeetings: MeetingDto[] = [];
    awayMeetings: MeetingDto[] = [];

    constructor(
        protected tourneyService: TourneyService,
        protected teamService: TeamService,
        protected meetingRoundService: MeetingRoundService,
        protected dfp: DateFormatPipe
    ) {
    }
 
    ngOnInit() {
        this.homeMeetings = [];
        for (let r of this.tourneyService.selectedTourney.roundVO.rounds) {
            this.meetingRoundService.prepareMeetingsMap(r);
            for( let md = 1; md <= r.daysNo; md ++ ) {
                let mArray : Meeting[] = this.meetingRoundService.getOnewayMeetingsOfDay(md);
                for( let m of mArray ) {
                    if( m.teamName1 == this.teamName || m.teamName2 == this.teamName ) {
                        let dto: MeetingDto = {round: r.name, direction: "Andata", separator: false, md: m.day, days: r.daysNo, weekRange: null, meeting: m};
                        this.homeMeetings.push(dto);
                    }
                }
            } 
        }
        this.awayMeetings = [];
        for (let r of this.tourneyService.selectedTourney.roundVO.rounds) {
            this.meetingRoundService.prepareMeetingsMap(r);
            for( let md = 1; md <= r.daysNo; md ++ ) {
                let mArray : Meeting[] = this.meetingRoundService.getRoundtripMeetingsOfDay(md);
                for( let m of mArray ) {
                    if( m.teamName1 == this.teamName || m.teamName2 == this.teamName ) {
                        let dto: MeetingDto = {round: r.name,direction: "Ritorno", separator: false, md: m.day, days: r.daysNo, weekRange: null, meeting: m};
                        this.awayMeetings.push(dto);
                    }
                }
            } 
        }
    }
}
