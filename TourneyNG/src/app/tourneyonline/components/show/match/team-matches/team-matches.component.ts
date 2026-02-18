import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeetingDto } from 'app/tourneyonline/components/admin/round/meeting-dto';
import { Meeting } from 'app/tourneyonline/domain/meeting';

@Component({
  selector: 'app-team-matches',
  templateUrl: './team-matches.component.html',
  styleUrls: ['./team-matches.component.css']
})
export class TeamMatchesComponent implements OnChanges {
    @Input() allMeetings: MeetingDto[] = [];
    @Input() teamName: string = "";

    filteredMeetings: MeetingDto[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['teamName'] || changes['allMeetings']) {
            this.filterMatches();
        }
    }

    filterMatches() {
        if (!this.teamName) {
            this.filteredMeetings = [];
            return;
        }

        this.filteredMeetings = this.allMeetings.filter(dto => {
            // Ensure we only look at rows that actually contain a Meeting object
            if (!dto.meeting) return false;
            const m = dto.meeting;
            return m.teamName1 === this.teamName || m.teamName2 === this.teamName;
        });
    }

    // Helper to determine the opponent's name
    getOpponent(m: Meeting): string {
        return m.teamName1 === this.teamName ? m.teamName2 : m.teamName1;
     }
}
